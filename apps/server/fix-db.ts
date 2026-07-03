import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fotmob = (id: string) => `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;

const validFixes: Record<string, string | null> = {
  "Milan": fotmob("8564"),
  "Liverpool": fotmob("8650"),
};

async function main() {
  const matches = await prisma.match.findMany();
  for (const m of matches) {
    const finalHome = validFixes[m.homeTeam] || null;
    const finalAway = validFixes[m.awayTeam] || null;

    await prisma.match.update({
      where: { id: m.id },
      data: {
        homeLogoUrl: finalHome,
        awayLogoUrl: finalAway,
      }
    });
    console.log(`Updated ${m.homeTeam} x ${m.awayTeam}`);
  }
}

main().finally(() => prisma.$disconnect());
