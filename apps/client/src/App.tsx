// apps/client/src/App.tsx
import { useState, useEffect } from 'react';
import type { Match } from '@footrate/shared';
import { MatchCard } from './components/MatchCard';
import { MatchModal } from './components/MatchModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MyRanking } from './pages/MyRanking';
import { Standings } from './pages/Standings';

const API_BASE_URL = 'http://localhost:3001';

function UserMenu({ navigate }: { navigate: (tab: string) => void }) {
  const { user, logout } = useAuth();
  
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('me')} className="text-sm font-bold text-primary hover:underline bg-transparent border-none cursor-pointer">
          {user.username}
        </button>
        <button onClick={logout} className="text-sm text-textSecondary hover:text-white bg-transparent border-none cursor-pointer">Sair</button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      <button onClick={() => navigate('login')} className="text-sm font-semibold hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Entrar</button>
      <button onClick={() => navigate('register')} className="text-sm font-bold bg-primary text-background px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors border-none cursor-pointer">Cadastrar</button>
    </div>
  );
}

function MainApp() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home'); // 'home', 'ranking', 'agenda'
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('dark');
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Carrega a lista de partidas via REST
  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/matches`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error("Erro ao conectar com a API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // 2. Conexão Server-Sent Events (SSE) para tempo real
  useEffect(() => {
    const sse = new EventSource(`${API_BASE_URL}/api/matches/live/sse`);

    sse.onmessage = (event) => {
      try {
        const updatedMatch: Match = JSON.parse(event.data);
        // Atualiza a partida na lista global
        setMatches((prevMatches) =>
          prevMatches.map((m) => (m.id === updatedMatch.id ? { ...m, ...updatedMatch } : m))
        );
      } catch (err) {
        console.error("Erro ao processar dados em tempo real (SSE):", err);
      }
    };

    sse.onerror = (err) => {
      console.warn("Conexão SSE caiu ou falhou. Tentando reconectar...", err);
    };

    return () => {
      sse.close();
    };
  }, []);

  // 3. Gerenciamento do Tema Escuro/Claro
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Filtragem e busca local das partidas
  const getFilteredMatches = () => {
    let result = matches;

    // Filtro por campeonato
    if (activeTab === 'home' && leagueFilter !== 'all') {
      result = result.filter(m => m.league === leagueFilter);
    }

    // Busca por termo
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        m.homeTeam.toLowerCase().includes(query) ||
        m.awayTeam.toLowerCase().includes(query) ||
        m.league.toLowerCase().includes(query)
      );
    }

    return result;
  };

  const filteredMatches = getFilteredMatches();
  const liveMatches = filteredMatches.filter(m => m.status === 'live');
  const completedMatches = filteredMatches.filter(m => m.status === 'completed');
  const scheduledMatches = filteredMatches.filter(m => m.status === 'scheduled');

  // Encontra o jogo clássico lendário (nota mais alta) para o Hero
  const getHeroMatch = () => {
    const allCompleted = matches.filter(m => m.status === 'completed');
    if (allCompleted.length === 0) return null;
    return allCompleted.reduce((max, m) => m.rating > max.rating ? m : max, allCompleted[0]);
  };

  const heroMatch = getHeroMatch();
  const leagues = ['all', ...new Set(matches.map(m => m.league))];

  return (
    <div className="app-container">
      {/* Sidebar de Navegação */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            <span className="brand-logo">⚽</span>
            <h1 className="brand-name">Fut<span>Nota</span></h1>
          </div>
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => { setActiveTab('home'); setSearchQuery(''); }}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Início</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'ranking' ? 'active' : ''}`}
              onClick={() => { setActiveTab('ranking'); setSearchQuery(''); }}
            >
              <span className="nav-icon">⭐</span>
              <span className="nav-text">Ranking IMDb</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'standings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('standings'); setSearchQuery(''); }}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Tabelas & Artilheiros</span>
            </button>
          </nav>
        </div>
        <div className="sidebar-footer">
          <p>© 2026 FutNota Inc.</p>
          <small>Design Premium v3</small>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-layout">
        {/* Header */}
        <header className="main-header">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar partidas, times, campeonatos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Alternar Modo Claro/Escuro">
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <UserMenu navigate={setActiveTab} />
          </div>
        </header>

        {/* Dynamic Pages Area */}
        <section className="content-area">
          {loading ? (
            <div className="empty-state">
              <p>Carregando banco de dados...</p>
            </div>
          ) : searchQuery.trim() !== '' ? (
            // Exibição de Resultados da Busca
            <div>
              <h2 className="section-title">Resultados da busca ({filteredMatches.length})</h2>
              {filteredMatches.length === 0 ? (
                <div className="empty-state fade-in-up-anim">
                  <div className="empty-state-icon">🔍</div>
                  <p>Nenhuma partida encontrada para sua busca.</p>
                </div>
              ) : (
                <div className="match-grid">
                  {filteredMatches.map(m => (
                    <MatchCard key={m.id} match={m} onClick={() => setSelectedMatchId(m.id)} />
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'login' ? (
            <Login navigate={setActiveTab} />
          ) : activeTab === 'register' ? (
            <Register navigate={setActiveTab} />
          ) : activeTab === 'me' ? (
            <MyRanking />
          ) : activeTab === 'standings' ? (
            <Standings />
          ) : activeTab === 'home' ? (
            // Página de Início
            <div>
              {/* Filtros por Campeonato */}
              <div className="filters-bar">
                {leagues.map(league => (
                  <button
                    key={league}
                    className={`filter-btn ${leagueFilter === league ? 'active' : ''}`}
                    onClick={() => setLeagueFilter(league)}
                  >
                    {league === 'all' ? 'Todos os Campeonatos' : league}
                  </button>
                ))}
              </div>

              {/* Hero Banner do jogo clássico */}
              {heroMatch && leagueFilter === 'all' && (
                <div className="hero-banner">
                  <div className="hero-tag">🔥 MELHOR AVALIADO</div>
                  <h2 className="hero-title" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {heroMatch.homeLogoUrl ? (
                      <img 
                        src={heroMatch.homeLogoUrl} 
                        alt="" 
                        className="logo-base logo-hero" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline'; }}
                      />
                    ) : null}
                    <span className="team-emoji" style={{ display: heroMatch.homeLogoUrl ? 'none' : 'inline', fontSize: '2rem' }}>{heroMatch.homeEmoji}</span>
                    <span>{heroMatch.homeTeam}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{heroMatch.score?.home}</span>
                    <span style={{ color: 'var(--text-subtle)', fontWeight: 300 }}>x</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{heroMatch.score?.away}</span>
                    <span>{heroMatch.awayTeam}</span>
                    {heroMatch.awayLogoUrl ? (
                      <img 
                        src={heroMatch.awayLogoUrl} 
                        alt="" 
                        className="logo-base logo-hero" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline'; }}
                      />
                    ) : null}
                    <span className="team-emoji" style={{ display: heroMatch.awayLogoUrl ? 'none' : 'inline', fontSize: '2rem' }}>{heroMatch.awayEmoji}</span>
                  </h2>
                  <p className="hero-description">
                    Acompanhe esta incrível partida de {heroMatch.league} avaliada com **⭐ {heroMatch.rating.toFixed(1)}** por nossa comunidade. Veja escalações táteis completas e as análises da torcida.
                  </p>
                  <button className="hero-btn" onClick={() => setSelectedMatchId(heroMatch.id)}>
                    <span>Ver Detalhes do Espetáculo</span>
                    <span className="btn-arrow-circle">↗</span>
                  </button>
                </div>
              )}

              {/* Partidas Ao Vivo */}
              {liveMatches.length > 0 && (
                <div>
                  <h2 className="section-title">
                    Partidas ao Vivo <span className="title-badge">Ao Vivo</span>
                  </h2>
                  <div className="match-grid">
                    {liveMatches.map(m => (
                      <MatchCard key={m.id} match={m} onClick={() => setSelectedMatchId(m.id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Partidas Recentes */}
              {completedMatches.length > 0 && (
                <div>
                  <h2 className="section-title">Partidas Recentes</h2>
                  <div className="match-grid">
                    {completedMatches.map(m => (
                      <MatchCard key={m.id} match={m} onClick={() => setSelectedMatchId(m.id)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'ranking' ? (
            // Tabela de Ranking Geral
            <div className="fade-in-up-anim">
              <h2 className="section-title">Ranking de Partidas FutNota</h2>
              {completedMatches.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">⭐</div>
                  <p>Não há partidas finalizadas no momento.</p>
                </div>
              ) : (
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Partida</th>
                      <th>Campeonato</th>
                      <th>Avaliação Média</th>
                      <th>Votos</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...completedMatches].sort((a,b) => b.rating - a.rating).map((m, idx) => (
                      <tr key={m.id} onClick={() => setSelectedMatchId(m.id)}>
                        <td className={`rank-number ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : ''}`}>
                          #{idx + 1}
                        </td>
                        <td>
                          <div className="match-cell-teams">
                            {m.homeLogoUrl ? (
                              <img 
                                src={m.homeLogoUrl} 
                                alt="" 
                                className="logo-base logo-pitch" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline'; }}
                              />
                            ) : null}
                            <span className="team-emoji" style={{ display: m.homeLogoUrl ? 'none' : 'inline', fontSize: '1.2rem' }}>{m.homeEmoji}</span>
                            <span>{m.homeTeam}</span>
                            <span className="match-cell-score">{m.score?.home} x {m.score?.away}</span>
                            <span>{m.awayTeam}</span>
                            {m.awayLogoUrl ? (
                              <img 
                                src={m.awayLogoUrl} 
                                alt="" 
                                className="logo-base logo-pitch" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline'; }}
                              />
                            ) : null}
                            <span className="team-emoji" style={{ display: m.awayLogoUrl ? 'none' : 'inline', fontSize: '1.2rem' }}>{m.awayEmoji}</span>
                          </div>
                        </td>
                        <td>{m.leagueEmoji} {m.league}</td>
                        <td className="ranking-rating"><strong>⭐ {m.rating.toFixed(1)}</strong>/10</td>
                        <td>{m.votes.toLocaleString("pt-BR")} votos</td>
                        <td>{m.rating >= 9.0 && <span className="badge-spectacle">Obra de Arte</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            // Página de Agenda
            <div>
              <h2 className="section-title">Próximos Grandes Jogos</h2>
              {scheduledMatches.length === 0 ? (
                <div className="empty-state fade-in-up-anim">
                  <div className="empty-state-icon">📅</div>
                  <p>Não há partidas futuras agendadas.</p>
                </div>
              ) : (
                <div className="match-grid">
                  {scheduledMatches.map(m => (
                    <MatchCard key={m.id} match={m} onClick={() => setSelectedMatchId(m.id)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Overlay Modal */}
      {selectedMatchId && (
        <MatchModal 
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
          onReviewSubmitted={(updated) => {
            // Atualiza localmente a lista de jogos para recalcular o ranking instantaneamente
            setMatches(prev => prev.map(m => m.id === updated.id ? updated : m));
          }}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
