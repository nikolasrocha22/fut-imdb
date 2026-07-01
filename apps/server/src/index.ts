// apps/server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma, seedDatabase } from './db';
import { redis } from './redis';
import { startMatchSimulator } from './simulator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// REST: Listar partidas
app.get('/api/matches', async (req, res) => {
  const { league } = req.query;
  try {
    const matches = await prisma.match.findMany({
      where: league && league !== 'all' ? { league: String(league) } : {},
      orderBy: { date: 'desc' }
    });

    // Desserializa os dados JSON antes de enviar para o cliente
    const parsedMatches = matches.map(m => ({
      ...m,
      timeline: JSON.parse(m.timeline || '[]'),
      lineups: m.lineups ? JSON.parse(m.lineups) : null
    }));

    res.json(parsedMatches);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// REST: Detalhes de uma partida específica (incluindo reviews)
app.get('/api/matches/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'Partida não encontrada.' });
    }

    const parsed = {
      ...match,
      timeline: JSON.parse(match.timeline || '[]'),
      lineups: match.lineups ? JSON.parse(match.lineups) : null
    };

    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// REST: Publicar uma avaliação (IMDb)
app.post('/api/matches/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { rating, text } = req.body;

  if (rating === undefined || rating < 0 || rating > 10) {
    return res.status(400).json({ error: 'Nota inválida. Deve ser entre 0 e 10.' });
  }

  try {
    const match = await prisma.match.findUnique({ where: { id } });
    if (!match) {
      return res.status(404).json({ error: 'Partida não encontrada.' });
    }

    // Pega o usuário padrão criado no seed (para simulação de auth)
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: "critico_tatico",
          email: "critico@futnota.com",
          passwordHash: "senha_hash_mock"
        }
      });
    }

    // Executa a transação para salvar a nota e recalcular a média geral da partida
    await prisma.$transaction(async (tx) => {
      // 1. Cria ou atualiza a resenha
      await tx.review.upsert({
        where: {
          userId_matchId: {
            userId: user.id,
            matchId: id
          }
        },
        create: {
          userId: user.id,
          matchId: id,
          rating: Number(rating),
          text: text || ""
        },
        update: {
          rating: Number(rating),
          text: text || ""
        }
      });

      // 2. Recalcula média de notas e total de votos
      const stats = await tx.review.aggregate({
        where: { matchId: id },
        _avg: { rating: true },
        _count: { id: true }
      });

      // 3. Atualiza o registro da partida
      await tx.match.update({
        where: { id },
        data: {
          rating: stats._avg.rating || Number(rating),
          votes: stats._count.id || 1
        }
      });
    });

    // Retorna a partida atualizada
    const updatedMatch = await prisma.match.findUnique({
      where: { id },
      include: { reviews: { orderBy: { createdAt: 'desc' } } }
    });

    const parsedMatch = {
      ...updatedMatch,
      timeline: JSON.parse(updatedMatch!.timeline || '[]'),
      lineups: updatedMatch!.lineups ? JSON.parse(updatedMatch!.lineups) : null
    };

    // Publica no Redis para notificar conexões SSE ativas
    await redis.publish('match:updates', JSON.stringify(parsedMatch));

    res.json(parsedMatch);
  } catch (err: any) {
    console.error("Erro ao salvar avaliação:", err);
    res.status(500).json({ error: err.message });
  }
});

// SSE: Streaming de placares em tempo real
app.get('/api/matches/live/sse', async (req, res) => {
  // Configura cabeçalhos SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Envia keep-alive inicial
  res.write(':ok\n\n');

  // Callback ao receber novas atualizações do simulador via Redis Pub/Sub
  const onMatchUpdate = (message: string) => {
    res.write(`data: ${message}\n\n`);
  };

  // Se inscreve no canal do Redis
  await redis.subscribe('match:updates', onMatchUpdate);
  console.log(`[SSE] Novo cliente conectado. Total de conexões ativas monitorando.`);

  // Mantém conexão viva enviando ping a cada 20s
  const intervalId = setInterval(() => {
    res.write(':keep-alive\n\n');
  }, 20000);

  // Limpa recursos ao desconectar
  req.on('close', async () => {
    clearInterval(intervalId);
    await redis.unsubscribe('match:updates', onMatchUpdate);
    console.log('[SSE] Cliente desconectado.');
    res.end();
  });
});

// Inicialização de Banco, Redis e Servidor
async function start() {
  // Conecta ao banco de dados SQLite/Postgres
  await prisma.$connect();
  console.log("Conectado ao Banco de Dados.");

  // Executa seed inicial se o banco estiver limpo
  await seedDatabase();

  // Conecta ao Redis (com fallback local em memória)
  await redis.connect();

  // Inicia o servidor HTTP
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
    // Inicia o simulador automático de jogos ao vivo
    startMatchSimulator();
  });
}

start().catch(err => {
  console.error("Falha ao iniciar o backend:", err);
});
