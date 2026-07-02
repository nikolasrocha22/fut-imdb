// apps/server/src/db.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const SEED_MATCHES = [
  {
    id: "milan-liverpool-2005",
    league: "UEFA Champions League",
    leagueEmoji: "🏆",
    homeTeam: "Milan",
    homeEmoji: "🔴",
    homeLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d1/AC_Milan_logo.svg",
    awayTeam: "Liverpool",
    awayEmoji: "🔴",
    awayLogoUrl: "https://upload.wikimedia.org/wikipedia/pt/0/0c/Liverpool_FC.svg",
    status: "completed",
    date: "2005-05-25",
    time: "20:45",
    scoreHome: 3,
    scoreAway: 3,
    penHome: 2,
    penAway: 3,
    stadium: "Atatürk Olympic Stadium, Istambul",
    referee: "Manuel Mejuto González",
    rating: 9.8,
    votes: 3840,
    tacticalAnalysis: "O Milagre de Istambul é considerado por muitos a final mais espetacular da história da Champions League. No primeiro tempo, o Milan de Carlo Ancelotti deu um show tático. Operando em um 4-4-2 com losango no meio de campo, Kaká teve liberdade absoluta flutuando nas costas de Xabi Alonso e Steven Gerrard. A transição foi mortal, resultando em três gols rápidos e uma aparente liquidação do jogo.\nNo intervalo, Rafa Benítez mudou o desenho do Liverpool para um 3-5-2 dinâmico, trazendo Dietmar Hamann para dar solidez e libertando Gerrard para atacar a área. Em uma tempestade de seis minutos, a atitude agressiva dos ingleses desestabilizou a defesa italiana, empatando o jogo.\nDudek tornou-se o herói na prorrogação e nos pênaltis, consolidando uma virada tática e psicológica lendária.",
    timeline: JSON.stringify([
      { minute: 1, type: "goal", team: "home", detail: "Gol de Maldini (Assistência de Pirlo)", icon: "⚽" },
      { minute: 23, type: "sub", team: "away", detail: "Smicer entra no lugar de Kewell", icon: "🔄" },
      { minute: 39, type: "goal", team: "home", detail: "Gol de Crespo (Assistência de Shevchenko)", icon: "⚽" },
      { minute: 44, type: "goal", team: "home", detail: "Gol de Crespo (Assistência de Kaká)", icon: "⚽" },
      { minute: 54, type: "goal", team: "away", detail: "Gol de Gerrard (Assistência de Riise)", icon: "⚽" },
      { minute: 56, type: "goal", team: "away", detail: "Gol de Smicer (Assistência de Hamann)", icon: "⚽" },
      { minute: 60, type: "goal", team: "away", detail: "Gol de Xabi Alonso (Aproveitando rebote de pênalti)", icon: "⚽" },
      { minute: 76, type: "card", team: "away", detail: "Cartão Amarelo para Carragher", icon: "🟨" },
      { minute: 120, type: "var", team: "home", detail: "Milagre duplo de Dudek impede gol de Shevchenko", icon: "🖥️" }
    ]),
    lineups: JSON.stringify({
      home: {
        formation: "4-4-2 Losango",
        players: [
          { name: "Dida", number: 1, pos: "GK", x: 50, y: 88 },
          { name: "Cafu", number: 2, pos: "LD", x: 85, y: 70 },
          { name: "Stam", number: 31, pos: "ZAG", x: 60, y: 75 },
          { name: "Nesta", number: 13, pos: "ZAG", x: 40, y: 75 },
          { name: "Maldini", number: 3, pos: "LE", x: 15, y: 70 },
          { name: "Pirlo", number: 21, pos: "VOL", x: 50, y: 60 },
          { name: "Gattuso", number: 8, pos: "MC", x: 70, y: 50 },
          { name: "Seedorf", number: 20, pos: "MC", x: 30, y: 50 },
          { name: "Kaká", number: 22, pos: "MEI", x: 50, y: 40 },
          { name: "Shevchenko", number: 7, pos: "ATA", x: 35, y: 25 },
          { name: "Crespo", number: 11, pos: "ATA", x: 65, y: 25 }
        ]
      },
      away: {
        formation: "4-4-1-1",
        players: [
          { name: "Dudek", number: 1, pos: "GK", x: 50, y: 12 },
          { name: "Finnan", number: 3, pos: "LD", x: 85, y: 30 },
          { name: "Carragher", number: 23, pos: "ZAG", x: 60, y: 25 },
          { name: "Hyypiä", number: 4, pos: "ZAG", x: 40, y: 25 },
          { name: "Traoré", number: 21, pos: "LE", x: 15, y: 30 },
          { name: "Alonso", number: 14, pos: "VOL", x: 40, y: 40 },
          { name: "Gerrard", number: 8, pos: "MC", x: 55, y: 45 },
          { name: "Luis García", number: 10, pos: "MD", x: 75, y: 45 },
          { name: "Riise", number: 6, pos: "ME", x: 25, y: 45 },
          { name: "Kewell", number: 7, pos: "MEI", x: 50, y: 55 },
          { name: "Baroš", number: 5, pos: "ATA", x: 50, y: 70 }
        ]
      }
    })
  },
  {
    id: "brasil-alemanha-2014",
    league: "Copa do Mundo",
    leagueEmoji: "🌎",
    homeTeam: "Brasil",
    homeEmoji: "🟡",
    homeLogoUrl: "https://upload.wikimedia.org/wikipedia/pt/b/b8/CBF_logo.svg",
    awayTeam: "Alemanha",
    awayEmoji: "⚪",
    awayLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/DFB_logo_%282003%29.svg",
    status: "completed",
    date: "2014-07-08",
    time: "17:00",
    scoreHome: 1,
    scoreAway: 7,
    stadium: "Mineirão, Belo Horizonte",
    referee: "Marco Rodríguez",
    rating: 8.9,
    votes: 4520,
    tacticalAnalysis: "O famoso 7-1 foi o maior colapso tático e emocional em Copas do Mundo modernas. Sem Neymar (lesionado) e Thiago Silva (suspenso), Felipão optou por um esquema agressivo com Bernard na ponta esquerda, mantendo apenas dois volantes (Fernandinho e Luiz Gustavo) muito expostos. A Alemanha de Joachim Löw leu essa fraqueza perfeitamente. Kroos e Khedira sobrecarregaram o meio-campo brasileiro, criando superioridade numérica. A falta de compactação defensiva do Brasil e as constantes subidas desordenadas de David Luiz abriram avenidas. Em um intervalo de 6 minutos (do minuto 23 ao 29), a Alemanha marcou 4 gols trocando passes dentro da área como se estivesse em um treino.",
    timeline: JSON.stringify([
      { minute: 11, type: "goal", team: "away", detail: "Gol de Thomas Müller (Assistência de Kroos)", icon: "⚽" },
      { minute: 23, type: "goal", team: "away", detail: "Gol de Miroslav Klose (Histórico, maior artilheiro das Copas)", icon: "⚽" },
      { minute: 24, type: "goal", team: "away", detail: "Gol de Toni Kroos (Assistência de Lahm)", icon: "⚽" },
      { minute: 26, type: "goal", team: "away", detail: "Gol de Toni Kroos (Assistência de Khedira)", icon: "⚽" },
      { minute: 29, type: "goal", team: "away", detail: "Gol de Sami Khedira (Assistência de Özil)", icon: "⚽" },
      { minute: 46, type: "sub", team: "away", detail: "Mertesacker entra no lugar de Hummels", icon: "🔄" },
      { minute: 69, type: "goal", team: "away", detail: "Gol de André Schürrle (Assistência de Lahm)", icon: "⚽" },
      { minute: 79, type: "goal", team: "away", detail: "Gol de André Schürrle (Belo chute no ângulo)", icon: "⚽" },
      { minute: 90, type: "goal", team: "home", detail: "Gol de Oscar (Gol de honra do Brasil)", icon: "⚽" }
    ]),
    lineups: JSON.stringify({
      home: {
        formation: "4-2-3-1",
        players: [
          { name: "Júlio César", number: 12, pos: "GK", x: 50, y: 88 },
          { name: "Maicon", number: 23, pos: "LD", x: 85, y: 70 },
          { name: "David Luiz", number: 4, pos: "ZAG", x: 60, y: 75 },
          { name: "Dante", number: 13, pos: "ZAG", x: 40, y: 75 },
          { name: "Marcelo", number: 6, pos: "LE", x: 15, y: 70 },
          { name: "Luiz Gustavo", number: 17, pos: "VOL", x: 35, y: 60 },
          { name: "Fernandinho", number: 5, pos: "VOL", x: 65, y: 60 },
          { name: "Bernard", number: 20, pos: "MEI", x: 20, y: 45 },
          { name: "Oscar", number: 11, pos: "MEI", x: 50, y: 45 },
          { name: "Hulk", number: 7, pos: "MEI", x: 80, y: 45 },
          { name: "Fred", number: 9, pos: "ATA", x: 50, y: 25 }
        ]
      },
      away: {
        formation: "4-3-3",
        players: [
          { name: "Neuer", number: 1, pos: "GK", x: 50, y: 12 },
          { name: "Lahm", number: 16, pos: "LD", x: 85, y: 30 },
          { name: "Boateng", number: 17, pos: "ZAG", x: 60, y: 25 },
          { name: "Hummels", number: 5, pos: "ZAG", x: 40, y: 25 },
          { name: "Höwedes", number: 4, pos: "LE", x: 15, y: 30 },
          { name: "Khedira", number: 6, pos: "MC", x: 65, y: 45 },
          { name: "Schweinsteiger", number: 7, pos: "VOL", x: 50, y: 40 },
          { name: "Kroos", number: 18, pos: "MC", x: 35, y: 45 },
          { name: "Müller", number: 13, pos: "ATA", x: 75, y: 60 },
          { name: "Klose", number: 11, pos: "ATA", x: 50, y: 70 },
          { name: "Özil", number: 8, pos: "ATA", x: 25, y: 60 }
        ]
      }
    })
  },
  {
    id: "live-brasileirao-fla-vasco",
    league: "Brasileirão",
    leagueEmoji: "🇧🇷",
    homeTeam: "Flamengo",
    homeEmoji: "🔴",
    homeLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/CR_Flamengo_crest.svg",
    awayTeam: "Vasco",
    awayEmoji: "⚫",
    awayLogoUrl: "https://upload.wikimedia.org/wikipedia/pt/e/e9/Vasco_da_Gama_2020.svg",
    status: "live",
    date: "2026-07-01",
    time: "20:00",
    scoreHome: 2,
    scoreAway: 2,
    stadium: "Maracanã, Rio de Janeiro",
    referee: "Anderson Daronco",
    rating: 8.5,
    votes: 540,
    tacticalAnalysis: "Um clássico dos milhões inflamado no Maracanã! O Vasco saiu na frente com o artilheiro Vegetti dominando o jogo aéreo. O Flamengo reagiu empurrando as linhas e empatou com Pedro. Com a expulsão de Hugo Moura aos 58', parecia que o Flamengo dominaria o jogo, mas Payet tirou um coelho da cartola empatando o jogo numa falta de cinema. O Vasco agora se defende em bloco baixo (5-3-1) tentando segurar o valioso empate.",
    timeline: JSON.stringify([
      { minute: 15, type: "goal", team: "away", detail: "Gol de Vegetti (Cabeçada certeira em cruzamento de Piton)", icon: "⚽" },
      { minute: 32, type: "goal", team: "home", detail: "Gol de Pedro (Pênalti sofrido por Cebolinha)", icon: "⚽" },
      { minute: 49, type: "goal", team: "home", detail: "Gol de Arrascaeta (Chute colocado de fora da área)", icon: "⚽" },
      { minute: 58, type: "card", team: "away", detail: "Cartão Vermelho para Hugo Moura (Segundo Amarelo)", icon: "🟥" },
      { minute: 67, type: "goal", team: "away", detail: "Gol de Payet (Golaço de falta, mesmo com um a menos!)", icon: "⚽" }
    ]),
    lineups: JSON.stringify({
      home: {
        formation: "4-3-3",
        players: [
          { name: "Rossi", number: 1, pos: "GK", x: 50, y: 88 },
          { name: "Wesley", number: 43, pos: "LD", x: 85, y: 70 },
          { name: "Léo Ortiz", number: 3, pos: "ZAG", x: 60, y: 75 },
          { name: "Léo Pereira", number: 4, pos: "ZAG", x: 40, y: 75 },
          { name: "Ayrton Lucas", number: 6, pos: "LE", x: 15, y: 70 },
          { name: "Allan", number: 21, pos: "VOL", x: 35, y: 60 },
          { name: "De la Cruz", number: 18, pos: "MC", x: 50, y: 58 },
          { name: "Arrascaeta", number: 14, pos: "MEI", x: 65, y: 48 },
          { name: "Luiz Araújo", number: 7, pos: "ATA", x: 80, y: 35 },
          { name: "Pedro", number: 9, pos: "ATA", x: 50, y: 25 },
          { name: "Everton Cebolinha", number: 11, pos: "ATA", x: 20, y: 35 }
        ]
      },
      away: {
        formation: "4-2-3-1",
        players: [
          { name: "Léo Jardim", number: 1, pos: "GK", x: 50, y: 12 },
          { name: "Paulo Henrique", number: 96, pos: "LD", x: 85, y: 30 },
          { name: "João Victor", number: 3, pos: "ZAG", x: 60, y: 25 },
          { name: "Maicon", number: 4, pos: "ZAG", x: 40, y: 25 },
          { name: "Lucas Piton", number: 6, pos: "LE", x: 15, y: 30 },
          { name: "Hugo Moura", number: 25, pos: "VOL", x: 35, y: 42 },
          { name: "Sforza", number: 8, pos: "VOL", x: 65, y: 42 },
          { name: "Adson", number: 28, pos: "MD", x: 78, y: 55 },
          { name: "Payet", number: 10, pos: "MEI", x: 50, y: 55 },
          { name: "David", number: 7, pos: "ME", x: 22, y: 55 },
          { name: "Vegetti", number: 99, pos: "ATA", x: 50, y: 70 }
        ]
      }
    })
  },
  {
    id: "sched-la-liga-bar-real",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    homeTeam: "Barcelona",
    homeEmoji: "🔵",
    homeLogoUrl: "https://upload.wikimedia.org/wikipedia/pt/4/43/FCBarcelona.svg",
    awayTeam: "Real Madrid",
    awayEmoji: "⚪",
    awayLogoUrl: "https://upload.wikimedia.org/wikipedia/pt/9/98/Real_Madrid.svg",
    status: "scheduled",
    date: "2026-07-05",
    time: "16:00",
    stadium: "Spotify Camp Nou, Barcelona",
    referee: "Jesús Gil Manzano",
    rating: 0,
    votes: 0,
    tacticalAnalysis: "O grande 'El Clásico' espanhol acontecerá neste domingo. Ambas as equipes disputam ponto a ponto a liderança da La Liga. Expectativa de casa cheia e embate tático espetacular.",
    timeline: JSON.stringify([]),
    lineups: null
  }
];

