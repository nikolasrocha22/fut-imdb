# Documento de Design Técnico: FutNota v2 (Arquitetura Escalável & Real-Time)

Este documento descreve a especificação arquitetural para a migração e evolução do **FutNota** (o IMDb das partidas de futebol) de um protótipo estático cliente-único para uma plataforma fullstack escalável e em tempo real.

---

## 1. Resumo do Entendimento

O **FutNota v2** será um sistema web completo que permite aos usuários acompanhar placares de futebol em tempo real, consultar estatísticas, escalações e, ao final de cada partida, avaliar e resenhar o jogo com notas de 0 a 10. As notas médias das partidas serão recalculadas de forma consistente no banco de dados e as partidas serão classificadas em um ranking geral ordenado por popularidade e notas (estilo IMDb).

---

## 2. Requisitos Não-Funcionais & Premissas

* **Escala**: Suportar até 1.000 usuários simultâneos ouvindo placares via Server-Sent Events (SSE) e catalogar mais de 10.000 partidas históricas no banco.
* **Desempenho**: Tempo de resposta médio das requisições REST < 100ms. Latência na propagação do tempo real < 1 segundo.
* **Segurança**: Senhas de usuários criptografadas com `bcrypt`. Autenticação por JWT (JSON Web Tokens). Rate limiting baseado em Redis para impedir spam de avaliações.
* **Cache**: Armazenamento em memória (Redis) para a lista de Ranking Geral e para os dados de partidas muito populares já encerradas, aliviando o banco de dados.

---

## 3. Abordagem Arquitetural Escolhida: Monorepo (React + Node.js)

Optou-se por construir o projeto em um monorepo para facilitar o desenvolvimento integrado e o compartilhamento estático de tipos TypeScript, mantendo a independência na compilação e deploy do frontend e do backend.

### Estrutura do Repositório:

```text
footrate-monorepo/
├── package.json               # Configuração dos npm/pnpm workspaces
├── packages/
│   └── shared/                # Contratos e tipos TypeScript comuns (Match, User, Review)
└── apps/
    ├── client/                # Frontend desenvolvido em React (Vite)
    └── server/                # Backend desenvolvido em Node.js (TypeScript + Fastify/Express)
```

---

## 4. Fluxo de Dados e Tempo Real (SSE & Redis Pub/Sub)

Para garantir atualizações rápidas e estáveis nos placares:

1. **Conexão**: O cliente React abre uma conexão HTTP de longa duração com o endpoint do servidor Node.js via `new EventSource('/api/matches/live/sse')`.
2. **Ingestão Híbrida**: O servidor roda um job em background que consome dados de APIs reais de futebol de mercado, e possui um modo simulador local para testes controlados.
3. **Distribuição**: Quando novos placares chegam, eles são gravados no banco PostgreSQL. Em seguida, o worker publica um evento no canal Redis Pub/Sub (`match:updates`).
4. **Broadcast**: Os servidores Node.js ativamente inscritos no Redis capturam o evento e o enviam instantaneamente pelo fluxo HTTP SSE dos clientes conectados ao jogo.

---

## 5. Modelagem de Dados (PostgreSQL + Prisma ORM)

```prisma
model User {
  id           String   @id @default(uuid())
  username     String   @unique
  email        String   @unique
  passwordHash String
  reviews      Review[]
  createdAt    DateTime @default(now())
}

model Match {
  id               String       @id
  league           String
  homeTeam         String
  awayTeam         String
  status           MatchStatus  // ENUM: LIVE, COMPLETED, SCHEDULED
  scoreHome        Int?
  scoreAway        Int?
  rating           Float        @default(0.0)
  votesCount       Int          @default(0)
  stadium          String
  referee          String
  date             DateTime
  reviews          Review[]
}

model Review {
  id        String   @id @default(uuid())
  userId    String
  matchId   String
  rating    Float
  text      String?  @db.Text
  likes     Int      @default(0)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  match     Match    @relation(fields: [matchId], references: [id])

  @@unique([userId, matchId])
  @@index([matchId])
}
```

* **Cálculo da Média de Votos**: Ao salvar um `Review`, o backend realiza uma transação SQL para somar e recalcular a média geral direto na linha da tabela `Match` (`AVG` e `COUNT`). Isso previne concorrência e inconsistências caso múltiplos usuários avaliem ao mesmo tempo.

---

## 6. Tratamento de Falhas e Edge Cases

* **Quedas de Conexão**: SSE possui reconexão nativa gerenciada pelo navegador. Conexões inativas são fechadas no backend através de pings de keep-alive a cada 30 segundos.
* **Segurança e Spam**: Índices de banco garantem que cada usuário vote apenas uma vez por jogo. Adicionalmente, um rate limiter de 5 requisições de avaliação por minuto por IP/Token é imposto via Redis.
* **Indisponibilidade da API**: O backend serve os dados salvos em cache e no banco relacional se a fonte externa falhar, garantindo alta disponibilidade do site.

---

## 7. Registro de Decisões (Decision Log)

| Decisão | Alternativas Consideradas | Motivação da Escolha |
| :--- | :--- | :--- |
| **Monorepo c/ Types Compartilhados** | Polyrepo / Monolito Next.js | Permite acoplamento de tipos TypeScript entre React e Node.js sem comprometer a escalabilidade do servidor em tempo real. |
| **Server-Sent Events (SSE)** | WebSockets / HTTP Polling | SSE consome menos recursos do servidor, possui reconexão automática e é ideal para atualizações que fluem unidirecionalmente (placar do jogo). |
| **Cálculo de Média em Transação DB** | Recálculo em memória (Node.js) | Executar `AVG` direto no PostgreSQL previne condições de corrida em picos de avaliação pós-jogo. |
| **Ingestão de Dados Híbrida** | Apenas API real / Apenas Simulador | Permite testar todos os cenários extremos de placares e notificações de forma determinística sem custos de APIs em dev. |
