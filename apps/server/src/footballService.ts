// apps/server/src/footballService.ts
// Integração com a API footballdata.io + football-data.org (Brasileirão Série A)

import axios from 'axios';

const BASE_URL = 'https://footballdata.io/api/v1';

function getHeaders(): Record<string, string> | null {
  const token = process.env.FOOTBALL_API_KEY;
  if (!token) return null;
  return { 'Authorization': `Bearer ${token}` };
}

/** Verifica se a integração principal está configurada */
export function isApiConfigured(): boolean {
  return !!process.env.FOOTBALL_API_KEY;
}

// Mapa de status da API footballdata.io → status do nosso banco
export const STATUS_MAP: Record<string, string> = {
  'complete':    'completed',
  'incomplete':  'scheduled',
  'scheduled':   'scheduled',
  'not started': 'scheduled',
  'pending':     'scheduled',
  'live':        'live',
  'inplay':      'live',
  'halftime':    'live',
  'half time':   'live',
  'extra time':  'live',
  'penalties':   'live',
  'postponed':   'completed',
  'cancelled':   'completed',
  'suspended':   'live',
};

/** Busca partidas de hoje (footballdata.io + brasileirão do football-data.org) */
export async function fetchTodayFixtures(date?: string): Promise<ApiFixture[]> {
  const headers = getHeaders();
  if (!headers) {
    console.warn('[FootballService] FOOTBALL_API_KEY não configurada. Pulando sync.');
    return [];
  }

  const results: ApiFixture[] = [];
  const targetDate = date || new Date().toISOString().split('T')[0];

  // 1. Buscar partidas do footballdata.io
  try {
    let allMatches: any[] = [];
    if (date) {
      const resResults = await axios.get(`${BASE_URL}/fixtures/results`, {
        headers,
        params: { from: date, to: date, limit: 100 },
      });
      allMatches.push(...(resResults.data?.data?.matches || []));

      const resUpcoming = await axios.get(`${BASE_URL}/fixtures/upcoming`, {
        headers,
        params: { from: date, to: date, limit: 100 },
      });
      allMatches.push(...(resUpcoming.data?.data?.matches || []));
    } else {
      const response = await axios.get(`${BASE_URL}/fixtures/today`, {
        headers,
        params: { limit: 100 },
      });
      allMatches = response.data?.data?.matches || [];
    }

    // Deduplicar por match_id
    const seen = new Set<number>();
    const unique = allMatches.filter(m => {
      if (seen.has(m.match_id)) return false;
      seen.add(m.match_id);
      return true;
    });

    results.push(...unique.map(normalizeFixture));
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar fixtures do footballdata.io:', err.message);
  }

  // 2. Buscar partidas do Brasileirão do football-data.org (como base complementar)
  const oldApiKey = process.env.OLD_FOOTBALL_API_KEY || '1735da0f7bf34ded8107a40852962cbb';
  try {
    const oldRes = await axios.get(`https://api.football-data.org/v4/competitions/BSA/matches`, {
      headers: { 'X-Auth-Token': oldApiKey },
      params: { dateFrom: targetDate, dateTo: targetDate }
    });
    const oldMatchesRaw = oldRes.data?.matches || [];
    console.log(`[FootballService] Encontradas ${oldMatchesRaw.length} partidas do Brasileirão para ${targetDate}`);
    results.push(...oldMatchesRaw.map(normalizeOldApiFixture));
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar Brasileirão do football-data.org:', err.message);
  }

  return results;
}

/** Busca partidas ao vivo agora (footballdata.io + brasileirão do football-data.org) */
export async function fetchLiveFixtures(): Promise<ApiFixture[]> {
  const headers = getHeaders();
  if (!headers) return [];

  const results: ApiFixture[] = [];

  // 1. Buscar live no footballdata.io
  try {
    const response = await axios.get(`${BASE_URL}/fixtures/live`, {
      headers,
      params: { limit: 100 },
    });
    const fixtures: any[] = response.data?.data?.matches || [];
    results.push(...fixtures.map(normalizeFixture));
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar live do footballdata.io:', err.message);
  }

  // 2. Buscar live no Brasileirão do football-data.org (filtrando jogos de hoje com status ao vivo)
  const oldApiKey = process.env.OLD_FOOTBALL_API_KEY || '1735da0f7bf34ded8107a40852962cbb';
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const oldRes = await axios.get(`https://api.football-data.org/v4/competitions/BSA/matches`, {
      headers: { 'X-Auth-Token': oldApiKey },
      params: { dateFrom: todayStr, dateTo: todayStr }
    });
    const oldMatchesRaw = oldRes.data?.matches || [];
    const liveOldMatches = oldMatchesRaw.filter((m: any) => 
      m.status === 'LIVE' || m.status === 'IN_PLAY' || m.status === 'PAUSED'
    );
    results.push(...liveOldMatches.map(normalizeOldApiFixture));
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar live do Brasileirão:', err.message);
  }

  return results;
}

