// apps/server/src/footballService.ts
// Wrapper para API-Football com suporte a API-SPORTS direto e RapidAPI

import axios from 'axios';

function getBaseUrl(): string {
  const host = process.env.FOOTBALL_API_HOST || process.env.RAPID_API_HOST || 'v3.football.api-sports.io';
  return `https://${host}`;
}

// Mapa de ligas que queremos monitorar
export const TRACKED_LEAGUES: Record<number, string> = {
  71:  'Brasileirão Série A',
  72:  'Brasileirão Série B',
  73:  'Copa do Brasil',
  13:  'Copa do Mundo FIFA',
  2:   'UEFA Champions League',
  3:   'UEFA Europa League',
  11:  'Copa Libertadores',
  12:  'Copa Sudamericana',
  140: 'La Liga',
  39:  'Premier League',
  78:  'Bundesliga',
  61:  'Ligue 1',
  135: 'Serie A',
};

// Mapa de status da API → status do nosso banco
export const STATUS_MAP: Record<string, string> = {
  'TBD':  'scheduled',
  'NS':   'scheduled',  // Not Started
  '1H':   'live',
  'HT':   'live',
  '2H':   'live',
  'ET':   'live',
  'BT':   'live',
  'P':    'live',
  'SUSP': 'live',
  'INT':  'live',
  'LIVE': 'live',
  'FT':   'completed',  // Full Time
  'AET':  'completed',  // After Extra Time
  'PEN':  'completed',  // After Penalties
  'PST':  'completed',  // Postponed
  'CANC': 'completed',
  'ABD':  'completed',
  'AWD':  'completed',
  'WO':   'completed',
};

function getHeaders(): Record<string, string> | null {
  // Prioridade 1: Chave direta da API-SPORTS (api-football.com)
  const directKey = process.env.FOOTBALL_API_KEY;
  if (directKey) {
    return { 'x-apisports-key': directKey };
  }

  // Prioridade 2: Chave via RapidAPI (fallback legado)
  const rapidKey = process.env.RAPID_API_KEY;
  const rapidHost = process.env.RAPID_API_HOST || 'api-football-v1.p.rapidapi.com';
  if (rapidKey) {
    return {
      'X-RapidAPI-Key': rapidKey,
      'X-RapidAPI-Host': rapidHost,
    };
  }

  return null;
}

/** Verifica se a integração com API-Football está configurada */
export function isApiConfigured(): boolean {
  return !!(process.env.FOOTBALL_API_KEY || process.env.RAPID_API_KEY);
}

/** Busca partidas de hoje para as ligas monitoradas */
export async function fetchTodayFixtures(date?: string): Promise<ApiFixture[]> {
  const headers = getHeaders();
  if (!headers) {
    console.warn('[FootballService] FOOTBALL_API_KEY não configurada. Pulando sync.');
    return [];
  }

  const targetDate = date || new Date().toISOString().split('T')[0];

  try {
    const results: ApiFixture[] = [];

    // Busca por todas as ligas monitoradas (batched para economizar requests)
    const response = await axios.get(`${getBaseUrl()}/fixtures`, {
      headers,
      params: {
        date: targetDate,
        timezone: 'America/Sao_Paulo',
      },
    });

    const fixtures: any[] = response.data?.response || [];

    for (const fix of fixtures) {
      const leagueId: number = fix.league?.id;
      if (TRACKED_LEAGUES[leagueId]) {
        results.push(normalizeFixture(fix));
      }
    }

    console.log(`[FootballService] ${results.length} partidas encontradas para ${targetDate}`);
    return results;
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar fixtures:', err.message);
    return [];
  }
}

/** Busca partidas ao vivo agora */
export async function fetchLiveFixtures(): Promise<ApiFixture[]> {
  const headers = getHeaders();
  if (!headers) return [];

  try {
    const response = await axios.get(`${getBaseUrl()}/fixtures`, {
      headers,
      params: { live: 'all' },
    });

    const fixtures: any[] = response.data?.response || [];
    return fixtures
      .filter((f: any) => TRACKED_LEAGUES[f.league?.id])
      .map(normalizeFixture);
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar partidas ao vivo:', err.message);
    return [];
  }
}

/** Busca eventos de uma partida (gols, cartões, substituições) */
export async function fetchFixtureEvents(fixtureId: number): Promise<ApiEvent[]> {
  const headers = getHeaders();
  if (!headers) return [];

  try {
    const response = await axios.get(`${getBaseUrl()}/fixtures/events`, {
      headers,
      params: { fixture: fixtureId },
    });
    return (response.data?.response || []).map(normalizeEvent);
  } catch (err: any) {
    console.error(`[FootballService] Erro ao buscar eventos do jogo ${fixtureId}:`, err.message);
    return [];
  }
}

