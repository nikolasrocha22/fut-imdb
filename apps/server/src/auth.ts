import express from 'express';
import { prisma } from './db';
import crypto from 'crypto';

export const authRouter = express.Router();

// Função simples para hash de senha (PBKDF2)
function hashPassword(password: string): string {
  const salt = 'futnota_salt_123';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Map em memória para tokens (simulando Redis/JWT)
const activeTokens = new Map<string, string>();

authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existing) {
      return res.status(400).json({ error: 'Usuário ou e-mail já existe.' });
    }

    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: { username, email, passwordHash }
    });

    const token = crypto.randomUUID();
    activeTokens.set(token, user.id);
    
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = crypto.randomUUID();
    activeTokens.set(token, user.id);
    
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware de autenticação
export function requireAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }
  req.userId = activeTokens.get(token);
  next();
}

// Personal Ranking
authRouter.get('/me/ranking', requireAuth, async (req: any, res: any) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.userId },
      include: {
        match: true
      },
      orderBy: { rating: 'desc' }
    });
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.put('/me/reviews/:reviewId', requireAuth, async (req: any, res: any) => {
  const { reviewId } = req.params;
  const { rating, text } = req.body;
  if (rating === undefined || rating < 0 || rating > 10) {
    return res.status(400).json({ error: 'Nota inválida.' });
  }
  
  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== req.userId) {
      return res.status(403).json({ error: 'Não autorizado.' });
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.review.update({
        where: { id: reviewId },
        data: { rating, text }
      });
      // Recalcular média da partida
      const allReviews = await tx.review.findMany({ where: { matchId: review.matchId } });
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await tx.match.update({
        where: { id: review.matchId },
        data: { rating: Number(avg.toFixed(1)) }
      });
    });
    
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.delete('/me/reviews/:reviewId', requireAuth, async (req: any, res: any) => {
  const { reviewId } = req.params;
  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== req.userId) {
      return res.status(403).json({ error: 'Não autorizado.' });
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: reviewId } });
      // Recalcular média
      const allReviews = await tx.review.findMany({ where: { matchId: review.matchId } });
      const avg = allReviews.length > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) : 0;
      await tx.match.update({
        where: { id: review.matchId },
        data: { rating: Number(avg.toFixed(1)) }
      });
    });
    
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
