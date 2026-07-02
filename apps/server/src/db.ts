// apps/server/src/db.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// ─── MAPA CENTRAL DE LOGOS (sempre use esses URLs) ───────────────────────────
// Fonte: Wikimedia Commons – apenas arquivos SVG públicos verificados
export const TEAM_LOGOS: Record<string, string> = {
  // ── Clubes Italianos ──
  "Milan":        "https://upload.wikimedia.org/wikipedia/commons/d/d1/AC_Milan_logo.svg",
  "Inter Milan":  "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg",
  "Juventus":     "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg",
  "Roma":         "https://upload.wikimedia.org/wikipedia/de/a/a2/AS_Roma_logo.svg",
  "Napoli":       "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Neapel.svg",
  // ── Clubes Ingleses ──
  "Liverpool":    "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  "Manchester City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Arsenal":      "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  "Chelsea":      "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "Manchester United": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Tottenham":    "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  // ── Clubes Espanhóis ──
  "Barcelona":    "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "Real Madrid":  "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  "Atlético Madrid": "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",
  "Sevilla":      "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg",
  // ── Clubes Alemães ──
  "Bayern Munich": "https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_M%C3%BCnchen_logo_%282002%E2%80%932017%29.svg",
  "Borussia Dortmund": "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  // ── Clubes Brasileiros ──
  "Flamengo":     "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Escudo_do_Flamengo.svg/300px-Escudo_do_Flamengo.svg.png",
  "Vasco":        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Club_de_Regatas_Vasco_da_Gama.svg/300px-Club_de_Regatas_Vasco_da_Gama.svg.png",
  "Palmeiras":    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/300px-Palmeiras_logo.svg.png",
  "Corinthians":  "https://upload.wikimedia.org/wikipedia/pt/thumb/8/88/Sport_Club_Corinthians_Paulista.svg/300px-Sport_Club_Corinthians_Paulista.svg.png",
  "São Paulo":    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/S%C3%A3o_Paulo_FC.svg/300px-S%C3%A3o_Paulo_FC.svg.png",
  "Grêmio":       "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a1/Gremio_foot-ball_porto_alegrense_escudo.svg/300px-Gremio_foot-ball_porto_alegrense_escudo.svg.png",
  "Internacional": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Internacional_FC.svg/300px-Internacional_FC.svg.png",
  "Atletico Mineiro": "https://upload.wikimedia.org/wikipedia/pt/thumb/2/20/Clube_Atlético_Mineiro_seal.svg/300px-Clube_Atlético_Mineiro_seal.svg.png",
  "Botafogo":     "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a8/Botafogo_de_Futebol_e_Regatas.svg/300px-Botafogo_de_Futebol_e_Regatas.svg.png",
  "Fluminense":   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Fluminense_FC_logo.svg/300px-Fluminense_FC_logo.svg.png",
  "Santos":       "https://upload.wikimedia.org/wikipedia/pt/thumb/d/db/Santos_FC.svg/300px-Santos_FC.svg.png",
  "Cuiabá":       "https://upload.wikimedia.org/wikipedia/pt/thumb/e/e1/Cuiab%C3%A1_Esporte_Clube.svg/300px-Cuiab%C3%A1_Esporte_Clube.svg.png",
  "América-MG":   "https://upload.wikimedia.org/wikipedia/pt/thumb/c/cd/America_Mineiro_escudo.svg/300px-America_Mineiro_escudo.svg.png",
  "Fortaleza":    "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a2/Fortaleza_Esporte_Clube.svg/300px-Fortaleza_Esporte_Clube.svg.png",
  "Ponte Preta":  "https://upload.wikimedia.org/wikipedia/pt/thumb/8/8a/Associa%C3%A7%C3%A3o_Atl%C3%A9tica_Ponte_Preta.svg/300px-Associa%C3%A7%C3%A3o_Atl%C3%A9tica_Ponte_Preta.svg.png",
  // ── Seleções Nacionais ──
  "Brasil":       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/CBF_logo.svg/300px-CBF_logo.svg.png",
  "Alemanha":     "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/DFB_logo_%282003%29.svg/300px-DFB_logo_%282003%29.svg.png",
  "Espanha":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Badge_of_the_Spain_national_football_team.svg/300px-Badge_of_the_Spain_national_football_team.svg.png",
  "Áustria":      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Austrian_Football_Association_Logo.svg/300px-Austrian_Football_Association_Logo.svg.png",
  "Portugal":     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Logo_of_the_Portugal_national_football_team.svg/300px-Logo_of_the_Portugal_national_football_team.svg.png",
  "Croácia":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Logo_of_the_Croatia_national_football_team.svg/300px-Logo_of_the_Croatia_national_football_team.svg.png",
  "Argentina":    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Argentina_Football_Association_logo.svg/300px-Argentina_Football_Association_logo.svg.png",
  "França":       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Logo_de_la_FFF.svg/300px-Logo_de_la_FFF.svg.png",
  "Inglaterra":   "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_of_the_England_national_football_team.svg/300px-Logo_of_the_England_national_football_team.svg.png",
};