export async function seedDatabase() {
  const count = await prisma.match.count();
  if (count === 0) {
    console.log("Seeding inicial do banco de dados...");
    
    // Cria dois usuários padrão de teste para avaliações iniciais
    const user1 = await prisma.user.create({
      data: {
        username: "tatico_soccer",
        email: "tatico@futnota.com",
        passwordHash: "senha_hash_mock"
      }
    });

    const user2 = await prisma.user.create({
      data: {
        username: "goleiro_raiz",
        email: "goleiro@futnota.com",
        passwordHash: "senha_hash_mock"
      }
    });

    for (const m of SEED_MATCHES) {
      await prisma.match.create({
        data: {
          id: m.id,
          league: m.league,
          leagueEmoji: m.leagueEmoji,
          homeTeam: m.homeTeam,
          homeEmoji: m.homeEmoji,
          homeLogoUrl: m.homeLogoUrl,
          awayTeam: m.awayTeam,
          awayEmoji: m.awayEmoji,
          awayLogoUrl: m.awayLogoUrl,
          status: m.status,
          date: m.date,
          time: m.time,
          scoreHome: m.scoreHome,
          scoreAway: m.scoreAway,
          penHome: m.penHome,
          penAway: m.penAway,
          stadium: m.stadium,
          referee: m.referee,
          rating: m.rating,
          votes: m.votes,
          tacticalAnalysis: m.tacticalAnalysis,
          timeline: m.timeline,
          lineups: m.lineups
        }
      });

      // Se for Milan x Liverpool, adiciona os comentários iniciais
      if (m.id === "milan-liverpool-2005") {
        await prisma.review.createMany({
          data: [
            {
              userId: user1.id,
              matchId: m.id,
              rating: 10,
              text: "Uma obra-prima dramática. Taticamente, mostra como um ajuste no vestiário (entrada de Hamann e mudança para 3 zagueiros) pode reverter a aparente superioridade de um meio-campo genial comandado por Pirlo e Kaká. Jogo perfeito.",
              likes: 124
            },
            {
              userId: user2.id,
              matchId: m.id,
              rating: 9.0,
              text: "A defesa de Dudek no chute de Shevchenko no final da prorrogação desafia as leis da física. O jogo em si foi cheio de erros defensivos no segundo tempo, o que de certa forma o torna ainda mais emocionante para o espectador neutro.",
              likes: 45
            }
          ]
        });
      }

      // Se for o clássico agendado Barcelona x Real Madrid, adiciona os palpites iniciais
      if (m.id === "sched-la-liga-bar-real") {
        await prisma.prediction.createMany({
          data: [
            {
              userId: user1.id,
              matchId: m.id,
              predictHomeScore: 3,
              predictAwayScore: 1,
              analysis: "Barcelona em excelente momento tático atuando no Camp Nou. Com o meio-campo compactado, devem anular as infiltrações rápidas do adversário e explorar transições rápidas."
            },
            {
              userId: user2.id,
              matchId: m.id,
              predictHomeScore: 1,
              predictAwayScore: 2,
              analysis: "O Real Madrid costuma crescer muito em clássicos. Vinícius Jr deve incomodar bastante a linha alta do Barcelona em jogadas de profundidade pelas costas dos laterais."
            }
          ]
        });
      }
    }
    console.log("Banco de dados semeado com sucesso!");
  }
}
