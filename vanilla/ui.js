// ui.js - Gerenciador da Interface do FutNota

// Formatação amigável de datas em português
function formatDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Renderiza a Home Page
function renderHome(matches, filterLeague = "all") {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = "";

  // 1. Cria a barra de filtros por liga
  const leagues = ["all", ...new Set(matches.map(m => m.league))];
  const filtersBar = document.createElement("div");
  filtersBar.className = "filters-bar";
  leagues.forEach(league => {
    const btn = document.createElement("button");
    btn.className = `filter-btn ${league === filterLeague ? 'active' : ''}`;
    btn.innerText = league === "all" ? "Todos os Campeonatos" : league;
    btn.addEventListener("click", () => {
      renderHome(matches, league);
    });
    filtersBar.appendChild(btn);
  });
  contentArea.appendChild(filtersBar);

  // Filtra as partidas se necessário
  let filteredMatches = matches;
  if (filterLeague !== "all") {
    filteredMatches = matches.filter(m => m.league === filterLeague);
  }

  // 2. Hero Banner (Destaque)
  const completedMatches = filteredMatches.filter(m => m.status === "completed");
  if (completedMatches.length > 0 && filterLeague === "all") {
    const topMatch = completedMatches.reduce((max, m) => m.rating > max.rating ? m : max, completedMatches[0]);
    const heroSection = document.createElement("div");
    heroSection.className = "hero-banner";
    heroSection.innerHTML = `
      <div class="hero-tag">🔥 MELHOR AVALIADO</div>
      <h2 class="hero-title">${topMatch.homeEmoji} ${topMatch.homeTeam} ${topMatch.score.home} x ${topMatch.score.away} ${topMatch.awayTeam} ${topMatch.awayEmoji}</h2>
      <p class="hero-description">Reviva esta partida clássica de ${topMatch.league}. Avaliada com nota <strong>⭐ ${topMatch.rating.toFixed(1)}</strong> por mais de ${topMatch.votes} fãs. Veja as estatísticas, escalações e leia análises táticas completas.</p>
      <button class="hero-btn" onclick="openMatchModal('${topMatch.id}')">Ver Detalhes do Espetáculo</button>
    `;
    contentArea.appendChild(heroSection);
  }

  // 3. Partidas ao Vivo
  const liveMatches = filteredMatches.filter(m => m.status === "live");
  if (liveMatches.length > 0) {
    const liveTitle = document.createElement("h2");
    liveTitle.className = "section-title";
    liveTitle.innerHTML = `Partidas ao Vivo <span class="title-badge">Ao Vivo</span>`;
    contentArea.appendChild(liveTitle);

    const liveGrid = document.createElement("div");
    liveGrid.className = "match-grid";
    liveMatches.forEach(match => {
      liveGrid.appendChild(createMatchCard(match));
    });
    contentArea.appendChild(liveGrid);
  }

  // 4. Partidas Recentes (Encerradas)
  const recentMatches = filteredMatches.filter(m => m.status === "completed");
  if (recentMatches.length > 0) {
    const recentTitle = document.createElement("h2");
    recentTitle.className = "section-title";
    recentTitle.innerText = "Partidas Recentes (Placar & Notas)";
    contentArea.appendChild(recentTitle);

    const recentGrid = document.createElement("div");
    recentGrid.className = "match-grid";
    recentMatches.forEach(match => {
      recentGrid.appendChild(createMatchCard(match));
    });
    contentArea.appendChild(recentGrid);
  }

  // Se não houver nada
  if (liveMatches.length === 0 && recentMatches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <div class="empty-state-icon">⚽</div>
      <p>Nenhuma partida encontrada para este campeonato.</p>
    `;
    contentArea.appendChild(empty);
  }
}

// Cria um Card de Partida
function createMatchCard(match) {
  const card = document.createElement("div");
  card.className = "match-card";
  card.addEventListener("click", () => openMatchModal(match.id));

  const isLive = match.status === "live";
  const statusText = isLive ? `${match.minute}'` : "Encerrado";
  const ratingText = match.rating > 0 ? `⭐ ${match.rating.toFixed(1)}` : "Sem nota";

  card.innerHTML = `
    <div class="card-header">
      <span class="card-league">${match.leagueEmoji} ${match.league}</span>
      <span class="card-status ${isLive ? 'live' : ''}">${statusText}</span>
    </div>
    <div class="card-teams">
      <div class="team-row">
        <div class="team-info">
          <span class="team-emoji">${match.homeEmoji}</span>
          <span class="team-name">${match.homeTeam}</span>
        </div>
        <span class="team-score">${match.score ? match.score.home : '-'}</span>
      </div>
      <div class="team-row">
        <div class="team-info">
          <span class="team-emoji">${match.awayEmoji}</span>
          <span class="team-name">${match.awayTeam}</span>
        </div>
        <span class="team-score">${match.score ? match.score.away : '-'}</span>
      </div>
    </div>
    <div class="card-footer">
      <span class="match-venue">📍 ${match.stadium.split(',')[0]}</span>
      <span class="rating-badge ${match.rating === 0 ? 'no-rating' : ''}">${ratingText}</span>
    </div>
  `;

  return card;
}

// Renderiza a Página de Ranking Geral (IMDb das Partidas)
function renderRanking(matches) {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.innerText = "Ranking de Partidas FutNota (As Melhores da História)";
  contentArea.appendChild(title);

  // Filtra apenas as terminadas e ordena pela nota decrescente
  const ratedMatches = matches
    .filter(m => m.status === "completed" && m.rating > 0)
    .sort((a, b) => b.rating - a.rating);

  if (ratedMatches.length === 0) {
    contentArea.innerHTML += `
      <div class="empty-state">
        <div class="empty-state-icon">⭐</div>
        <p>Ainda não há partidas avaliadas para compor o ranking.</p>
      </div>
    `;
    return;
  }

  const table = document.createElement("table");
  table.className = "ranking-table";
  
  table.innerHTML = `
    <thead>
      <tr>
        <th>Posição</th>
        <th>Partida</th>
        <th>Campeonato</th>
        <th>Avaliação Média</th>
        <th>Total de Votos</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody id="ranking-tbody"></tbody>
  `;
  contentArea.appendChild(table);

  const tbody = document.getElementById("ranking-tbody");
  ratedMatches.forEach((match, index) => {
    const tr = document.createElement("tr");
    tr.addEventListener("click", () => openMatchModal(match.id));

    // Determina badges e estilos para o pódio
    let rankClass = "";
    if (index === 0) rankClass = "rank-1";
    else if (index === 1) rankClass = "rank-2";
    else if (index === 2) rankClass = "rank-3";

    const scoreText = `${match.score.home} x ${match.score.away}`;
    const penText = match.score.penHome ? `<br><small class="score-pens">(${match.score.penHome} x ${match.score.penAway} Pen)</small>` : "";
    
    // Badge de espetáculo para jogos nota 9.0+
    const spectacleBadge = match.rating >= 9.0 ? `<span class="badge-spectacle">Obra de Arte</span>` : "";

    tr.innerHTML = `
      <td class="rank-number ${rankClass}">#${index + 1}</td>
      <td>
        <div class="match-cell-teams">
          <span>${match.homeEmoji} ${match.homeTeam}</span>
          <span class="match-cell-score">${scoreText}</span>
          <span>${match.awayTeam} ${match.awayEmoji}</span>
          ${penText}
        </div>
      </td>
      <td>${match.leagueEmoji} ${match.league}</td>
      <td class="ranking-rating"><strong>⭐ ${match.rating.toFixed(1)}</strong>/10</td>
      <td>${match.votes.toLocaleString("pt-BR")} votos</td>
      <td>${spectacleBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Renderiza a Página de Agenda (Partidas Futuras)
function renderAgenda(matches) {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.innerText = "Próximos Grandes Jogos (Marque na Agenda)";
  contentArea.appendChild(title);

  const scheduled = matches.filter(m => m.status === "scheduled");

  if (scheduled.length === 0) {
    contentArea.innerHTML += `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <p>Não há partidas agendadas no momento.</p>
      </div>
    `;
    return;
  }

  // Agrupa por data
  const grouped = {};
  scheduled.forEach(match => {
    if (!grouped[match.date]) {
      grouped[match.date] = [];
    }
    grouped[match.date].push(match);
  });

  // Ordena as datas de forma crescente
  const sortedDates = Object.keys(grouped).sort();

  sortedDates.forEach(date => {
    const daySection = document.createElement("div");
    daySection.className = "agenda-day-card";

    const formatted = formatDate(date);
    daySection.innerHTML = `
      <h3 class="agenda-day-title">📅 ${formatted}</h3>
      <div class="match-grid"></div>
    `;
    
    const grid = daySection.querySelector(".match-grid");
    grouped[date].forEach(match => {
      const card = document.createElement("div");
      card.className = "match-card";
      card.addEventListener("click", () => openMatchModal(match.id));
      card.innerHTML = `
        <div class="card-header">
          <span class="card-league">${match.leagueEmoji} ${match.league}</span>
          <span class="card-status" style="color: var(--primary-accent);">${match.time}</span>
        </div>
        <div class="card-teams">
          <div class="team-row">
            <div class="team-info">
              <span class="team-emoji">${match.homeEmoji}</span>
              <span class="team-name">${match.homeTeam}</span>
            </div>
            <span class="team-score">-</span>
          </div>
          <div class="team-row">
            <div class="team-info">
              <span class="team-emoji">${match.awayEmoji}</span>
              <span class="team-name">${match.awayTeam}</span>
            </div>
            <span class="team-score">-</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="match-venue" style="max-width: 100%;">📍 ${match.stadium}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    contentArea.appendChild(daySection);
  });
}

// Abre o Modal com Detalhes da Partida
function openMatchModal(matchId) {
  const matches = getMatches();
  const match = matches.find(m => m.id === matchId);
  if (!match) return;

  const modal = document.getElementById("match-modal");
  const modalBody = document.getElementById("modal-body-content");
  
  modalBody.innerHTML = "";
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Impede scroll do body principal

  // Header do modal
  const header = document.createElement("div");
  header.className = "match-detail-header";

  const isLive = match.status === "live";
  const isSched = match.status === "scheduled";
  
  let scoreDisplay = "";
  if (isSched) {
    scoreDisplay = `<div class="score-value" style="font-size: 2.2rem; font-family: var(--font-heading);">${match.time}</div>`;
  } else {
    const penDisplay = match.score.penHome ? `<div class="score-pens">(${match.score.penHome} x ${match.score.penAway} nos pênaltis)</div>` : "";
    scoreDisplay = `
      <div class="score-value">${match.score.home}</div>
      <div class="score-divider">x</div>
      <div class="score-value">${match.score.away}</div>
      ${penDisplay}
    `;
  }

  const ratingHeaderDisplay = match.status !== "scheduled" ? `
    <div class="header-rating-box">
      <div class="rating-value">
        <div class="rating-large">⭐ ${match.rating > 0 ? match.rating.toFixed(1) : "N/A"} <span>/10</span></div>
        <div class="rating-count">${match.votes.toLocaleString("pt-BR")} avaliações</div>
      </div>
    </div>
  ` : `
    <div class="header-rating-box">
      <span class="rating-count">Partida futura - Avaliações estarão disponíveis após o apito final!</span>
    </div>
  `;

  header.innerHTML = `
    <div class="header-league">${match.leagueEmoji} ${match.league}</div>
    <div class="header-scoreboard">
      <div class="score-team">
        <span class="score-team-emoji">${match.homeEmoji}</span>
        <span class="score-team-name">${match.homeTeam}</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="display: flex; align-items: center; gap: 16px;">
          ${scoreDisplay}
        </div>
      </div>
      <div class="score-team">
        <span class="score-team-emoji">${match.awayEmoji}</span>
        <span class="score-team-name">${match.awayTeam}</span>
      </div>
    </div>
    <div class="header-meta">
      <span>🏟️ ${match.stadium}</span>
      <span>📅 ${formatDate(match.date)}</span>
      <span>🏁 Árbitro: ${match.referee}</span>
    </div>
    ${ratingHeaderDisplay}
  `;
  modalBody.appendChild(header);

  // Tabs de detalhes
  const tabs = document.createElement("div");
  tabs.className = "detail-tabs";
  
  const tabsList = [
    { id: "stats-tab", name: "Estatísticas", active: !isSched },
    { id: "lineup-tab", name: "Escalação Tática", active: false },
    { id: "timeline-tab", name: "Cronologia", active: false },
    { id: "analysis-tab", name: "Análise Tática", active: isSched },
    { id: "reviews-tab", name: "Notas & Resenhas", active: false }
  ];

  tabsList.forEach(tab => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${tab.active ? 'active' : ''}`;
    btn.id = tab.id + "-btn";
    btn.innerText = tab.name;
    btn.addEventListener("click", () => {
      switchTab(tab.id, match);
    });
    tabs.appendChild(btn);
  });
  modalBody.appendChild(tabs);

  // Container dos conteúdos das abas
  const tabContent = document.createElement("div");
  tabContent.className = "tab-content";
  tabContent.id = "modal-tab-content";
  modalBody.appendChild(tabContent);

  // Renderiza a primeira aba ativa
  const activeTab = tabsList.find(t => t.active).id;
  switchTab(activeTab, match);
}

// Troca de Aba no Modal
function switchTab(tabId, match) {
  // Atualiza classes ativas dos botões
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.getElementById(`${tabId}-btn`);
  if (activeBtn) activeBtn.classList.add("active");

  const container = document.getElementById("modal-tab-content");
  container.innerHTML = "";

  if (tabId === "stats-tab") {
    // 1. ESTATÍSTICAS
    if (!match.stats) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <p>Estatísticas indisponíveis para esta partida.</p>
        </div>
      `;
      return;
    }
    const statsList = document.createElement("div");
    statsList.className = "stats-list";
    
    const statsMap = [
      { name: "Posse de Bola", key: "possession", suffix: "%" },
      { name: "Finalizações", key: "shots", suffix: "" },
      { name: "Finalizações no Gol", key: "shotsOnTarget", suffix: "" },
      { name: "Gols Esperados (xG)", key: "xG", suffix: "" },
      { name: "Faltas", key: "fouls", suffix: "" },
      { name: "Escanteios", key: "corners", suffix: "" },
      { name: "Cartões Amarelos", key: "yellowCards", suffix: "" },
      { name: "Cartões Vermelhos", key: "redCards", suffix: "" }
    ];

    statsMap.forEach(stat => {
      const homeVal = match.stats[stat.key][0];
      const awayVal = match.stats[stat.key][1];
      const total = homeVal + awayVal;
      const homePct = total > 0 ? (homeVal / total) * 100 : 50;
      const awayPct = total > 0 ? (awayVal / total) * 100 : 50;

      const statRow = document.createElement("div");
      statRow.className = "stat-row";
      statRow.innerHTML = `
        <div class="stat-info">
          <span>${homeVal}${stat.suffix}</span>
          <span class="stat-name">${stat.name}</span>
          <span>${awayVal}${stat.suffix}</span>
        </div>
        <div class="stat-bar-container">
          <div class="stat-bar-home" style="width: ${homePct}%"></div>
          <div class="stat-bar-away" style="width: ${awayPct}%"></div>
        </div>
      `;
      statsList.appendChild(statRow);
    });
    container.appendChild(statsList);

  } else if (tabId === "lineup-tab") {
    // 2. ESCALAÇÃO TÁTICA E LISTAS
    if (!match.lineups) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p>Escalações táticas indisponíveis para esta partida.</p>
        </div>
      `;
      return;
    }

    const pitchWrapper = document.createElement("div");
    pitchWrapper.className = "pitch-container";
    
    // Campo Tático
    const pitchDiv = document.createElement("div");
    pitchDiv.id = "tactical-pitch-inner";
    pitchDiv.style.width = "100%";
    pitchWrapper.appendChild(pitchDiv);

    // Listas Textuais
    const listDiv = document.createElement("div");
    listDiv.className = "lineup-lists-container";
    
    // Lista Home
    let homeListHtml = `
      <div class="lineup-team-card">
        <h4 class="lineup-team-title">
          <span>${match.homeEmoji} ${match.homeTeam}</span>
          <span>Formação: ${match.lineups.home.formation}</span>
        </h4>
    `;
    match.lineups.home.players.forEach(p => {
      homeListHtml += `
        <div class="lineup-player-row">
          <span><strong>${p.number}</strong>. ${p.name}</span>
          <span style="color: var(--text-muted); font-size: 0.8rem;">${p.pos}</span>
        </div>
      `;
    });
    homeListHtml += `</div>`;

    // Lista Away
    let awayListHtml = `
      <div class="lineup-team-card">
        <h4 class="lineup-team-title" style="color: #3b82f6;">
          <span>${match.awayEmoji} ${match.awayTeam}</span>
          <span>Formação: ${match.lineups.away.formation}</span>
        </h4>
    `;
    match.lineups.away.players.forEach(p => {
      awayListHtml += `
        <div class="lineup-player-row">
          <span><strong>${p.number}</strong>. ${p.name}</span>
          <span style="color: var(--text-muted); font-size: 0.8rem;">${p.pos}</span>
        </div>
      `;
    });
    awayListHtml += `</div>`;

    listDiv.innerHTML = homeListHtml + awayListHtml;
    pitchWrapper.appendChild(listDiv);
    container.appendChild(pitchWrapper);

    // Inicializa o campo desenhado em pitch.js
    initTacticalPitch("tactical-pitch-inner", match);

  } else if (tabId === "timeline-tab") {
    // 3. CRONOLOGIA
    if (!match.timeline || match.timeline.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⏳</div>
          <p>Esta partida ainda não iniciou ou não teve eventos registrados.</p>
        </div>
      `;
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "timeline-wrapper";

    match.timeline.forEach(event => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `
        <span class="timeline-icon">${event.icon}</span>
        <div class="timeline-time">${event.minute}'</div>
        <div class="timeline-detail">
          <strong>[${event.team === 'home' ? match.homeTeam : match.awayTeam}]</strong> ${event.detail}
        </div>
      `;
      wrapper.appendChild(item);
    });
    container.appendChild(wrapper);

  } else if (tabId === "analysis-tab") {
    // 4. ANÁLISE TÁTICA PROFUNDA
    const textDiv = document.createElement("div");
    textDiv.className = "tactical-text";
    textDiv.innerText = match.tacticalAnalysis || "Análise tática em elaboração para este clássico.";
    container.appendChild(textDiv);

  } else if (tabId === "reviews-tab") {
    // 5. NOTAS E RESENHAS (ESTILO IMDb)
    if (match.status === "scheduled") {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⭐</div>
          <p>Esta partida ainda não ocorreu. As avaliações de usuários abrirão após o apito final!</p>
        </div>
      `;
      return;
    }

    const section = document.createElement("div");
    section.className = "reviews-section";

    // 5a. Card para o usuário deixar nota
    const reviewCard = document.createElement("div");
    reviewCard.className = "user-rating-card";
    
    // Verifica se o usuário já avaliou esta partida
    const currentMatches = getMatches();
    const currentMatchInDb = currentMatches.find(m => m.id === match.id);
    const userHasRated = currentMatchInDb && currentMatchInDb.userRating;

    if (userHasRated) {
      reviewCard.innerHTML = `
        <h4 class="rating-card-title">Sua Avaliação</h4>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 1.4rem; color: var(--rating-color);">⭐</span>
          <span style="font-size: 1.3rem; font-family: var(--font-mono); font-weight: 700;">${currentMatchInDb.userRating.toFixed(1)}/10</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Você já avaliou esta partida. Obrigado pela sua análise!</p>
      `;
    } else {
      reviewCard.innerHTML = `
        <h4 class="rating-card-title">Avalie o Espetáculo</h4>
        <form id="rating-form">
          <div class="slider-group">
            <div class="slider-header">
              <label for="user-rating-slider" style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">Sua Nota (0 a 10):</label>
              <span id="slider-value-display" class="slider-val-box">5.0</span>
            </div>
            <input type="range" id="user-rating-slider" class="rating-slider" min="0" max="10" step="0.1" value="5.0">
          </div>
          <div class="review-input-group">
            <label for="user-review-text">Sua Análise Tática Aprofundada (Opcional):</label>
            <textarea id="user-review-text" class="review-textarea" placeholder="O que achou dos esquemas táticos? O placar foi justo? Quais foram os destaques positivos e negativos?"></textarea>
          </div>
          <button type="submit" class="submit-review-btn">Publicar Avaliação</button>
        </form>
      `;

      // Event listener para atualizar o display da nota em tempo real
      setTimeout(() => {
        const slider = document.getElementById("user-rating-slider");
        const display = document.getElementById("slider-value-display");
        if (slider && display) {
          slider.addEventListener("input", (e) => {
            display.innerText = parseFloat(e.target.value).toFixed(1);
          });
        }

        // Listener de envio do formulário
        const form = document.getElementById("rating-form");
        if (form) {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const ratingVal = parseFloat(slider.value);
            const reviewText = document.getElementById("user-review-text").value.trim();
            submitUserRating(match.id, ratingVal, reviewText);
          });
        }
      }, 50);
    }
    section.appendChild(reviewCard);

    // 5b. Lista de avaliações dos usuários
    const reviewsList = document.createElement("div");
    reviewsList.className = "reviews-list";
    
    const title = document.createElement("h4");
    title.className = "rating-card-title";
    title.innerText = `Análises da Torcida (${match.reviews.length})`;
    reviewsList.appendChild(title);

    if (match.reviews.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.style.padding = "20px";
      empty.innerHTML = `
        <div class="empty-state-icon">💬</div>
        <p>Seja o primeiro a escrever uma análise para esta partida!</p>
      `;
      reviewsList.appendChild(empty);
    } else {
      // Ordena por quantidade de likes/ajuda decrescente
      const sortedReviews = [...match.reviews].sort((a, b) => b.likes - a.likes);
      
      sortedReviews.forEach(rev => {
        const item = document.createElement("div");
        item.className = "review-item";
        item.innerHTML = `
          <div class="review-header">
            <div class="review-user-info">
              <span class="avatar" style="font-size: 0.9rem; width: 28px; height: 28px;">⚽</span>
              <span class="review-username">@${rev.username}</span>
              <span class="review-date">${formatDate(rev.date)}</span>
            </div>
            <span class="review-rating-badge">⭐ ${rev.rating.toFixed(1)}</span>
          </div>
          <div class="review-text">${rev.text}</div>
          <div class="review-likes-container">
            <span>Esta análise foi útil?</span>
            <button class="like-review-btn" id="like-btn-${rev.id}" onclick="likeReview('${match.id}', '${rev.id}')">
              👍 Sim (${rev.likes})
            </button>
          </div>
        `;
        reviewsList.appendChild(item);
      });
    }

    section.appendChild(reviewsList);
    container.appendChild(section);
  }
}

// Salva avaliação do usuário e recalcula médias
function submitUserRating(matchId, rating, text) {
  const matches = getMatches();
  const index = matches.findIndex(m => m.id === matchId);
  if (index === -1) return;

  const match = matches[index];

  // 1. Salva a nota individual do usuário
  match.userRating = rating;

  // 2. Adiciona o review textual se houver
  if (text) {
    const newReview = {
      id: "user-r-" + Date.now(),
      username: "voce",
      rating: rating,
      text: text,
      date: new Date().toISOString().split("T")[0],
      likes: 0
    };
    match.reviews.unshift(newReview); // Insere no topo
  }

  // 3. Recalcula a nota média no estilo IMDb
  const newVotes = match.votes + 1;
  const newRating = ((match.rating * match.votes) + rating) / newVotes;
  
  match.votes = newVotes;
  match.rating = newRating;

  // 4. Salva no banco de dados do localStorage
  saveMatches(matches);

  // 5. Atualiza a visualização atual
  // Reabre e re-renderiza o modal e os tabs
  openMatchModal(matchId);
  switchTab("reviews-tab", match);

  // Recarrega a página de fundo ativa da SPA
  const activeMenu = document.querySelector(".nav-item.active");
  if (activeMenu) {
    const target = activeMenu.getAttribute("data-target");
    if (target === "home") renderHome(matches);
    else if (target === "ranking") renderRanking(matches);
  }
}

// Sistema de likes nas análises
function likeReview(matchId, reviewId) {
  const matches = getMatches();
  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) return;

  const match = matches[matchIndex];
  const review = match.reviews.find(r => r.id === reviewId);
  if (!review) return;

  // Evita likes múltiplos usando SessionStorage
  const storageKey = `liked_${matchId}_${reviewId}`;
  if (sessionStorage.getItem(storageKey)) {
    return; // Já curtiu nesta sessão
  }

  review.likes += 1;
  sessionStorage.setItem(storageKey, "true");

  saveMatches(matches);

  // Atualiza apenas a aba do modal
  switchTab("reviews-tab", match);
  
  // Efeito visual de curtido
  setTimeout(() => {
    const btn = document.getElementById(`like-btn-${reviewId}`);
    if (btn) btn.classList.add("liked");
  }, 50);
}