const TODAY = "2026-07-02";

const SEED_MATCHES = [
  // ═══════════════════════════════════════════════════════════════
  // JOGOS DE HOJE – Copa do Mundo 2026 (Round of 32)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "wc2026-r32-esp-aut",
    league: "Copa do Mundo FIFA 2026",
    leagueEmoji: "🏆",
    homeTeam: "Espanha",
    homeEmoji: "🔴",
    homeLogoUrl: TEAM_LOGOS["Espanha"],
    awayTeam: "Áustria",
    awayEmoji: "🔴",
    awayLogoUrl: TEAM_LOGOS["Áustria"],
    status: "scheduled",
    date: TODAY,
    time: "16:00",
    scoreHome: null,
    scoreAway: null,
    penHome: null,
    penAway: null,
    stadium: "SoFi Stadium, Los Angeles – EUA",
    referee: "Daniele Orsato (Itália)",
    rating: 0,
    votes: 0,
    tacticalAnalysis: "A atual campeã europeia Espanha chega invicta à fase eliminatória da Copa do Mundo 2026. Luis de la Fuente manteve o estilo de posse e pressing intenso que conquistou a Eurocopa 2024, com Lamine Yamal sendo a grande sensação da competição. A Áustria de Ralf Rangnick é a mais organizada das zebras do torneio: pressão alta coordenada, blocos compactos e transições rápidas com Arnautovic. Espanha vence no controle do jogo; Áustria busca o susto no contra-ataque.",
    timeline: JSON.stringify([]),
    lineups: JSON.stringify({
      home: {
        formation: "4-3-3",
        players: [
          { name: "Unai Simón", number: 1, pos: "GK", x: 50, y: 88 },
          { name: "Porro", number: 2, pos: "LD", x: 82, y: 70 },
          { name: "Cubarsí", number: 3, pos: "ZAG", x: 62, y: 76 },
          { name: "Laporte", number: 14, pos: "ZAG", x: 38, y: 76 },
          { name: "Cucurella", number: 23, pos: "LE", x: 18, y: 70 },
          { name: "Rodri", number: 16, pos: "VOL", x: 50, y: 60 },
          { name: "Pedri", number: 8, pos: "MC", x: 30, y: 50 },
          { name: "Dani Olmo", number: 10, pos: "MC", x: 70, y: 50 },
          { name: "Lamine Yamal", number: 19, pos: "ATA", x: 80, y: 32 },
          { name: "Oyarzabal", number: 7, pos: "ATA", x: 50, y: 25 },
          { name: "Álex Baena", number: 22, pos: "ATA", x: 20, y: 32 }
        ]
      },
      away: {
        formation: "4-2-3-1",
        players: [
          { name: "Schlager A.", number: 1, pos: "GK", x: 50, y: 12 },
          { name: "Posch", number: 5, pos: "LD", x: 82, y: 28 },
          { name: "Alaba", number: 8, pos: "ZAG", x: 62, y: 22 },
          { name: "Lienhart", number: 4, pos: "ZAG", x: 38, y: 22 },
          { name: "Mwene", number: 15, pos: "LE", x: 18, y: 28 },
          { name: "Laimer", number: 7, pos: "VOL", x: 60, y: 38 },
          { name: "Seiwald", number: 6, pos: "VOL", x: 40, y: 38 },
          { name: "Schlager X.", number: 10, pos: "MD", x: 75, y: 50 },
          { name: "Sabitzer", number: 22, pos: "MEI", x: 50, y: 54 },
          { name: "Schmid", number: 17, pos: "ME", x: 25, y: 50 },
          { name: "Arnautovic", number: 9, pos: "ATA", x: 50, y: 68 }
        ]
      }
    })
  },
  {
    id: "wc2026-r32-por-cro",
    league: "Copa do Mundo FIFA 2026",
    leagueEmoji: "🏆",
    homeTeam: "Portugal",
    homeEmoji: "🟢",
    homeLogoUrl: TEAM_LOGOS["Portugal"],
    awayTeam: "Croácia",
    awayEmoji: "⬜",
    awayLogoUrl: TEAM_LOGOS["Croácia"],
    status: "scheduled",
    date: TODAY,
    time: "20:00",
    scoreHome: null,
    scoreAway: null,
    penHome: null,
    penAway: null,
    stadium: "BMO Field, Toronto – Canadá",
    referee: "Szymon Marciniak (Polônia)",
    rating: 0,
    votes: 0,
    tacticalAnalysis: "O duelo entre dois gigantes europeus promete ser épico. Portugal chega com Cristiano Ronaldo motivadíssimo marcando em todas as fases, apoiado por um elenco jovem e talentoso com Bruno Fernandes organizando o jogo. Roberto Martínez usa um 4-3-3 fluido. A Croácia de Luka Modrić, na provável despedida do craque, joga em um 4-2-3-1 organizado com muita qualidade técnica no meio. Gvardiol é uma muralha na zaga. O campo em Toronto é pequeno, favorecendo a intensidade física croata.",
    timeline: JSON.stringify([]),
    lineups: JSON.stringify({
      home: {
        formation: "4-3-3",
        players: [
          { name: "Diogo Costa", number: 1, pos: "GK", x: 50, y: 88 },
          { name: "João Cancelo", number: 20, pos: "LD", x: 82, y: 70 },
          { name: "Rúben Dias", number: 4, pos: "ZAG", x: 62, y: 76 },
          { name: "Nuno Mendes", number: 25, pos: "LE", x: 18, y: 70 },
          { name: "António Silva", number: 5, pos: "ZAG", x: 38, y: 76 },
          { name: "João Neves", number: 8, pos: "VOL", x: 50, y: 60 },
          { name: "Bruno Fernandes", number: 8, pos: "MC", x: 30, y: 50 },
          { name: "Vitinha", number: 16, pos: "MC", x: 70, y: 50 },
          { name: "Bernardo Silva", number: 10, pos: "ATA", x: 75, y: 32 },
          { name: "Cristiano Ronaldo", number: 7, pos: "ATA", x: 50, y: 22 },
          { name: "Rafael Leão", number: 17, pos: "ATA", x: 25, y: 32 }
        ]
      },
      away: {
        formation: "4-2-3-1",
        players: [
          { name: "Livakovic", number: 1, pos: "GK", x: 50, y: 12 },
          { name: "Juranović", number: 2, pos: "LD", x: 82, y: 28 },
          { name: "Gvardiol", number: 3, pos: "ZAG", x: 62, y: 22 },
          { name: "Šutalo", number: 5, pos: "ZAG", x: 38, y: 22 },
          { name: "Sosa", number: 6, pos: "LE", x: 18, y: 28 },
          { name: "Modrić", number: 10, pos: "VOL", x: 60, y: 40 },
          { name: "Brozović", number: 11, pos: "VOL", x: 40, y: 40 },
          { name: "Kovačić", number: 8, pos: "MD", x: 75, y: 52 },
          { name: "Perišić", number: 4, pos: "MEI", x: 50, y: 55 },
          { name: "Ivanušec", number: 17, pos: "ME", x: 25, y: 52 },
          { name: "Kramarić", number: 9, pos: "ATA", x: 50, y: 68 }
        ]
      }
    })
  },
  // ═══════════════════════════════════════════════════════════════
  // JOGOS DE HOJE – Série B do Brasileirão
  // ═══════════════════════════════════════════════════════════════
  {
    id: "serb-cuiaba-americamg",
    league: "Brasileirão Série B",
    leagueEmoji: "🇧🇷",
    homeTeam: "Cuiabá",
    homeEmoji: "🟡",
    homeLogoUrl: TEAM_LOGOS["Cuiabá"],
    awayTeam: "América-MG",
    awayEmoji: "🟢",
    awayLogoUrl: TEAM_LOGOS["América-MG"],
    status: "scheduled",
    date: TODAY,
    time: "19:00",
    scoreHome: null,
    scoreAway: null,
    penHome: null,
    penAway: null,
    stadium: "Arena Pantanal, Cuiabá",
    referee: "A definir",
    rating: 0,
    votes: 0,
    tacticalAnalysis: "Duelo direto pela parte de cima da tabela da Série B. O Cuiabá em casa tem bom aproveitamento e pressiona desde o início. O América-MG busca retornar à elite e chega motivado após sequência positiva fora de casa.",
    timeline: JSON.stringify([]),
    lineups: null
  },
  {
    id: "serb-fortaleza-pontepreta",
    league: "Brasileirão Série B",
    leagueEmoji: "🇧🇷",
    homeTeam: "Fortaleza",
    homeEmoji: "🔵",
    homeLogoUrl: TEAM_LOGOS["Fortaleza"],
    awayTeam: "Ponte Preta",
    awayEmoji: "⚫",
    awayLogoUrl: TEAM_LOGOS["Ponte Preta"],
    status: "scheduled",
    date: TODAY,
    time: "21:00",
    scoreHome: null,
    scoreAway: null,
    penHome: null,
    penAway: null,
    stadium: "Arena Castelão, Fortaleza",
    referee: "A definir",
    rating: 0,
    votes: 0,
    tacticalAnalysis: "O Fortaleza tenta aproveitar o fator casa diante de uma Ponte Preta que precisa pontuar para sair da zona de risco. Jogo físico esperado no calor nordestino.",
    timeline: JSON.stringify([]),
    lineups: null
  },
  // ═══════════════════════════════════════════════════════════════
  // CLÁSSICO AO VIVO – Simulado
  // ═══════════════════════════════════════════════════════════════
  {
    id: "live-brasileirao-fla-vasco",
    league: "Brasileirão Série A",
    leagueEmoji: "🇧🇷",
    homeTeam: "Flamengo",
    homeEmoji: "🔴",
    homeLogoUrl: TEAM_LOGOS["Flamengo"],
    awayTeam: "Vasco",
    awayEmoji: "⚫",
    awayLogoUrl: TEAM_LOGOS["Vasco"],
    status: "live",
    date: TODAY,
    time: "20:00",
    scoreHome: 2,
    scoreAway: 2,
    penHome: null,
    penAway: null,
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
          { name: "Sforza", number: 8, pos: "VOL", x: 65, y: 42 },
          { name: "Adson", number: 28, pos: "MD", x: 78, y: 55 },
          { name: "Payet", number: 10, pos: "MEI", x: 50, y: 55 },
          { name: "David", number: 7, pos: "ME", x: 22, y: 55 },
          { name: "Vegetti", number: 99, pos: "ATA", x: 50, y: 70 }
        ]
      }
    })
  },
  // ═══════════════════════════════════════════════════════════════
  // JOGOS HISTÓRICOS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "milan-liverpool-2005",
    league: "UEFA Champions League",
    leagueEmoji: "🏆",
    homeTeam: "Milan",
    homeEmoji: "🔴",
    homeLogoUrl: TEAM_LOGOS["Milan"],
    awayTeam: "Liverpool",
    awayEmoji: "🔴",
    awayLogoUrl: TEAM_LOGOS["Liverpool"],
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
    homeLogoUrl: TEAM_LOGOS["Brasil"],
    awayTeam: "Alemanha",
    awayEmoji: "⚪",
    awayLogoUrl: TEAM_LOGOS["Alemanha"],
    status: "completed",
    date: "2014-07-08",
    time: "17:00",
    scoreHome: 1,
    scoreAway: 7,
    penHome: null,
    penAway: null,
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
  }
];

