# FutNota v4 — Plataforma Online de Futebol com IA em Tempo Real

O FutNota é uma plataforma moderna para amantes de futebol darem notas para os jogos, lerem análises táticas aprofundadas e acompanharem partidas em tempo real. A versão 4 transforma o projeto em um produto online integrado com a **API-Football** para obter dados reais de jogos e a **Google Gemini API** para gerar comentários em tempo real e resumos táticos inteligentes em português brasileiro.

---

## 🚀 Arquitetura e Fluxo de Funcionamento

1. **Sincronização Diária (06:00 BRT)**: Busca os jogos do dia de ligas principais (Brasileirão Série A/B, Copa do Brasil, Champions League, Copa do Mundo, etc.) e salva no banco de dados.
2. **Tempo Real (Live Poller)**: Monitora partidas ao vivo a cada 30 segundos, atualizando placar, minuto a minuto e timeline de eventos.
3. **Análises Gemini AI**:
   - **Pré-jogo**: Análise tática baseada em escalações históricas e retrospecto.
   - **Ao vivo (Minuto a Minuto)**: A cada 5 minutos, a IA analisa a partida e fornece um feedback tático de como os times estão se portando.
   - **Pós-jogo**: Resumo completo com destaques e pontos chaves do jogo.
4. **Visualizações Interativas**: Gráficos construídos com **Recharts** exibindo estatísticas ao vivo como radar de desempenho, posse de bola e chutes.

---

## 🛠️ Como Configurar Localmente

### 1. Requisitos
- **Node.js** (versão 20 ou superior)
- **npm** (incluso com o Node)
- Banco de dados **PostgreSQL** ativo (ex: Neon.tech, ou local)

### 2. Configurando Variáveis de Ambiente
Copie o arquivo `.env.example` para `apps/server/.env` e configure suas credenciais:
```bash
cp .env.example apps/server/.env
```
Campos obrigatórios a preencher:
- `DATABASE_URL`: URL de conexão do PostgreSQL.
- `RAPID_API_KEY`: Sua chave obtida no [RapidAPI](https://rapidapi.com/api-sports/api/api-football).
- `GEMINI_API_KEY`: Sua chave obtida no [Google AI Studio](https://aistudio.google.com/apikey).

*(Nota: Se as chaves `RAPID_API_KEY` ou `GEMINI_API_KEY` não forem configuradas, o servidor entrará em modo de fallback gracioso, rodando a partir do seed estático e do simulador de partidas local).*

### 3. Instalando as Dependências e Compilando
Na raiz do monorepo, execute:
```bash
# Instala todas as dependências nos workspaces
npm install

# Executa as migrações do Prisma no banco PostgreSQL
npm run prisma:migrate --workspace=apps/server

# Compila todos os pacotes e aplicações
npm run build
```

### 4. Rodando em Desenvolvimento
Para iniciar tanto o frontend quanto o backend em modo hot-reload:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

---

## 🌐 Instruções de Deploy na Nuvem

### Backend (Servidor Express) — Railway

O backend está dockerizado e pronto para deploy automático no **Railway** através do arquivo `railway.toml`.

1. Crie uma conta em [Railway.app](https://railway.app/).
2. Crie um novo projeto e selecione **"Deploy from GitHub repo"**.
3. Escolha o repositório da aplicação.
4. Adicione as seguintes variáveis de ambiente (Variables) na interface do Railway:
   - `DATABASE_URL` (use a string do Neon.tech)
   - `REDIS_URL` (opcional, para canais SSE resilientes, ou deixe em branco para fallback em memória)
   - `RAPID_API_KEY`
   - `RAPID_API_HOST`
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`
   - `PORT=3001`
5. O Railway detectará o `Dockerfile` e fará o build multi-stage do monorepo, rodando as migrações automaticamente no banco de dados Neon e iniciando o servidor na porta correspondente.

### Frontend (React + Vite) — Vercel ou Netlify

O frontend pode ser publicado facilmente na **Vercel**:

1. Conecte seu repositório na [Vercel](https://vercel.com/).
2. Configure as seguintes definições do projeto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `apps/client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Adicione a variável de ambiente:
   - `VITE_API_URL`: URL do seu servidor backend publicado no Railway (ex: `https://seu-backend.up.railway.app`).
4. Clique em **Deploy**.

---

## 🗃️ Estrutura do Banco de Dados (Prisma PostgreSQL)

- **`User`**: Gerenciamento de usuários.
- **`Match`**: Armazena as partidas do dia, com minuto atual (`liveMinute`) e estatísticas ao vivo (`liveStats`) salvas em formato JSON.
- **`Review`**: Notas de 0 a 10 e resenhas escritas pelos críticos da comunidade.
- **`Prediction`**: Palpites e análises pré-jogo de cada usuário.
- **`AiAnalysis`**: Cache local de comentários de IA categorizados por tipo (`pre_match`, `live`, `post_match`) e minuto da partida.
