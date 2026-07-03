const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const matches = await prisma.match.findMany();
  let deleted = 0;
  for (const m of matches) {
    if (!m.id.startsWith('api-')) {
      await prisma.review.deleteMany({ where: { matchId: m.id } });
      await prisma.prediction.deleteMany({ where: { matchId: m.id } });
      await prisma.aiAnalysis.deleteMany({ where: { matchId: m.id } });
      await prisma.match.delete({ where: { id: m.id } });
      deleted++;
      console.log('Deleted old match:', m.id);
    }
  }
  console.log('Total deleted:', deleted);
}
main().finally(() => prisma.$disconnect());