export async function seedDatabase() {
  const count = await prisma.match.count();
  if (count === 0) {
    console.log("Seeding inicial do banco de dados...");
    
    const user1 = await prisma.user.create({
      data: { username: "tatico_soccer", email: "tatico@futnota.com", passwordHash: "senha_hash_mock" }
    });
    const user2 = await prisma.user.create({
      data: { username: "goleiro_raiz", email: "goleiro@futnota.com", passwordHash: "senha_hash_mock" }
    });
    const user3 = await prisma.user.create({
      data: { username: "analista_cup", email: "analista@futnota.com", passwordHash: "senha_hash_mock" }
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
          scoreHome: m.scoreHome ?? null,
          scoreAway: m.scoreAway ?? null,
          penHome: m.penHome ?? null,
          penAway: m.penAway ?? null,
          stadium: m.stadium,
          referee: m.referee,
          rating: m.rating,
          votes: m.votes,
          tacticalAnalysis: m.tacticalAnalysis,
          timeline: m.timeline,
          lineups: m.lineups ?? null
        }
      });

      // Palpites para Espanha x Áustria
      if (m.id === "wc2026-r32-esp-aut") {
        await prisma.prediction.createMany({
          data: [
            {
              userId: user1.id, matchId: m.id,
              predictHomeScore: 2, predictAwayScore: 0,
              analysis: "Espanha tem posse e qualidade técnica muito superior. Lamine Yamal vai desmontar a linha austríaca pelas costas. Placar tranquilo para a atual campeã europeia."
            },
            {
              userId: user2.id, matchId: m.id,
              predictHomeScore: 1, predictAwayScore: 0,
              analysis: "Áustria de Rangnick vai fazer uma partida bem fechada, mas a qualidade de Rodri no meio vai decidir. Espanha ganha com jogo controlado."
            },
            {
              userId: user3.id, matchId: m.id,
              predictHomeScore: 2, predictAwayScore: 1,
              analysis: "Arnautovic sempre aparece em grandes jogos. Vai ser mais difícil que parece para a Espanha, mas a qualidade vence no final."
            }
          ]
        });
      }

      // Palpites para Portugal x Croácia
      if (m.id === "wc2026-r32-por-cro") {
        await prisma.prediction.createMany({
          data: [
            {
              userId: user1.id, matchId: m.id,
              predictHomeScore: 3, predictAwayScore: 1,
              analysis: "Ronaldo em ano de Copa é diferente. Portugal tem mais qualidade e profundidade. Croácia vai se defender mas não aguenta os 90 minutos."
            },
            {
              userId: user2.id, matchId: m.id,
              predictHomeScore: 1, predictAwayScore: 1,
              analysis: "Modrić e Brozović controlam o meio muito bem. Portugal vai ter dificuldades para criar. Jogo vai para a prorrogação."
            },
            {
              userId: user3.id, matchId: m.id,
              predictHomeScore: 2, predictAwayScore: 0,
              analysis: "Bruno Fernandes está em ótima fase e Rafael Leão cria muita dificuldade pela esquerda. Portugal vai dominar e vencer com folga."
            }
          ]
        });
      }

      // Reviews para Milan x Liverpool 2005
      if (m.id === "milan-liverpool-2005") {
        await prisma.review.createMany({
          data: [
            {
              userId: user1.id, matchId: m.id,
              rating: 10,
              text: "Uma obra-prima dramática. Taticamente, mostra como um ajuste no vestiário (entrada de Hamann e mudança para 3 zagueiros) pode reverter a aparente superioridade de um meio-campo genial comandado por Pirlo e Kaká. Jogo perfeito.",
              likes: 124
            },
            {
              userId: user2.id, matchId: m.id,
              rating: 9.0,
              text: "A defesa de Dudek no chute de Shevchenko no final da prorrogação desafia as leis da física. O jogo em si foi cheio de erros defensivos no segundo tempo, o que de certa forma o torna ainda mais emocionante para o espectador neutro.",
              likes: 45
            }
          ]
        });
      }
    }

    console.log("Banco de dados semeado com sucesso!");
  }
}
