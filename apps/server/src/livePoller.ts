// apps/server/src/livePoller.ts
// Polling de 30s para partidas ao vivo: atualiza placar, eventos e estatísticas

import { prisma } from './db';
import { redis } from './redis';
import {
  fetchLiveFixtures,
  fetchFixtureEvents,
  fetchFixtureStatistics,
  isApiConfigured,
  type ApiEvent,
  type ApiMatchStats,
} from './footballService';
import { generateLiveCommentary, generatePostMatchAnalysis } from './aiService';

const POLL_INTERVAL_MS = 30_000;   // 30 segundos
const AI_INTERVAL_MIN  = 5;        // análise IA a cada 5 minutos reais

let pollerTimer: NodeJS.Timeout | null = null;
let lastAiAnalysisMinutes: Map<string, number> = new Map();

/**
 * Inicia o live poller. Roda mesmo sem API configurada (apenas monitora o simulador).
 */
export function startLivePoller(): void {
  if (!isApiConfigured()) {
    console.log('[LivePoller] API-Football não configurada — usando apenas simulador local.');
    return;
  }

  console.log('[LivePoller] Iniciado — polling a cada 30s para partidas ao vivo.');
  pollerTimer = setInterval(pollLiveMatches, POLL_INTERVAL_MS);

  // Primeira execução imediata
  pollLiveMatches();
}

export function stopLivePoller(): void {
  if (pollerTimer) {
    clearInterval(pollerTimer);
    pollerTimer = null;
    console.log('[LivePoller] Parado.');
  }
}

/**
 * Ciclo principal: busca partidas ao vivo e atualiza cada uma.
 */
async function pollLiveMatches(): Promise<void> {
  try {
    const liveFixtures = await fetchLiveFixtures();

    if (liveFixtures.length === 0) {
      // Verifica se há partidas no banco marcadas como live que precisam ser encerradas
      await closeFinishedMatches();
      return;
    }

    console.log(`[LivePoller] ${liveFixtures.length} partida(s) ao vivo detectada(s).`);

    for (const fix of liveFixtures) {
      const matchId = `api-${fix.externalId}`;
      await updateLiveMatch(matchId, fix);
    }
  } catch (err: any) {
    console.error('[LivePoller] Erro no ciclo de polling:', err.message);
  }
}

/**
 * Atualiza uma partida ao vivo: placar, eventos, estatísticas e IA.
 */
async function updateLiveMatch(matchId: string, fix: any): Promise<void> {
  try {
    // Busca eventos e estatísticas em paralelo
    const [events, stats] = await Promise.all([
      fetchFixtureEvents(fix.externalId),
      fetchFixtureStatistics(fix.externalId),
    ]);

    // Converte eventos para o formato interno
    const timeline = events.map((e: ApiEvent) => ({
      minute: e.minute,
      type: e.type,
      team: 'home', // será resolvido pelo frontend baseado no nome do time
      teamName: e.team,
      detail: e.detail,
      icon: e.icon,
    }));

    // Atualiza o banco
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: fix.status,
        scoreHome: fix.scoreHome,
        scoreAway: fix.scoreAway,
        liveMinute: fix.liveMinute,
        timeline: JSON.stringify(timeline),
        liveStats: stats ? JSON.stringify(stats) : undefined,
      },
    }).catch(() => null);

    if (!updatedMatch) return;

    // Gera análise IA a cada 5 minutos (throttled)
    const lastAiMin = lastAiAnalysisMinutes.get(matchId) || -99;
    const currentMin = fix.liveMinute || 0;

    if (currentMin - lastAiMin >= AI_INTERVAL_MIN) {
      lastAiAnalysisMinutes.set(matchId, currentMin);

      // Não aguarda — executa em background
      generateLiveCommentary(
        {
          id: matchId,
          homeTeam: fix.homeTeam,
          awayTeam: fix.awayTeam,
          scoreHome: fix.scoreHome || 0,
          scoreAway: fix.scoreAway || 0,
          liveMinute: currentMin,
        },
        stats,
        events.slice(-10)
      ).then(commentary => {
        if (commentary) {
          publishMatchUpdate(matchId, { liveAiCommentary: commentary, liveMinute: currentMin });
        }
      }).catch(() => {});
    }

    // Publica atualização via Redis → SSE
    const fullMatch = buildMatchPayload(updatedMatch, stats);
    await publishMatchUpdate(matchId, fullMatch);

    console.log(`[LivePoller] ✅ ${fix.homeTeam} ${fix.scoreHome}x${fix.scoreAway} ${fix.awayTeam} (${currentMin}')`);

  } catch (err: any) {
    console.error(`[LivePoller] Erro ao atualizar ${matchId}:`, err.message);
  }
}

/**
 * Encerra partidas que estão marcadas como live mas a API não retornou mais.
 */
async function closeFinishedMatches(): Promise<void> {
  const liveMatches = await prisma.match.findMany({
    where: { status: 'live' },
  });

  for (const match of liveMatches) {
    // Se a partida é ao vivo mas não apareceu no poll, pode ter terminado
    // Verifica se passou do tempo esperado (90+ minutos e não veio mais dados)
    if (match.liveMinute && match.liveMinute >= 90) {
      await prisma.match.update({
        where: { id: match.id },
        data: { status: 'completed' },
      });

      // Gera análise pós-jogo
      const timeline = JSON.parse(match.timeline || '[]');
      const stats = match.liveStats ? JSON.parse(match.liveStats) : null;

      generatePostMatchAnalysis(
        {
          id: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          scoreHome: match.scoreHome || 0,
          scoreAway: match.scoreAway || 0,
          league: match.league,
          timeline,
        },
        stats
      ).catch(() => {});

      console.log(`[LivePoller] Partida ${match.id} encerrada — análise pós-jogo iniciada.`);
      await publishMatchUpdate(match.id, { status: 'completed', id: match.id });
    }
  }
}

function buildMatchPayload(match: any, stats: ApiMatchStats | null): any {
  return {
    id: match.id,
    status: match.status,
    scoreHome: match.scoreHome,
    scoreAway: match.scoreAway,
    liveMinute: match.liveMinute,
    timeline: JSON.parse(match.timeline || '[]'),
    liveStats: stats,
  };
}

async function publishMatchUpdate(matchId: string, payload: any): Promise<void> {
  try {
    await redis.publish('match:updates', JSON.stringify({ matchId, ...payload }));
  } catch (err: any) {
    console.warn('[LivePoller] Falha ao publicar no Redis:', err.message);
  }
}
