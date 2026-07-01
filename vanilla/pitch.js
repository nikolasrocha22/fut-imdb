// pitch.js - Gerenciador do Campo Tático do FutNota

const TEAM_COLORS = {
  "Milan": { bg: "#b91c1c", text: "#ffffff" },
  "Liverpool": { bg: "#dc2626", text: "#ffffff" },
  "Brasil": { bg: "#eab308", text: "#0f172a" },
  "Alemanha": { bg: "#1e293b", text: "#ffffff" },
  "Barcelona": { bg: "#1e40af", text: "#ffffff" },
  "Paris Saint-Germain": { bg: "#111827", text: "#ffffff" },
  "Real Madrid": { bg: "#f8fafc", text: "#0f172a" },
  "Manchester City": { bg: "#38bdf8", text: "#0f172a" },
  "Flamengo": { bg: "#b91c1c", text: "#ffffff" },
  "Palmeiras": { bg: "#15803d", text: "#ffffff" },
  "Vasco": { bg: "#111827", text: "#ffffff" }
};

function getTeamColor(teamName) {
  return TEAM_COLORS[teamName] || { bg: "#10b981", text: "#ffffff" }; // Default Green
}

function initTacticalPitch(containerId, match) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Limpa o contêiner
  container.innerHTML = "";

  if (!match.lineups) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p>Escalações táticas indisponíveis para esta partida.</p>
      </div>
    `;
    return;
  }

  // Cria o campo tático (layout do gramado)
  const pitch = document.createElement("div");
  pitch.className = "tactical-pitch";

  // Desenha marcações do campo
  const centerLine = document.createElement("div");
  centerLine.className = "pitch-center-line";
  
  const centerCircle = document.createElement("div");
  centerCircle.className = "pitch-center-circle";

  const boxTop = document.createElement("div");
  boxTop.className = "pitch-box-top";

  const boxBottom = document.createElement("div");
  boxBottom.className = "pitch-box-bottom";

  pitch.appendChild(centerLine);
  pitch.appendChild(centerCircle);
  pitch.appendChild(boxTop);
  pitch.appendChild(boxBottom);

  // Cores dos times
  const homeColors = getTeamColor(match.homeTeam);
  const awayColors = getTeamColor(match.awayTeam);

  // Renderiza jogadores do Time da Casa (Home)
  match.lineups.home.players.forEach(player => {
    const playerEl = createPlayerElement(player, homeColors);
    pitch.appendChild(playerEl);
  });

  // Renderiza jogadores do Time de Fora (Away)
  match.lineups.away.players.forEach(player => {
    const playerEl = createPlayerElement(player, awayColors);
    pitch.appendChild(playerEl);
  });

  container.appendChild(pitch);
}

function createPlayerElement(player, colors) {
  const playerDiv = document.createElement("div");
  playerDiv.className = "pitch-player";
  playerDiv.style.left = `${player.x}%`;
  playerDiv.style.top = `${player.y}%`;
  playerDiv.title = `${player.name} (${player.pos})`;

  const jersey = document.createElement("div");
  jersey.className = "player-jersey";
  jersey.innerText = player.number;
  jersey.style.backgroundColor = colors.bg;
  jersey.style.color = colors.text;
  jersey.style.setProperty("--team-color", colors.bg);

  const name = document.createElement("div");
  name.className = "player-name";
  name.innerText = player.name.split(" ")[0]; // Apenas o primeiro nome/apelido para caber

  playerDiv.appendChild(jersey);
  playerDiv.appendChild(name);

  return playerDiv;
}
