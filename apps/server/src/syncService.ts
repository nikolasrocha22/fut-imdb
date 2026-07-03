// apps/server/src/syncService.ts
// Serviço de sincronização diária de partidas com a API-Football

import cron from 'node-cron';
import { prisma } from './db';
import {
  fetchTodayFixtures,
  fetchFixtureLineups,
  isApiConfigured,
  type ApiFixture,
} from './footballService';
import { generatePreMatchAnalysis } from './aiService';

// Emojis para times brasileiros e seleções (fallback quando API não tem logo)
const EMOJI_MAP: Record<string, string> = {
  'Flamengo': '🔴', 'Vasco': '⚫', 'Palmeiras': '🟢', 'Corinthians': '⚫',
  'São Paulo': '🔴', 'Santos': '⚫', 'Grêmio': '🔵', 'Internacional': '🔴',
  'Atletico Mineiro': '⚫', 'Botafogo': '⚫', 'Fluminense': '🔴',
  'Fortaleza': '🔵', 'Ceará': '⚫', 'Sport': '🔴', 'Bahia': '🔵',
  'Cuiabá': '🟡', 'América-MG': '🟢', 'Ponte Preta': '⚫',
  'Brasil': '🟡', 'Argentina': '🔵', 'França': '🔵', 'Alemanha': '⚪',
  'Espanha': '🔴', 'Portugal': '🟢', 'Itália': '🔵', 'Inglaterra': '⚪',
  'Croácia': '⬜', 'Áustria': '🔴',
};

function getTeamEmoji(teamName: string): string {
  return EMOJI_MAP[teamName] || '⚽';
}

/**
 * Sincroniza as partidas do dia com o banco de dados.
 * Cria novas partidas e atualiza as existentes por externalId.
 */
export async function syncTodayMatches(date?: string): Promise<number> {
  if (!isApiConfigured()) {
    console.log('[Sync] API-Football não configurada. Usando dados locais de seed.');
    return 0;
  }

  const fixtures = await fetchTodayFixtures(date);
  if (!fixtures.length) {
    console.log('[Sync] Nenhuma partida encontrada para sincronizar.');
    return 0;
  }

  let synced = 0;
  for (const fix of fixtures) {
    try {
      await upsertFixture(fix);
      synced++;
    } catch (err: any) {
      console.error(`[Sync] Erro ao sincronizar ${fix.homeTeam} x ${fix.awayTeam}:`, err.message);
    }
  }

  console.log(`[Sync] ${synced}/${fixtures.length} partidas sincronizadas com sucesso.`);
  return synced;
}

/**
 * Cria ou atualiza uma partida no banco por externalId.
 */
async function upsertFixture(fix: ApiFixture): Promise<void> {
  // Gera ID interno baseado no externalId da API
  const matchId = `api-${fix.externalId}`;

  // Tenta buscar lineups (pode falhar sem consumir muito da cota)
  let lineupsJson: string | null = null;
  try {
    if (fix.status !== 'scheduled') {
      const lineups = await fetchFixtureLineups(fix.externalId);
      if (lineups) lineupsJson = JSON.stringify(lineups);
    }
  } catch { /* silencioso */ }

  // Gera Análise Tática via IA
  const tacticalAnalysis = await generatePreMatchAnalysis({
    id: matchId,
    homeTeam: fix.homeTeam,
    awayTeam: fix.awayTeam,
    league: fix.league,
    stadium: fix.stadium,
    date: fix.date,
    time: fix.time,
    lineups: lineupsJson ? JSON.parse(lineupsJson) : null,
    tacticalAnalysis: ''
  });

  const existing = await prisma.match.findUnique({ where: { id: matchId } });

  // Cria um gerador realista de votos/rating se o jogo for novo
  const initialRating = existing ? existing.rating : parseFloat((Math.random() * (9.5 - 6.0) + 6.0).toFixed(1));
  const initialVotes = existing ? existing.votes : Math.floor(Math.random() * (5000 - 500) + 500);

  const data = {
    league: fix.league,
    leagueEmoji: fix.leagueEmoji,
    homeTeam: fix.homeTeam,
    homeEmoji: getTeamEmoji(fix.homeTeam),
    homeLogoUrl: fix.homeLogo || null,
    awayTeam: fix.awayTeam,
    awayEmoji: getTeamEmoji(fix.awayTeam),
    awayLogoUrl: fix.awayLogo || null,
    status: fix.status,
    scoreHome: fix.scoreHome,
    scoreAway: fix.scoreAway,
    penHome: fix.penHome,
    penAway: fix.penAway,
    date: fix.date,
    time: fix.time,
    stadium: fix.stadium ? `${fix.stadium}, ${fix.city}`.replace(', ', ', ').replace(/,\s*$/, '') : 'A definir',
    referee: fix.referee,
    liveMinute: fix.liveMinute,
    externalId: fix.externalId,
    tacticalAnalysis: tacticalAnalysis,
    timeline: '[]',
    rating: initialRating,
    votes: initialVotes,
    ...(lineupsJson && { lineups: lineupsJson }),
  };

  await prisma.match.upsert({
    where: { id: matchId },
    create: { id: matchId, ...data },
    update: {
      status: data.status,
      scoreHome: data.scoreHome,
      scoreAway: data.scoreAway,
      penHome: data.penHome,
      penAway: data.penAway,
      liveMinute: data.liveMinute,
      homeLogoUrl: data.homeLogoUrl,
      awayLogoUrl: data.awayLogoUrl,
      tacticalAnalysis: data.tacticalAnalysis, // Pode ter sido atualizada pela IA
      ...(lineupsJson && { lineups: lineupsJson }),
    },
  });
}

/**
 * Inicia o cron job de sincronização.
 * Executa todo dia às 06:00 BRT (09:00 UTC) e ao iniciar o servidor.
 */
export function startSyncService(): void {
  if (!isApiConfigured()) {
    console.log('[SyncService] Desabilitado — configure FOOTBALL_API_KEY para ativar.');
    return;
  }

  // Executa na inicialização (com 5s de delay para o banco estar pronto)
  setTimeout(async () => {
    console.log('[SyncService] Executando sincronização inicial...');
    await syncTodayMatches();
  }, 5000);

  // Cron: todo dia às 06:00 (horário de São Paulo = UTC-3 = 09:00 UTC)
  cron.schedule('0 9 * * *', async () => {
    console.log('[SyncService] Cron de 06:00 BRT disparado — sincronizando partidas do dia...');
    await syncTodayMatches();
  }, { timezone: 'UTC' });

  // Cron adicional: a cada hora durante o dia (para capturar partidas recém-anunciadas)
  cron.schedule('0 12-2 * * *', async () => {
    console.log('[SyncService] Atualização horária de fixtures...');
    await syncTodayMatches();
  }, { timezone: 'UTC' });

  console.log('[SyncService] Agendado: sincronização às 06:00 BRT + atualização horária.');
}
