// apps/server/src/aiService.ts
// Serviço de análise com IA usando Google Gemini 1.5 Flash

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from './db';
import { fetchCompetitionStandings, type ApiMatchStats, type ApiEvent } from './footballService';

let genAI: GoogleGenerativeAI | null = null;

function getAI(): GoogleGenerativeAI | null {
  if (genAI) return genAI;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn('[AI] GEMINI_API_KEY não configurada. Análise IA desabilitada.');
    return null;
  }
  genAI = new GoogleGenerativeAI(key);
  return genAI;
}

export function isAiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

// ─── Análise pré-jogo ────────────────────────────────────────────────────────

export async function generatePreMatchAnalysis(match: {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  leagueId: number;
  stadium: string;
  date: string;
  time: string;
  lineups: any;
  tacticalAnalysis: string;
}): Promise<string> {
  const ai = getAI();
  if (!ai) return match.tacticalAnalysis || 'Análise de IA não disponível.';

  // Verifica cache — análise pré-jogo só é gerada uma vez
  const cached = await prisma.aiAnalysis.findFirst({
    where: { matchId: match.id, type: 'pre_match' },
    orderBy: { createdAt: 'desc' },
  });
  if (cached) return cached.content;

  const lineupsText = match.lineups
    ? `\nEscalação ${match.homeTeam}: ${match.lineups.home?.formation} - ${match.lineups.home?.players?.slice(0,5).map((p: any) => p.name).join(', ')}...\nEscalação ${match.awayTeam}: ${match.lineups.away?.formation} - ${match.lineups.away?.players?.slice(0,5).map((p: any) => p.name).join(', ')}...`
    : '';

  let standingsText = '';
  if (match.leagueId) {
    try {
      const standings = await fetchCompetitionStandings(match.leagueId);
      if (standings && standings.standings && standings.standings.length > 0) {
        const table = standings.standings[0].table;
        // fuzzy match
        const homePos = table.find((t: any) => t.team.name.includes(match.homeTeam) || match.homeTeam.includes(t.team.name));
        const awayPos = table.find((t: any) => t.team.name.includes(match.awayTeam) || match.awayTeam.includes(t.team.name));
        if (homePos && awayPos) {
          standingsText = `\nContexto do Campeonato:\n- ${match.homeTeam} está em ${homePos.position}º lugar com ${homePos.points} pontos.\n- ${match.awayTeam} está em ${awayPos.position}º lugar com ${awayPos.points} pontos.\nLeve o desespero do time mal colocado ou o favoritismo do líder em conta na sua análise!`;
        }
      }
    } catch { /* ignorar falha */ }
  }

  const prompt = `Você é um analista tático de futebol especialista, com linguagem envolvente e técnica. 
Faça uma análise pré-jogo completa em PORTUGUÊS BRASILEIRO para:

**${match.homeTeam} x ${match.awayTeam}**
Competição: ${match.league}
Data: ${match.date} às ${match.time}
Estádio: ${match.stadium}
${lineupsText}
${standingsText}

Analise:
1. O que esperar taticamente de cada equipe
2. Jogadores chave a observar
3. Dinâmicas de confronto (pressão alta, transições, bola parada)
4. Seu prognóstico para o resultado

Seja específico, técnico e envolvente. Use no máximo 350 palavras. Não use markdown com asteriscos, escreva em parágrafos fluidos.`;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Persiste no cache
    await prisma.aiAnalysis.create({
      data: { matchId: match.id, type: 'pre_match', minute: 0, content: text },
    });

    return text;
  } catch (err: any) {
    console.error('[AI] Erro ao gerar análise pré-jogo:', err.message);
    return match.tacticalAnalysis || 'Análise temporariamente indisponível.';
  }
}

// ─── Comentário ao vivo (chamado a cada 5 min) ────────────────────────────────