/** Busca estatísticas de uma partida (posse, chutes, passes, etc.) */
export async function fetchFixtureStatistics(fixtureId: number): Promise<ApiMatchStats | null> {
  const headers = getHeaders();
  if (!headers) return null;

  try {
    const response = await axios.get(`${getBaseUrl()}/fixtures/statistics`, {
      headers,
      params: { fixture: fixtureId },
    });
    const data = response.data?.response || [];
    if (data.length < 2) return null;
    return normalizeStats(data[0], data[1]);
  } catch (err: any) {
    console.error(`[FootballService] Erro ao buscar stats do jogo ${fixtureId}:`, err.message);
    return null;
  }
}

/** Busca escalações de uma partida */
export async function fetchFixtureLineups(fixtureId: number): Promise<any | null> {
  const headers = getHeaders();
  if (!headers) return null;

  try {
    const response = await axios.get(`${getBaseUrl()}/fixtures/lineups`, {
      headers,
      params: { fixture: fixtureId },
    });
    const data = response.data?.response || [];
    if (data.length < 2) return null;
    return normalizeLineups(data[0], data[1]);
  } catch (err: any) {
    console.error(`[FootballService] Erro ao buscar escalações:`, err.message);
    return null;
  }
}

// ─── Normalizadores ───────────────────────────────────────────────────────────

function normalizeFixture(f: any): ApiFixture {
  const leagueId: number = f.league?.id;
  const rawStatus: string = f.fixture?.status?.short || 'NS';

  return {
    externalId: f.fixture?.id,
    league: TRACKED_LEAGUES[leagueId] || f.league?.name,
    leagueId,
    leagueEmoji: getLeagueEmoji(leagueId),
    homeTeam: f.teams?.home?.name,
    homeLogo: f.teams?.home?.logo,
    awayTeam: f.teams?.away?.name,
    awayLogo: f.teams?.away?.logo,
    status: STATUS_MAP[rawStatus] || 'scheduled',
    rawStatus,
    scoreHome: f.goals?.home ?? null,
    scoreAway: f.goals?.away ?? null,
    penHome: f.score?.penalty?.home ?? null,
    penAway: f.score?.penalty?.away ?? null,
    date: new Date(f.fixture?.date).toISOString().split('T')[0],
    time: new Date(f.fixture?.date).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    }),
    stadium: f.fixture?.venue?.name || 'A definir',
    city: f.fixture?.venue?.city || '',
    referee: f.fixture?.referee || 'A definir',
    liveMinute: f.fixture?.status?.elapsed ?? null,
  };
}

function normalizeEvent(e: any): ApiEvent {
  const type = e.type?.toLowerCase() || '';
  const detail = e.detail?.toLowerCase() || '';

  let eventType = 'event';
  let icon = '📌';

  if (type === 'goal') {
    if (detail.includes('penalty')) { eventType = 'goal'; icon = '⚽🅿️'; }
    else if (detail.includes('own goal')) { eventType = 'owngoal'; icon = '⚽🔴'; }
    else { eventType = 'goal'; icon = '⚽'; }
  } else if (type === 'card') {
    if (detail.includes('red') || detail.includes('second yellow')) { eventType = 'card'; icon = '🟥'; }
    else { eventType = 'card'; icon = '🟨'; }
  } else if (type === 'subst') {
    eventType = 'sub'; icon = '🔄';
  } else if (type === 'var') {
    eventType = 'var'; icon = '🖥️';
  }

  return {
    minute: e.time?.elapsed || 0,
    extraMinute: e.time?.extra ?? null,
    type: eventType,
    team: e.team?.name || '',
    teamId: e.team?.id || 0,
    player: e.player?.name || '',
    assist: e.assist?.name || null,
    detail: buildEventDetail(e),
    icon,
  };
}

function buildEventDetail(e: any): string {
  const type = e.type?.toLowerCase();
  const player = e.player?.name || '';
  const assist = e.assist?.name || '';
  const detail = e.detail || '';

  if (type === 'goal') {
    if (assist) return `Gol de ${player} (Assistência de ${assist})`;
    if (detail.toLowerCase().includes('penalty')) return `Gol de pênalti de ${player}`;
    return `Gol de ${player}`;
  }
  if (type === 'card') return `Cartão ${detail} para ${player}`;
  if (type === 'subst') return `${assist || 'Jogador'} entra no lugar de ${player}`;
  if (type === 'var') return `VAR: ${detail}`;
  return `${type}: ${player}`;
}

