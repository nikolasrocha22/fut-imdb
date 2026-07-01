// apps/server/src/simulator.ts
import { prisma } from './db';
import { redis } from './redis';

const EVENT_ICONS = {
  goal: "⚽",
  card: "🟨",
  redCard: "🟥",
  sub: "🔄",
  var: "🖥️"
};

export function startMatchSimulator() {
  console.log("Iniciando o Simulador de Partidas ao Vivo...");
  
  // Executa a cada 10 segundos
  setInterval(async () => {
    try {
      // Busca partidas marcadas como "live" (ao vivo)
      const liveMatches = await prisma.match.findMany({
        where: { status: 'live' }
      });

      for (const match of liveMatches) {
        // Incrementa o minuto
        let timeline = JSON.parse(match.timeline || '[]');
        let currentMinute = match.scoreHome !== null ? (timeline.length > 0 ? Math.max(...timeline.map((e: any) => e.minute)) + 1 : 1) : 1;
        
        // Se a partida passar de 90 minutos, encerra
        if (currentMinute > 90) {
          await prisma.match.update({
            where: { id: match.id },
            data: { status: 'completed' }
          });
          
          const completedMatch = {
            ...match,
            status: 'completed',
            timeline: JSON.stringify(timeline)
          };
          
          await redis.publish('match:updates', JSON.stringify(completedMatch));
          console.log(`Partida encerrada: ${match.homeTeam} x ${match.awayTeam}`);
          continue;
        }

        // Flutuações estatísticas e eventos
        let scoreHome = match.scoreHome || 0;
        let scoreAway = match.scoreAway || 0;
        let updated = false;

        const roll = Math.random();

        // 1. Chance de GOL (3%)
        if (roll < 0.03) {
          const isHome = Math.random() > 0.5;
          let scorer = "";
          let teamEmoji = "";
          
          if (isHome) {
            scoreHome += 1;
            teamEmoji = match.homeEmoji;
            scorer = isHomeScorer(match.homeTeam);
          } else {
            scoreAway += 1;
            teamEmoji = match.awayEmoji;
            scorer = isAwayScorer(match.awayTeam);
          }

          timeline.push({
            minute: currentMinute,
            type: "goal",
            team: isHome ? "home" : "away",
            detail: `Gol de ${scorer} (Placar: ${scoreHome} x ${scoreAway})`,
            icon: EVENT_ICONS.goal
          });
          updated = true;
          console.log(`[SIMULADOR] GOL! ${match.homeTeam} ${scoreHome} x ${scoreAway} ${match.awayTeam} (Minuto ${currentMinute})`);

        // 2. Chance de CARTÃO (5%)
        } else if (roll < 0.08) {
          const isHome = Math.random() > 0.5;
          const isRed = Math.random() > 0.9; // 10% de ser vermelho
          const player = isHome ? isHomePlayer(match.homeTeam) : isAwayPlayer(match.awayTeam);
          
          timeline.push({
            minute: currentMinute,
            type: isRed ? "redCard" : "card",
            team: isHome ? "home" : "away",
            detail: isRed ? `Cartão Vermelho para ${player}!` : `Cartão Amarelo para ${player}`,
            icon: isRed ? EVENT_ICONS.redCard : EVENT_ICONS.card
          });
          updated = true;

        // 3. Chance de SUBSTITUIÇÃO (4%)
        } else if (roll < 0.12) {
          const isHome = Math.random() > 0.5;
          const players = isHome ? [isHomePlayer(match.homeTeam), "Reserva"] : [isAwayPlayer(match.awayTeam), "Reserva"];
          
          timeline.push({
            minute: currentMinute,
            type: "sub",
            team: isHome ? "home" : "away",
            detail: `Substituição: Sai ${players[0]}, entra ${players[1]}`,
            icon: EVENT_ICONS.sub
          });
          updated = true;
        }

        // Se o minuto mudou ou houve gols/cartões, atualiza o DB e publica no Redis
        // Vamos atualizar as estatísticas também
        let lineups = match.lineups;
        const dbUpdates: any = {
          timeline: JSON.stringify(timeline)
        };

        if (updated) {
          dbUpdates.scoreHome = scoreHome;
          dbUpdates.scoreAway = scoreAway;
        }

        const updatedMatch = await prisma.match.update({
          where: { id: match.id },
          data: dbUpdates
        });

        // Adiciona o minuto virtual atual para enviar no SSE
        const matchDataToSend = {
          ...updatedMatch,
          minute: currentMinute,
          timeline: timeline // Envia como array de verdade para poupar JSON.parse no React
        };

        await redis.publish('match:updates', JSON.stringify(matchDataToSend));
      }
    } catch (err) {
      console.error("Erro na simulação de partidas:", err);
    }
  }, 10000); // 10s
}

// Helpers para nomes fictícios de jogadores baseados nos times
function isHomeScorer(team: string) {
  if (team === "Flamengo") return ["Pedro", "Arrascaeta", "Gerson", "Luiz Araújo"][Math.floor(Math.random() * 4)];
  return "Atacante Casa";
}

function isAwayScorer(team: string) {
  if (team === "Vasco") return ["Vegetti", "Payet", "David", "Coutinho"][Math.floor(Math.random() * 4)];
  return "Atacante Fora";
}

function isHomePlayer(team: string) {
  if (team === "Flamengo") return ["Rossi", "Wesley", "Léo Ortiz", "Allan", "Pedro"][Math.floor(Math.random() * 5)];
  return "Jogador Casa";
}

function isAwayPlayer(team: string) {
  if (team === "Vasco") return ["Léo Jardim", "Piton", "Maicon", "Adson", "Vegetti"][Math.floor(Math.random() * 5)];
  return "Jogador Fora";
}
