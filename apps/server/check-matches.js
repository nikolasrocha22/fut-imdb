const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.match.findMany().then(m => {
  console.log('Matches:', m.length);
  console.log(m.map(x => `${x.id}: ${x.homeTeam} x ${x.awayTeam}`));
  prisma.$disconnect();
});