function normalizeStats(home: any, away: any): ApiMatchStats {
  const getVal = (stats: any[], type: string): number | string | null => {
    const stat = stats.find((s: any) => s.type === type);
    if (!stat) return null;
    const v = stat.value;
    if (v === null || v === undefined) return null;
    // Converte "50%" → 50
    if (typeof v === 'string' && v.endsWith('%')) return parseInt(v);
    return v;
  };

  const hs = home.statistics || [];
  const as_ = away.statistics || [];

  return {
    homeTeam: home.team?.name,
    awayTeam: away.team?.name,
    possession: {
      home: getVal(hs, 'Ball Possession') as number ?? 50,
      away: getVal(as_, 'Ball Possession') as number ?? 50,
    },
    shotsTotal: { home: getVal(hs, 'Total Shots') as number ?? 0, away: getVal(as_, 'Total Shots') as number ?? 0 },
    shotsOnGoal: { home: getVal(hs, 'Shots on Goal') as number ?? 0, away: getVal(as_, 'Shots on Goal') as number ?? 0 },
    corners: { home: getVal(hs, 'Corner Kicks') as number ?? 0, away: getVal(as_, 'Corner Kicks') as number ?? 0 },
    fouls: { home: getVal(hs, 'Fouls') as number ?? 0, away: getVal(as_, 'Fouls') as number ?? 0 },
    yellowCards: { home: getVal(hs, 'Yellow Cards') as number ?? 0, away: getVal(as_, 'Yellow Cards') as number ?? 0 },
    redCards: { home: getVal(hs, 'Red Cards') as number ?? 0, away: getVal(as_, 'Red Cards') as number ?? 0 },
    offsides: { home: getVal(hs, 'Offsides') as number ?? 0, away: getVal(as_, 'Offsides') as number ?? 0 },
    passesTotal: { home: getVal(hs, 'Total passes') as number ?? 0, away: getVal(as_, 'Total passes') as number ?? 0 },
    passesAccuracy: { home: getVal(hs, 'Passes accurate') as number ?? 0, away: getVal(as_, 'Passes accurate') as number ?? 0 },
    dangerousAttacks: { home: getVal(hs, 'Dangerous Attacks') as number ?? 0, away: getVal(as_, 'Dangerous Attacks') as number ?? 0 },
  };
}

function normalizeLineups(home: any, away: any): any {
  const mapPlayer = (p: any, idx: number) => ({
    name: p.player?.name || `Jogador ${idx + 1}`,
    number: p.player?.number || idx + 1,
    pos: translatePosition(p.player?.pos || 'M'),
    x: 50,
    y: 50,
  });

  return {
    home: {
      formation: home.formation || '4-4-2',
      players: (home.startXI || []).map((p: any, i: number) => mapPlayer(p, i)),
    },
    away: {
      formation: away.formation || '4-4-2',
      players: (away.startXI || []).map((p: any, i: number) => mapPlayer(p, i)),
    },
  };
}

function translatePosition(pos: string): string {
  const map: Record<string, string> = {
    'G': 'GK', 'D': 'ZAG', 'M': 'MC', 'F': 'ATA'
  };
  return map[pos] || pos;
}

function getLeagueEmoji(leagueId: number): string {
  const map: Record<number, string> = {
    71: '🇧🇷', 72: '🇧🇷', 73: '🇧🇷',
    13: '🌎', 2: '🏆', 3: '🏆',
    11: '🌎', 12: '🌎',
    140: '🇪🇸', 39: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 78: '🇩🇪', 61: '🇫🇷', 135: '🇮🇹',
  };
  return map[leagueId] || '⚽';
}

// ─── Tipos internos ───────────────────────────────────────────────────────────

export interface ApiFixture {
  externalId: number;
  league: string;
  leagueId: number;
  leagueEmoji: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  status: string;
  rawStatus: string;
  scoreHome: number | null;
  scoreAway: number | null;
  penHome: number | null;
  penAway: number | null;
  date: string;
  time: string;
  stadium: string;
  city: string;
  referee: string;
  liveMinute: number | null;
}

export interface ApiEvent {
  minute: number;
  extraMinute: number | null;
  type: string;
  team: string;
  teamId: number;
  player: string;
  assist: string | null;
  detail: string;
  icon: string;
}

export interface ApiMatchStats {
  homeTeam: string;
  awayTeam: string;
  possession: { home: number; away: number };
  shotsTotal: { home: number; away: number };
  shotsOnGoal: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
  passesTotal: { home: number; away: number };
  passesAccuracy: { home: number; away: number };
  dangerousAttacks: { home: number; away: number };
}