/** 
 * footballdata.io free tier does not include detailed events or lineups.
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
  const rawStatus: string = (f.status || 'incomplete').toLowerCase();
  const matchDate = new Date(f.match_date || f.date_unix * 1000);

  return {
    externalId: f.match_id,
    league: f.league?.competition_name || f.league?.name || 'Amistoso',
    leagueId: f.league?.league_id || 0,
    leagueEmoji: getLeagueEmoji(f.league?.league_id || 0),
    leagueLogoUrl: f.league?.image || null,
    homeTeam: f.home_team?.team_name || 'Time Mandante',
    homeLogo: f.home_team?.team_logo || null,
    awayTeam: f.away_team?.team_name || 'Time Visitante',
    awayLogo: f.away_team?.team_logo || null,
    status: STATUS_MAP[rawStatus] || 'scheduled',
    rawStatus,
    scoreHome: f.score?.home ?? null,
    scoreAway: f.score?.away ?? null,
    penHome: null,
    penAway: null,
    date: matchDate.toISOString().split('T')[0],
    time: matchDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    }),
    stadium: f.venue?.stadium_name || 'Estádio Local',
    city: f.venue?.stadium_location || '',
    referee: 'A definir',
    liveMinute: rawStatus === 'live' || rawStatus === 'inplay' ? null : null,
    odds: f.odds ? {
      homeWin: f.odds.home_win || 0,
      draw: f.odds.draw || 0,
      awayWin: f.odds.away_win || 0,
    } : null,
    probabilities: f.probabilities ? {
      homeWin: f.probabilities.home_win || 0,
      draw: f.probabilities.draw || 0,
      awayWin: f.probabilities.away_win || 0,
    } : null,
    xg: f.xg ? {
      home: f.xg.home || 0,
      away: f.xg.away || 0,
    } : null,
  };
}

function normalizeOldApiFixture(f: any): ApiFixture {
  const matchDate = new Date(f.utcDate);
  const rawStatus = (f.status || 'SCHEDULED').toLowerCase();
  
  let status = 'scheduled';
  if (rawStatus === 'finished') status = 'completed';
  else if (rawStatus === 'in_play' || rawStatus === 'paused' || rawStatus === 'live') status = 'live';

  return {
    externalId: f.id,
    league: "Brasileirão Série A",
    leagueId: 2013,
    leagueEmoji: '🇧🇷',
    leagueLogoUrl: 'https://crests.football-data.org/bsa.png',
    homeTeam: f.homeTeam.shortName || f.homeTeam.name,
    homeLogo: f.homeTeam.crest || null,
    awayTeam: f.awayTeam.shortName || f.awayTeam.name,
    awayLogo: f.awayTeam.crest || null,
    status: status as any,
    rawStatus,
    scoreHome: f.score?.fullTime?.home ?? null,
    scoreAway: f.score?.fullTime?.away ?? null,
    penHome: f.score?.penalties?.home ?? null,
    penAway: f.score?.penalties?.away ?? null,
    date: matchDate.toISOString().split('T')[0],
    time: matchDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
    }),
    stadium: 'Estádio Brasileiro',
    city: 'Brasil',
    referee: f.referees?.[0]?.name || 'A definir',
    liveMinute: null,
    odds: null,
    probabilities: null,
    xg: null
  };
}

function getLeagueEmoji(leagueId: number): string {
  const map: Record<number, string> = {
    15: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', // Premier League
    45: '🏆',         // Champions League
    46: '🏆',         // Europa League
    50: '🌍',         // World Cup
    10: '🇪🇸',         // La Liga
    2013: '🇧🇷',       // Brasileirão
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
  odds: { homeWin: number; draw: number; awayWin: number } | null;
  probabilities: { homeWin: number; draw: number; awayWin: number } | null;
  xg: { home: number; away: number } | null;
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
  // Se for Brasileirão, consultar o football-data.org (plano complementar)
  if (leagueId === 2013) {
    const oldApiKey = process.env.OLD_FOOTBALL_API_KEY || '1735da0f7bf34ded8107a40852962cbb';
    try {
      const response = await axios.get(`https://api.football-data.org/v4/competitions/BSA/standings`, {
        headers: { 'X-Auth-Token': oldApiKey }
      });
      
      const rawStandings = response.data?.standings?.[0]?.table || [];
      const normalizedStandings = rawStandings.map((row: any) => ({
        position: row.position,
        team: {
          team_id: row.team.id,
          team_name: row.team.shortName || row.team.name,
          team_logo: row.team.crest
        },
        record: {
          points: row.points,
          matches_played: row.playedGames,
          wins: row.won,
          draws: row.draw,
          losses: row.lost
        },
        goals: {
          for: row.goalsFor,
          against: row.goalsAgainst,
          difference: row.goalDifference
        }
      }));

      return {
        success: true,
        data: {
          league: {
            league_id: 2013,
            name: 'Campeonato Brasileiro Série A',
            country: 'Brazil',
            competition_name: 'Brasileirão',
            image: 'https://crests.football-data.org/bsa.png'
          },
          season: {
            season_id: response.data?.season?.id || 0,
            year: new Date(response.data?.season?.startDate || '').getFullYear() || 2026
          },
          standings: normalizedStandings
        }
      };
    } catch (err: any) {
      console.error(`[FootballService] Erro ao buscar standings do Brasileirão:`, err.message);
      return null;
    }
  }

  // Caso contrário, consultar o footballdata.io
  const headers = getHeaders();
  if (!headers) return null;

  try {
    const response = await axios.get(`${BASE_URL}/leagues/${leagueId}/standings`, {
      headers
    });
    return response.data;
  } catch (err: any) {
    console.error(`[FootballService] Erro ao buscar standings da liga ${leagueId}:`, err.message);
    return null;
  }
}

export async function fetchCompetitionScorers(leagueId: number): Promise<any | null> {
  return null;
}

/** Lista as ligas disponíveis no plano principal */
export async function fetchAvailableLeagues(): Promise<any[]> {
  const headers = getHeaders();
  if (!headers) return [];

  try {
    const response = await axios.get(`${BASE_URL}/leagues`, { headers });
    return response.data?.data || [];
  } catch (err: any) {
    console.error('[FootballService] Erro ao buscar ligas:', err.message);
    return [];
  }
}
