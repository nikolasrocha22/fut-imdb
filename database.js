const INITIAL_MATCHES = [
  {
    id: "milan-liverpool-2005",
    league: "UEFA Champions League",
    leagueEmoji: "🏆",
    homeTeam: "Milan",
    homeEmoji: "🔴",
    awayTeam: "Liverpool",
    awayEmoji: "🔴",
    status: "completed",
    date: "2005-05-25",
    time: "20:45",
    score: { home: 3, away: 3, penHome: 2, penAway: 3 },
    stadium: "Atatürk Olympic Stadium, Istambul",
    referee: "Manuel Mejuto González",
    rating: 9.8,
    votes: 3840,
    stats: {
      possession: [55, 45],
      shots: [22, 15],
      shotsOnTarget: [10, 7],
      xG: [2.8, 1.9],
      fouls: [14, 21],
      corners: [10, 4],
      yellowCards: [2, 3],
      redCards: [0, 0]
    },
    lineups: {
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
    },
    timeline: [
      { minute: 1, type: "goal", team: "home", detail: "Gol de Maldini (Assistência de Pirlo)", icon: "⚽" },
      { minute: 23, type: "sub", team: "away", detail: "Smicer entra no lugar de Kewell", icon: "🔄" },
      { minute: 39, type: "goal", team: "home", detail: "Gol de Crespo (Assistência de Shevchenko)", icon: "⚽" },
      { minute: 44, type: "goal", team: "home", detail: "Gol de Crespo (Assistência de Kaká)", icon: "⚽" },
      { minute: 54, type: "goal", team: "away", detail: "Gol de Gerrard (Assistência de Riise)", icon: "⚽" },
      { minute: 56, type: "goal", team: "away", detail: "Gol de Smicer (Assistência de Hamann)", icon: "⚽" },
      { minute: 60, type: "goal", team: "away", detail: "Gol de Xabi Alonso (Aproveitando rebote de pênalti)", icon: "⚽" },
      { minute: 76, type: "card", team: "away", detail: "Cartão Amarelo para Carragher", icon: "🟨" },
      { minute: 120, type: "var", team: "home", detail: "Milagre duplo de Dudek impede gol de Shevchenko", icon: "🖥️" }
    ],
    tacticalAnalysis: `O Milagre de Istambul é considerado por muitos a final mais espetacular da história da Champions League. 
    No primeiro tempo, o Milan de Carlo Ancelotti deu um show tático. Operando em um 4-4-2 com losango no meio de campo, Kaká teve liberdade absoluta flutuando nas costas de Xabi Alonso e Steven Gerrard. A transição foi mortal, resultando em três gols rápidos e uma aparente liquidação do jogo.
    No intervalo, Rafa Benítez mudou o desenho do Liverpool para um 3-5-2 dinâmico, trazendo Dietmar Hamann para dar solidez e libertando Gerrard para atacar a área. Em uma tempestade de seis minutos, a atitude agressiva dos ingleses desestabilizou a defesa italiana, empatando o jogo.
    Dudek tornou-se o herói na prorrogação e nos pênaltis, consolidando uma virada tática e psicológica lendária.`,
    reviews: [
      {
        id: "r1",
        username: "tatico_soccer",
        rating: 10,
        text: "Uma obra-prima dramática. Taticamente, mostra como um ajuste no vestiário (entrada de Hamann e mudança para 3 zagueiros) pode reverter a aparente superioridade de um meio-campo genial comandado por Pirlo e Kaká. Jogo perfeito.",
        date: "2026-06-15",
        likes: 124
      },
      {
        id: "r2",
        username: "goleiro_raiz",
        rating: 9,
        text: "A defesa de Dudek no chute de Shevchenko no final da prorrogação desafia as leis da física. O jogo em si foi cheio de erros defensivos no segundo tempo, o que de certa forma o torna ainda mais emocionante para o espectador neutro.",
        date: "2026-06-20",
        likes: 45
      }
    ]
  },
  {
    id: "brasil-alemanha-2014",
    league: "Copa do Mundo",
    leagueEmoji: "🌎",
    homeTeam: "Brasil",
    homeEmoji: "🟡",
    awayTeam: "Alemanha",
    awayEmoji: "Oi",
    status: "completed",
    date: "2014-07-08",
    time: "17:00",
    score: { home: 1, away: 7 },
    stadium: "Mineirão, Belo Horizonte",
    referee: "Marco Rodríguez",
    rating: 8.9,
    votes: 4520,
    stats: {
      possession: [52, 48],
      shots: [18, 14],
      shotsOnTarget: [8, 10],
      xG: [1.2, 4.1],
      fouls: [11, 14],
      corners: [7, 5],
      yellowCards: [1, 0],
      redCards: [0, 0]
    },
    lineups: {
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
    },
    timeline: [
      { minute: 11, type: "goal", team: "away", detail: "Gol de Thomas Müller (Assistência de Kroos)", icon: "⚽" },
      { minute: 23, type: "goal", team: "away", detail: "Gol de Miroslav Klose (Histórico, maior artilheiro das Copas)", icon: "⚽" },
      { minute: 24, type: "goal", team: "away", detail: "Gol de Toni Kroos (Assistência de Lahm)", icon: "⚽" },
      { minute: 26, type: "goal", team: "away", detail: "Gol de Toni Kroos (Assistência de Khedira)", icon: "⚽" },
      { minute: 29, type: "goal", team: "away", detail: "Gol de Sami Khedira (Assistência de Özil)", icon: "⚽" },
      { minute: 46, type: "sub", team: "away", detail: "Mertesacker entra no lugar de Hummels", icon: "🔄" },
      { minute: 69, type: "goal", team: "away", detail: "Gol de André Schürrle (Assistência de Lahm)", icon: "⚽" },
      { minute: 79, type: "goal", team: "away", detail: "Gol de André Schürrle (Belo chute no ângulo)", icon: "⚽" },
      { minute: 90, type: "goal", team: "home", detail: "Gol de Oscar (Gol de honra do Brasil)", icon: "⚽" }
    ],
    tacticalAnalysis: `O famoso 7-1 foi o maior colapso tático e emocional em Copas do Mundo modernas. 
    Sem Neymar (lesionado) e Thiago Silva (suspenso), Felipão optou por um esquema agressivo com Bernard na ponta esquerda, mantendo apenas dois volantes (Fernandinho e Luiz Gustavo) muito expostos. A Alemanha de Joachim Löw leu essa fraqueza perfeitamente. 
    Kroos e Khedira sobrecarregaram o meio-campo brasileiro, criando superioridade numérica. A falta de compactação defensiva do Brasil e as constantes subidas desordenadas de David Luiz abriram avenidas. Em um intervalo de 6 minutos (do minuto 23 ao 29), a Alemanha marcou 4 gols trocando passes dentro da área como se estivesse em um treino.`,
    reviews: [
      {
        id: "r1",
        username: "brasuca_chateado",
        rating: 1,
        text: "Pesadelo absoluto. Nota 1 pela ruína de nossa seleção. Taticamente foi um suicídio de Felipão colocar Bernard em vez de reforçar o meio com Ramires. A Alemanha jogou como música, pareciam robôs frios.",
        date: "2026-06-01",
        likes: 310
      },
      {
        id: "r2",
        username: "tactics_nerd",
        rating: 9.5,
        text: "Se analisarmos o jogo puramente sob a ótica da Alemanha, foi a atuação coletiva perfeita. Movimentações fluidas de Müller abrindo espaço, Kroos ditando o ritmo e Schweinsteiger destruindo qualquer tentativa de reação. Histórico.",
        date: "2026-06-02",
        likes: 180
      }
    ]
  },
  {
    id: "barcelona-psg-2017",
    league: "UEFA Champions League",
    leagueEmoji: "🏆",
    homeTeam: "Barcelona",
    homeEmoji: "🔵",
    awayTeam: "Paris Saint-Germain",
    awayEmoji: "🔴",
    status: "completed",
    date: "2017-03-08",
    time: "20:45",
    score: { home: 6, away: 1 },
    stadium: "Camp Nou, Barcelona",
    referee: "Deniz Aytekin",
    rating: 9.7,
    votes: 3120,
    stats: {
      possession: [65, 35],
      shots: [17, 7],
      shotsOnTarget: [7, 3],
      xG: [3.4, 0.9],
      fouls: [16, 25],
      corners: [6, 4],
      yellowCards: [5, 5],
      redCards: [0, 0]
    },
    lineups: {
      home: {
        formation: "3-4-3 Diamante",
        players: [
          { name: "Ter Stegen", number: 1, pos: "GK", x: 50, y: 88 },
          { name: "Mascherano", number: 14, pos: "ZAG", x: 75, y: 75 },
          { name: "Piqué", number: 3, pos: "ZAG", x: 50, y: 78 },
          { name: "Umtiti", number: 23, pos: "ZAG", x: 25, y: 75 },
          { name: "Busquets", number: 5, pos: "VOL", x: 50, y: 62 },
          { name: "Rakitic", number: 4, pos: "MC", x: 70, y: 55 },
          { name: "Iniesta", number: 8, pos: "MC", x: 30, y: 55 },
          { name: "Messi", number: 10, pos: "MEI", x: 50, y: 45 },
          { name: "Rafinha", number: 12, pos: "ATA", x: 80, y: 32 },
          { name: "Suárez", number: 9, pos: "ATA", x: 50, y: 22 },
          { name: "Neymar Jr", number: 11, pos: "ATA", x: 20, y: 32 }
        ]
      },
      away: {
        formation: "4-5-1",
        players: [
          { name: "Trapp", number: 1, pos: "GK", x: 50, y: 12 },
          { name: "Meunier", number: 12, pos: "LD", x: 85, y: 30 },
          { name: "Marquinhos", number: 5, pos: "ZAG", x: 60, y: 25 },
          { name: "Thiago Silva", number: 2, pos: "ZAG", x: 40, y: 25 },
          { name: "Kurzawa", number: 20, pos: "LE", x: 15, y: 30 },
          { name: "Rabiot", number: 25, pos: "VOL", x: 35, y: 42 },
          { name: "Matuidi", number: 14, pos: "VOL", x: 65, y: 42 },
          { name: "Verratti", number: 6, pos: "MC", x: 50, y: 48 },
          { name: "Lucas Moura", number: 7, pos: "MD", x: 78, y: 55 },
          { name: "Draxler", number: 23, pos: "ME", x: 22, y: 55 },
          { name: "Cavani", number: 9, pos: "ATA", x: 50, y: 70 }
        ]
      }
    },
    timeline: [
      { minute: 3, type: "goal", team: "home", detail: "Gol de Luis Suárez (De cabeça no abafa)", icon: "⚽" },
      { minute: 40, type: "goal", team: "home", detail: "Gol contra de Kurzawa (Após calcanhar de Iniesta)", icon: "⚽" },
      { minute: 50, type: "goal", team: "home", detail: "Gol de Lionel Messi (Cobrança de Pênalti)", icon: "⚽" },
      { minute: 62, type: "goal", team: "away", detail: "Gol de Edinson Cavani (Chute forte, silenciando o Camp Nou)", icon: "⚽" },
      { minute: 88, type: "goal", team: "home", detail: "Gol de Neymar Jr (Falta espetacular na gaveta)", icon: "⚽" },
      { minute: 90, type: "goal", team: "home", detail: "Gol de Neymar Jr (Cobrança de Pênalti crucial)", icon: "⚽" },
      { minute: 95, type: "goal", team: "home", detail: "Gol de Sergi Roberto (Histórico, desvio após cavada de Neymar)", icon: "⚽" }
    ],
    tacticalAnalysis: `Apelidada de 'La Remontada', o Barça precisava reverter um 4-0 da ida. Luis Enrique escalou o time num ultraofensivo 3-4-3 com diamante, empurrando o PSG contra o próprio gol.
    O PSG de Unai Emery jogou de forma extremamente recuada e assustada, falhando em reter a bola. O gol de Cavani parecia ter acabado com o jogo, deixando o Barça precisando de 3 gols a partir dos 87 minutos.
    Aí começou o show de Neymar. Chamando a responsabilidade, ele cobrou uma falta perfeita, bateu o pênalti e, no último lance, deu uma assistência genial por cobertura para a infiltração de Sergi Roberto. Uma das partidas mais emocionantes do século.`,
    reviews: [
      {
        id: "r1",
        username: "cules_sempre",
        rating: 10,
        text: "Chorei nesse jogo. O maior milagre do futebol moderno. Neymar jogou os últimos 10 minutos como um verdadeiro melhor do mundo. Inesquecível.",
        date: "2026-05-10",
        likes: 92
      }
    ]
  },
  {
    id: "real-city-2024",
    league: "UEFA Champions League",
    leagueEmoji: "🏆",
    homeTeam: "Real Madrid",
    homeEmoji: "⚪",
    awayTeam: "Manchester City",
    awayEmoji: "🩵",
    status: "completed",
    date: "2024-04-09",
    time: "21:00",
    score: { home: 3, away: 3 },
    stadium: "Santiago Bernabéu, Madrid",
    referee: "François Letexier",
    rating: 9.3,
    votes: 2150,
    stats: {
      possession: [38, 62],
      shots: [14, 12],
      shotsOnTarget: [5, 6],
      xG: [0.95, 0.85],
      fouls: [9, 11],
      corners: [4, 2],
      yellowCards: [2, 2],
      redCards: [0, 0]
    },
    lineups: {
      home: {
        formation: "4-4-2 Dinâmico",
        players: [
          { name: "Lunin", number: 13, pos: "GK", x: 50, y: 88 },
          { name: "Carvajal", number: 2, pos: "LD", x: 85, y: 70 },
          { name: "Tchouaméni", number: 18, pos: "ZAG", x: 60, y: 75 },
          { name: "Rüdiger", number: 22, pos: "ZAG", x: 40, y: 75 },
          { name: "Mendy", number: 23, pos: "LE", x: 15, y: 70 },
          { name: "Camavinga", number: 12, pos: "VOL", x: 35, y: 60 },
          { name: "Kroos", number: 8, pos: "MC", x: 50, y: 62 },
          { name: "Valverde", number: 15, pos: "MC", x: 65, y: 60 },
          { name: "Bellingham", number: 5, pos: "MEI", x: 50, y: 48 },
          { name: "Rodrygo", number: 11, pos: "PE", x: 30, y: 35 },
          { name: "Vinicius Jr", number: 7, pos: "PD", x: 70, y: 35 }
        ]
      },
      away: {
        formation: "4-2-3-1",
        players: [
          { name: "Ortega", number: 18, pos: "GK", x: 50, y: 12 },
          { name: "Akanji", number: 25, pos: "LD", x: 85, y: 30 },
          { name: "Stones", number: 5, pos: "ZAG", x: 60, y: 25 },
          { name: "Rúben Dias", number: 3, pos: "ZAG", x: 40, y: 25 },
          { name: "Gvardiol", number: 24, pos: "LE", x: 15, y: 30 },
          { name: "Rodri", number: 16, pos: "VOL", x: 45, y: 42 },
          { name: "Kovačić", number: 8, pos: "VOL", x: 55, y: 42 },
          { name: "Bernardo Silva", number: 20, pos: "MEI", x: 75, y: 55 },
          { name: "Foden", number: 47, pos: "MEI", x: 50, y: 55 },
          { name: "Grealish", number: 10, pos: "ME", x: 25, y: 55 },
          { name: "Haaland", number: 9, pos: "ATA", x: 50, y: 70 }
        ]
      }
    },
    timeline: [
      { minute: 2, type: "goal", team: "away", detail: "Gol de Bernardo Silva (Falta surpreendente)", icon: "⚽" },
      { minute: 12, type: "goal", team: "home", detail: "Gol de Camavinga (Desvio em Rúben Dias)", icon: "⚽" },
      { minute: 14, type: "goal", team: "home", detail: "Gol de Rodrygo (Contra-ataque mortal)", icon: "⚽" },
      { minute: 66, type: "goal", team: "away", detail: "Gol de Phil Foden (Golaço de fora da área no ângulo)", icon: "⚽" },
      { minute: 71, type: "goal", team: "away", detail: "Gol de Gvardiol (Chute de direita espetacular)", icon: "⚽" },
      { minute: 79, type: "goal", team: "home", detail: "Gol de Fede Valverde (Voleio espetacular cruzado)", icon: "⚽" }
    ],
    tacticalAnalysis: `Uma das partidas mais técnicas e taticamente ricas do futebol moderno europeu. Carlo Ancelotti surpreendeu Guardiola ao colocar Rodrygo fixado na ala esquerda e Vinicius Jr mais centralizado para atacar o espaço deixado por Akanji e Stones nas transições rápidas.
    O City, paciente, controlou a posse no segundo tempo e encontrou espaço na intermediária quando a defesa do Real recuou demais, marcando dois golaços incríveis de média distância com Foden e Gvardiol. 
    A reação do Real, coroada com o sensacional chute de primeira de Valverde, mostrou o espírito indomável do time espanhol na Champions. Haaland foi completamente anulado por Rüdiger.`,
    reviews: [
      {
        id: "r1",
        username: "gvardiol_fan",
        rating: 9,
        text: "Uma aula de futebol. Três golaços de fora da área e alternativas táticas espetaculares de ambas as partes. Uma rivalidade que define a década.",
        date: "2024-04-10",
        likes: 42
      }
    ]
  },
  {
    id: "fla-pal-2023",
    league: "Supercopa do Brasil",
    leagueEmoji: "🇧🇷",
    homeTeam: "Flamengo",
    homeEmoji: "🔴",
    awayTeam: "Palmeiras",
    awayEmoji: "🟢",
    status: "completed",
    date: "2023-01-28",
    time: "16:30",
    score: { home: 3, away: 4 },
    stadium: "Mané Garrincha, Brasília",
    referee: "Wilton Pereira Sampaio",
    rating: 9.1,
    votes: 1420,
    stats: {
      possession: [58, 42],
      shots: [15, 13],
      shotsOnTarget: [7, 8],
      xG: [1.9, 2.1],
      fouls: [17, 18],
      corners: [5, 4],
      yellowCards: [4, 3],
      redCards: [0, 0]
    },
    lineups: {
      home: {
        formation: "4-3-1-2",
        players: [
          { name: "Santos", number: 1, pos: "GK", x: 50, y: 88 },
          { name: "G. Varela", number: 2, pos: "LD", x: 85, y: 70 },
          { name: "David Luiz", number: 23, pos: "ZAG", x: 60, y: 75 },
          { name: "Léo Pereira", number: 4, pos: "ZAG", x: 40, y: 75 },
          { name: "Ayrton Lucas", number: 6, pos: "LE", x: 15, y: 70 },
          { name: "Thiago Maia", number: 8, pos: "VOL", x: 35, y: 60 },
          { name: "Gerson", number: 20, pos: "MC", x: 65, y: 60 },
          { name: "E. Ribeiro", number: 7, pos: "MEI", x: 70, y: 48 },
          { name: "De Arrascaeta", number: 14, pos: "MEI", x: 30, y: 48 },
          { name: "Gabigol", number: 10, pos: "ATA", x: 40, y: 25 },
          { name: "Pedro", number: 9, pos: "ATA", x: 60, y: 25 }
        ]
      },
      away: {
        formation: "4-2-3-1",
        players: [
          { name: "Weverton", number: 21, pos: "GK", x: 50, y: 12 },
          { name: "Marcos Rocha", number: 2, pos: "LD", x: 85, y: 30 },
          { name: "Gustavo Gómez", number: 15, pos: "ZAG", x: 60, y: 25 },
          { name: "Murilo", number: 26, pos: "ZAG", x: 40, y: 25 },
          { name: "Piquerez", number: 22, pos: "LE", x: 15, y: 30 },
          { name: "Gabriel Menino", number: 25, pos: "VOL", x: 35, y: 42 },
          { name: "Zé Rafael", number: 8, pos: "VOL", x: 65, y: 42 },
          { name: "Mayke", number: 12, pos: "MD", x: 78, y: 55 },
          { name: "Raphael Veiga", number: 23, pos: "MEI", x: 50, y: 55 },
          { name: "Dudu", number: 7, pos: "ME", x: 22, y: 55 },
          { name: "Rony", number: 10, pos: "ATA", x: 50, y: 70 }
        ]
      }
    },
    timeline: [
      { minute: 26, type: "goal", team: "home", detail: "Gol de Gabigol (Cobrança de Pênalti)", icon: "⚽" },
      { minute: 38, type: "goal", team: "away", detail: "Gol de Raphael Veiga (Chute de esquerda rasteiro)", icon: "⚽" },
      { minute: 45, type: "goal", team: "away", detail: "Gol de Gabriel Menino (Golaço de fora da área)", icon: "⚽" },
      { minute: 51, type: "goal", team: "home", detail: "Gol de Gabigol (Cobertura sutil sobre Weverton)", icon: "⚽" },
      { minute: 58, type: "goal", team: "away", detail: "Gol de Raphael Veiga (Cobrança de Pênalti)", icon: "⚽" },
      { minute: 61, type: "goal", team: "home", detail: "Gol de Pedro (Golaço incrível de calcanhar)", icon: "⚽" },
      { minute: 74, type: "goal", team: "away", detail: "Gol de Gabriel Menino (Gol decisivo na pequena área)", icon: "⚽" }
    ],
    tacticalAnalysis: `Uma das melhores finais de futebol brasileiro de clubes de todos os tempos. O Flamengo estreava sob o comando do técnico Vítor Pereira com o losango ofensivo clássico de meias, mas mostrou fragilidades gravíssimas na recomposição sem bola. 
    O Palmeiras de Abel Ferreira, extremamente cirúrgico e com padrão coletivo consolidado, soube explorar os lados do campo e a transição rápida. Veiga e Menino brilharam com atuações de gala no meio-campo, aproveitando a liberdade dada pelas subidas dos laterais rubro-negros. Jogo frenético do início ao fim com reviravoltas inesquecíveis.`,
    reviews: [
      {
        id: "r1",
        username: "palestra_sempre",
        rating: 10,
        text: "Abel Ferreira é um gênio tático. Soube atacar as deficiências de espaço do meio de campo do Flamengo. Menino e Veiga jogaram demais. Um espetáculo no Mané Garrincha!",
        date: "2023-01-29",
        likes: 67
      }
    ]
  },
  // Partidas AO VIVO
  {
    id: "live-brasileirao-fla-vasco",
    league: "Brasileirão",
    leagueEmoji: "🇧🇷",
    homeTeam: "Flamengo",
    homeEmoji: "🔴",
    awayTeam: "Vasco",
    awayEmoji: "⚫",
    status: "live",
    minute: 74,
    date: "2026-07-01",
    time: "20:00",
    score: { home: 2, away: 2 },
    stadium: "Maracanã, Rio de Janeiro",
    referee: "Anderson Daronco",
    rating: 8.5,
    votes: 540,
    stats: {
      possession: [56, 44],
      shots: [12, 9],
      shotsOnTarget: [5, 4],
      xG: [1.6, 1.25],
      fouls: [12, 16],
      corners: [6, 3],
      yellowCards: [3, 4],
      redCards: [0, 1]
    },
    lineups: {
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
    },
    timeline: [
      { minute: 15, type: "goal", team: "away", detail: "Gol de Vegetti (Cabeçada certeira em cruzamento de Piton)", icon: "⚽" },
      { minute: 32, type: "goal", team: "home", detail: "Gol de Pedro (Pênalti sofrido por Cebolinha)", icon: "⚽" },
      { minute: 49, type: "goal", team: "home", detail: "Gol de Arrascaeta (Chute colocado de fora da área)", icon: "⚽" },
      { minute: 58, type: "card", team: "away", detail: "Cartão Vermelho para Hugo Moura (Segundo Amarelo)", icon: "🟥" },
      { minute: 67, type: "goal", team: "away", detail: "Gol de Payet (Golaço de falta, mesmo com um a menos!)", icon: "⚽" }
    ],
    tacticalAnalysis: `Um clássico dos milhões inflamado no Maracanã! O Vasco saiu na frente com o artilheiro Vegetti dominando o jogo aéreo. 
    O Flamengo reagiu empurrando as linhas e empatou com Pedro. Com a expulsão de Hugo Moura aos 58', parecia que o Flamengo dominaria o jogo, mas Payet tirou um coelho da cartola empatando o jogo numa falta de cinema. O Vasco agora se defende em bloco baixo (5-3-1) tentando segurar o valioso empate.`,
    reviews: []
  },
  // Partidas AGENDADAS
  {
    id: "sched-la-liga-bar-real",
    league: "La Liga",
    leagueEmoji: "🇪🇸",
    homeTeam: "Barcelona",
    homeEmoji: "🔵",
    awayTeam: "Real Madrid",
    awayEmoji: "⚪",
    status: "scheduled",
    date: "2026-07-05",
    time: "16:00",
    stadium: "Spotify Camp Nou, Barcelona",
    referee: "Jesús Gil Manzano",
    rating: 0,
    votes: 0,
    stats: null,
    lineups: null,
    timeline: [],
    tacticalAnalysis: "O grande 'El Clásico' espanhol acontecerá neste domingo. Ambas as equipes disputam ponto a ponto a liderança da La Liga. Expectativa de casa cheia e embate tático espetacular.",
    reviews: []
  },
  {
    id: "sched-premier-city-liver",
    league: "Premier League",
    leagueEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    homeTeam: "Manchester City",
    homeEmoji: "🩵",
    awayTeam: "Liverpool",
    awayEmoji: "🔴",
    status: "scheduled",
    date: "2026-07-12",
    time: "13:30",
    stadium: "Etihad Stadium, Manchester",
    referee: "Anthony Taylor",
    rating: 0,
    votes: 0,
    stats: null,
    lineups: null,
    timeline: [],
    tacticalAnalysis: "Embate entre os dois maiores vencedores da Premier League na última década. O futebol de alta pressão do Liverpool tenta desarmar a posse controlada do City no Etihad.",
    reviews: []
  }
];

// Carrega do localStorage ou inicia com os dados mockados
function getMatches() {
  const matches = localStorage.getItem("futnota_matches");
  if (!matches) {
    localStorage.setItem("futnota_matches", JSON.stringify(INITIAL_MATCHES));
    return INITIAL_MATCHES;
  }
  return JSON.parse(matches);
}

function saveMatches(matches) {
  localStorage.setItem("futnota_matches", JSON.stringify(matches));
}
