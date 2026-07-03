// apps/server/src/footballService.ts
// Integração com a API football-data.org

import axios from 'axios';

function getBaseUrl(): string {
  return `https://${process.env.FOOTBALL_API_HOST || 'api.football-data.org'}`;
}

function getHeaders(): Record<string, string> | null {
  const token = process.env.FOOTBALL_API_KEY;
  if (!token) return null;
  return { 'X-Auth-Token': token };
}

/** Verifica se a integração com API-Football está configurada */
export function isApiConfigured(): boolean {
  return !!process.env.FOOTBALL_API_KEY;
}

// Mapa de status da API football-data.org → status do nosso banco
export const STATUS_MAP: Record<string, string> = {
  'SCHEDULED': 'scheduled',
  'TIMED':     'scheduled',
  'IN_PLAY':   'live',
  'PAUSED':    'live',
  'FINISHED':  'completed',
  'POSTPONED': 'completed',
  'SUSPENDED': 'live',
  'CANCELED':  'completed',
};

/** Busca partidas de hoje (ou de uma data específica) */
export async function fetchTodayFixtures(date?: string): Promise<ApiFixture[]> {
  const headers = getHeaders();
  if (!headers) {
    console.warn('[FootballService] FOOTBALL_API_KEY não configurada. Pulando sync.');
    return [];
  }

  const targetDate = date || new Date().toISOString().split('T')[0];

  try {
    const params: any = {};
    if (date) {
      params.dateFrom = date;
      params.dateTo = date;
    }

    const response = await axios.get(`${getBaseUrl()}/v4/matches`, {
      headers,
      params,
    });

    const fixtures: any[] = response.data?.matches || [];
    const results = fixtures.map(normalizeFixture);
    
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
    const response = await axios.get(`${getBaseUrl()}/v4/matches`, {
      headers,
      params: { status: 'IN_PLAY,PAUSED' },
    });

    const fixtures: any[] = response.data?.matches || [];
    return fixtures.map(normalizeFixture);
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar partidas ao vivo:', err.message);
    return [];
  }
}

/** 
 * football-data.org FREE tier limits detailed events, lineups, and statistics. 
 * We return mock or empty data to prevent breaking the UI, but relying on AI generation. 
 */
export async function fetchFixtureEvents(fixtureId: number): Promise<ApiEvent[]> {
  return [];
}

export async function fetchFixtureStatistics(fixtureId: number): Promise<ApiMatchStats | null> {
  return null;
}

export async function fetchFixtureLineups(fixtureId: number): Promise<any | null> {
  return null;
}

// ─── Normalizadores ───────────────────────────────────────────────────────────

function normalizeFixture(f: any): ApiFixture {
  const rawStatus: string = f.status || 'SCHEDULED';
  const utcDate = new Date(f.utcDate);

  return {
    externalId: f.id,
    league: f.competition?.name || 'Amistoso',
    leagueId: f.competition?.id || 0,
    leagueEmoji: getLeagueEmoji(f.competition?.id || 0),
    leagueLogoUrl: f.competition?.emblem || null,
    homeTeam: f.homeTeam?.name || 'Time Mandante',
    homeLogo: f.homeTeam?.crest || null,
    awayTeam: f.awayTeam?.name || 'Time Visitante',
    awayLogo: f.awayTeam?.crest || null,
    status: STATUS_MAP[rawStatus] || 'scheduled',
    rawStatus,
    scoreHome: f.score?.fullTime?.home ?? null,
    scoreAway: f.score?.fullTime?.away ?? null,
    penHome: f.score?.penalties?.home ?? null,
    penAway: f.score?.penalties?.away ?? null,
    date: utcDate.toISOString().split('T')[0],
    time: utcDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    }),
    stadium: 'Estádio Local', // football-data often omits venue in free tier
    city: '',
    referee: f.referees?.[0]?.name || 'A definir',
    liveMinute: rawStatus === 'IN_PLAY' ? 45 : null,
  };
}

function getLeagueEmoji(leagueId: number): string {
  const map: Record<number, string> = {
    2013: '🇧🇷', // Brasileirão
    2000: '🌎', // World Cup
    2001: '🏆', // Champions League
    2018: '🏆', // Euro
    2152: '🌎', // Libertadores
    2021: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', // Premier League
    2014: '🇪🇸', // La Liga
    2002: '🇩🇪', // Bundesliga
    2015: '🇫🇷', // Ligue 1
    2019: '🇮🇹', // Serie A
  };
  return map[leagueId] || '⚽';
}

// ─── Tipos internos ───────────────────────────────────────────────────────────

export interface ApiFixture {
  externalId: number;
  league: string;
  leagueId: number;
  leagueEmoji: string;
  leagueLogoUrl: string | null;
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

export async function fetchCompetitionStandings(leagueId: number): Promise<any | null> {
  const headers = getHeaders();
  if (!headers) return null;

  try {
    const response = await axios.get(`${getBaseUrl()}/v4/competitions/${leagueId}/standings`, {
      headers
    });
    return response.data;
  } catch (err: any) {
    console.error(`[FootballService] Erro ao buscar standings da liga ${leagueId}:`, err.message);
    return null;
  }
}

export async function fetchCompetitionScorers(leagueId: number): Promise<any | null> {
  const headers = getHeaders();
  if (!headers) return null;

  try {
    const response = await axios.get(`${getBaseUrl()}/v4/competitions/${leagueId}/scorers`, {
      headers
    });
    return response.data;
  } catch (err: any) {
    console.error(`[FootballService] Erro ao buscar artilheiros da liga ${leagueId}:`, err.message);
    return null;
  }
}
