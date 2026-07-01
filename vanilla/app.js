// app.js - Arquivo Principal de Controle e Roteamento do FutNota

document.addEventListener("DOMContentLoaded", () => {
  // Inicialização do estado da aplicação
  const matches = getMatches();
  let currentPage = "home";

  // Renderiza a página inicial (Home) por padrão
  renderHome(matches);

  // 1. Configuração do Roteamento do Menu Lateral (Sidebar Navigation)
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      // Remove classe ativa de todos e adiciona no clicado
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      const target = item.getAttribute("data-target");
      currentPage = target;

      // Limpa a barra de busca ao navegar
      document.getElementById("search-input").value = "";

      // Carrega os dados atualizados do localStorage
      const updatedMatches = getMatches();

      if (target === "home") {
        renderHome(updatedMatches);
      } else if (target === "ranking") {
        renderRanking(updatedMatches);
      } else if (target === "agenda") {
        renderAgenda(updatedMatches);
      }
    });
  });

  // 2. Sistema de Busca Global em Tempo Real
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const updatedMatches = getMatches();

    if (query === "") {
      // Se a busca estiver vazia, restaura a página ativa
      if (currentPage === "home") renderHome(updatedMatches);
      else if (currentPage === "ranking") renderRanking(updatedMatches);
      else if (currentPage === "agenda") renderAgenda(updatedMatches);
      return;
    }

    // Filtra partidas por times ou campeonato
    const filtered = updatedMatches.filter(m => 
      m.homeTeam.toLowerCase().includes(query) ||
      m.awayTeam.toLowerCase().includes(query) ||
      m.league.toLowerCase().includes(query)
    );

    renderSearchResults(filtered, query);
  });

  // 3. Gerenciador de Tema Escuro / Claro
  const themeToggle = document.getElementById("theme-toggle");
  
  // Recupera o tema do localStorage ou define escuro como padrão
  const savedTheme = localStorage.getItem("futnota_theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  themeToggle.innerText = savedTheme === "dark" ? "🌙" : "☀️";

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("futnota_theme", newTheme);
    themeToggle.innerText = newTheme === "dark" ? "🌙" : "☀️";
  });

  // 4. Fechamento do Modal Overlay
  const modal = document.getElementById("match-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  closeBtn.addEventListener("click", closeMatchModal);
  
  modal.addEventListener("click", (e) => {
    // Fecha apenas se o clique for no fundo escuro (overlay) e não no conteúdo do modal
    if (e.target === modal) {
      closeMatchModal();
    }
  });

  // Fecha o modal ao pressionar ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeMatchModal();
    }
  });
});

// Fecha o modal restaurando scroll da tela
function closeMatchModal() {
  const modal = document.getElementById("match-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Renderiza Resultados de Busca na tela
function renderSearchResults(filteredMatches, query) {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = "";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.innerText = `Resultados da busca por: "${query}" (${filteredMatches.length})`;
  contentArea.appendChild(title);

  if (filteredMatches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <div class="empty-state-icon">🔍</div>
      <p>Nenhuma partida, time ou campeonato corresponde à sua busca.</p>
    `;
    contentArea.appendChild(empty);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "match-grid";
  
  // Divide entre encerrados/ao vivo e agendados para renderizar corretamente
  filteredMatches.forEach(match => {
    if (match.status === "scheduled") {
      // Adapta card de agendado
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
    } else {
      grid.appendChild(createMatchCard(match));
    }
  });

  contentArea.appendChild(grid);
}
