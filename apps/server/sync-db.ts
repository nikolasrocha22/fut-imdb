import { PrismaClient } from '@prisma/client';
import { syncTodayMatches } from './src/syncService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env explicitly because this is a script
dotenv.config({ path: path.resolve(__dirname, '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('--- Limpeza e Sincronização ---');

  // Deletar dependências dos seeds primeiro
  await prisma.review.deleteMany({
    where: { matchId: { startsWith: 'seed-' } }
  });
  
  await prisma.prediction.deleteMany({
    where: { matchId: { startsWith: 'seed-' } }
  });

  await prisma.aiAnalysis.deleteMany({
    where: { matchId: { startsWith: 'seed-' } }
  });

  // Deletar as partidas de teste (seed)
  const deleted = await prisma.match.deleteMany({
    where: { id: { startsWith: 'seed-' } }
  });
  console.log(`[OK] Deletados ${deleted.count} jogos de teste do banco de dados.`);

  // Acionar a sincronização
  console.log('[OK] Iniciando sincronização com a Football-Data.org + Geração via Gemini AI...');
  await syncTodayMatches();

  console.log('[OK] Processo finalizado com sucesso!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