export async function generateLiveCommentary(match: {
  id: string;
  homeTeam: string;
  awayTeam: string;
  scoreHome: number;
  scoreAway: number;
  liveMinute: number;
}, stats: ApiMatchStats | null, recentEvents: ApiEvent[]): Promise<string> {
  const ai = getAI();
  if (!ai) return '';

  const minute = match.liveMinute;

  // Verifica cache — não regenera se análise do mesmo período de 5 min já existe
  const periodKey = Math.floor(minute / 5) * 5;
  const cached = await prisma.aiAnalysis.findFirst({
    where: {
      matchId: match.id,
      type: 'live',
      minute: { gte: periodKey, lt: periodKey + 5 },
    },
  });
  if (cached) return cached.content;

  const statsText = stats ? `
Estatísticas ao vivo:
- Posse: ${match.homeTeam} ${stats.possession.home}% x ${match.awayTeam} ${stats.possession.away}%
- Chutes (no gol): ${match.homeTeam} ${stats.shotsOnGoal.home} (${stats.shotsTotal.home} total) x ${match.awayTeam} ${stats.shotsOnGoal.away} (${stats.shotsTotal.away} total)
- Passes: ${match.homeTeam} ${stats.passesTotal.home} x ${match.awayTeam} ${stats.passesTotal.away}
- Escanteios: ${match.homeTeam} ${stats.corners.home} x ${match.awayTeam} ${stats.corners.away}
- Faltas: ${match.homeTeam} ${stats.fouls.home} x ${match.awayTeam} ${stats.fouls.away}` : '';

  const eventsText = recentEvents.length > 0
    ? '\nÚltimos eventos:\n' + recentEvents.slice(-5).map(e => `Min ${e.minute}: ${e.detail}`).join('\n')
    : '';

  const prompt = `Você é um comentarista de futebol ao vivo, com linguagem dinâmica e técnica em PORTUGUÊS BRASILEIRO.

Jogo ao vivo — Minuto ${minute}:
${match.homeTeam} ${match.scoreHome} x ${match.scoreAway} ${match.awayTeam}
${statsText}
${eventsText}

Escreva um parágrafo curto e envolvente (máximo 120 palavras) sobre o momento atual do jogo. 
Comente o ritmo, quem está dominando e o que pode acontecer. Seja dinâmico como um comentarista real.
Não use markdown. Não repita os números de estatísticas verbalmente — interprete-os.`;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    await prisma.aiAnalysis.create({
      data: { matchId: match.id, type: 'live', minute, content: text },
    });

    return text;
  } catch (err: any) {
    console.error('[AI] Erro ao gerar comentário ao vivo:', err.message);
    return '';
  }
}

// ─── Análise pós-jogo ────────────────────────────────────────────────────────

export async function generatePostMatchAnalysis(match: {
  id: string;
  homeTeam: string;
  awayTeam: string;
  scoreHome: number;
  scoreAway: number;
  league: string;
  timeline: any[];
}, stats: ApiMatchStats | null): Promise<string> {
  const ai = getAI();
  if (!ai) return '';

  // Verifica cache
  const cached = await prisma.aiAnalysis.findFirst({
    where: { matchId: match.id, type: 'post_match' },
  });
  if (cached) return cached.content;

  const statsText = stats ? `
Estatísticas finais:
- Posse: ${match.homeTeam} ${stats.possession.home}% x ${match.awayTeam} ${stats.possession.away}%
- Chutes no gol: ${match.homeTeam} ${stats.shotsOnGoal.home} x ${match.awayTeam} ${stats.shotsOnGoal.away}
- Passes: ${match.homeTeam} ${stats.passesTotal.home} x ${match.awayTeam} ${stats.passesTotal.away}
- Faltas: ${match.homeTeam} ${stats.fouls.home} x ${match.awayTeam} ${stats.fouls.away}` : '';

  const goalsText = match.timeline
    .filter(e => e.type === 'goal')
    .map(e => `Min ${e.minute}: ${e.detail}`)
    .join('\n');

  const prompt = `Você é um analista tático de futebol de alto nível. Escreva uma análise pós-jogo completa em PORTUGUÊS BRASILEIRO.

**Resultado Final: ${match.homeTeam} ${match.scoreHome} x ${match.scoreAway} ${match.awayTeam}**
Competição: ${match.league}

Gols:
${goalsText || 'Nenhum gol'}
${statsText}

Analise:
1. O que decidiu o jogo taticamente
2. As fases do jogo e os momentos-chave
3. Os destaques individuais
4. O que cada time acertou e errou
5. Impacto no campeonato / classificação

Use no máximo 400 palavras. Seja técnico e envolvente. Escreva em parágrafos sem markdown.`;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    await prisma.aiAnalysis.create({
      data: { matchId: match.id, type: 'post_match', minute: 999, content: text },
    });

    return text;
  } catch (err: any) {
    console.error('[AI] Erro ao gerar análise pós-jogo:', err.message);
    return '';
  }
}

// ─── Buscar análise mais recente de uma partida ───────────────────────────────

export async function getLatestAnalysis(matchId: string, type?: string): Promise<string | null> {
  try {
    const analysis = await prisma.aiAnalysis.findFirst({
      where: {
        matchId,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    return analysis?.content || null;
  } catch {
    return null;
  }
}
