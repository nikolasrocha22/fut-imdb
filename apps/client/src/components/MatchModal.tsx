// apps/client/src/components/MatchModal.tsx
import React, { useState, useEffect } from 'react';
import type { Match, TimelineEvent } from '@footrate/shared';
import { Pitch } from './Pitch';

interface MatchModalProps {
  matchId: string;
  onClose: () => void;
  onReviewSubmitted: (updatedMatch: Match) => void;
  apiBaseUrl: string;
}

export const MatchModal: React.FC<MatchModalProps> = ({ matchId, onClose, onReviewSubmitted, apiBaseUrl }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<string>('stats-tab');
  
  // States para Reviews (Jogos finalizados/ao vivo)
  const [rating, setRating] = useState<number>(5.0);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // States para Palpites (Jogos agendados)
  const [predictHomeScore, setPredictHomeScore] = useState<number>(0);
  const [predictAwayScore, setPredictAwayScore] = useState<number>(0);
  const [predictAnalysis, setPredictAnalysis] = useState<string>('');
  const [predictSubmitting, setPredictSubmitting] = useState<boolean>(false);

  // Fallbacks de escudos dos times
  const [homeLogoError, setHomeLogoError] = useState<boolean>(false);
  const [awayLogoError, setAwayLogoError] = useState<boolean>(false);

  // Carrega os detalhes completos da partida da API
  const fetchMatchDetails = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/matches/${matchId}`);
      if (res.ok) {
        const data = await res.json();
        setMatch(data);
        // Se for agendado, a primeira aba deve ser a de palpites da torcida
        if (data.status === 'scheduled') {
          setActiveTab('predictions-tab');
        } else {
          setActiveTab('stats-tab');
        }
      }
    } catch (err) {
      console.error("Erro ao carregar detalhes da partida:", err);
    }
  };

  useEffect(() => {
    fetchMatchDetails();

    // Listener global para ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [matchId]);

  if (!match) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Carregando detalhes do espetáculo...</p>
        </div>
      </div>
    );
  }

  const isScheduled = match.status === 'scheduled';

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/matches/${matchId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, text: reviewText })
      });
      if (res.ok) {
        const updated = await res.json();
        setMatch(updated);
        onReviewSubmitted(updated);
        setReviewText('');
      } else {
        alert('Erro ao enviar avaliação.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao enviar avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePredictionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredictSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/matches/${matchId}/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictHomeScore,
          predictAwayScore,
          analysis: predictAnalysis
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setMatch(updated);
        onReviewSubmitted(updated);
        setPredictAnalysis('');
      } else {
        alert('Erro ao enviar palpite.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao enviar palpite.');
    } finally {
      setPredictSubmitting(false);
    }
  };

  const handleLike = (reviewId: string) => {
    if (likedReviews[reviewId]) return;

    setLikedReviews(prev => ({ ...prev, [reviewId]: true }));
    if (match) {
      const updatedReviews = match.reviews.map(r => 
        r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
      );
      setMatch({ ...match, reviews: updatedReviews });
    }
  };

  const scoreDisplay = isScheduled ? (
    <div className="score-value" style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>{match.time}</div>
  ) : (
    <>
      <div className="score-value">{match.score?.home}</div>
      <div className="score-divider">x</div>
      <div className="score-value">{match.score?.away}</div>
    </>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {/* Header */}
        <div className="match-detail-header">
          <div className="header-league">{match.leagueEmoji} {match.league}</div>
          <div className="header-scoreboard">
            <div className="score-team">
              {match.homeLogoUrl && !homeLogoError ? (
                <img 
                  src={match.homeLogoUrl} 
                  alt="" 
                  className="score-team-logo" 
                  onError={() => setHomeLogoError(true)} 
                />
              ) : (
                <span className="score-team-emoji">{match.homeEmoji}</span>
              )}
              <span className="score-team-name">{match.homeTeam}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {scoreDisplay}
              </div>
              {match.score?.penHome !== undefined && (
                <div className="score-pens">
                  ({match.score.penHome} x {match.score.penAway} nos pênaltis)
                </div>
              )}
            </div>
            <div className="score-team">
              {match.awayLogoUrl && !awayLogoError ? (
                <img 
                  src={match.awayLogoUrl} 
                  alt="" 
                  className="score-team-logo" 
                  onError={() => setAwayLogoError(true)} 
                />
              ) : (
                <span className="score-team-emoji">{match.awayEmoji}</span>
              )}
              <span className="score-team-name">{match.awayTeam}</span>
            </div>
          </div>
          <div className="header-meta">
            <span>Stadium: 🏟️ {match.stadium}</span>
            <span>Date: 📅 {formatDate(match.date)}</span>
            <span>Referee: 🏁 {match.referee}</span>
          </div>

          {!isScheduled ? (
            <div className="header-rating-box">
              <div className="rating-value">
                <div className="rating-large">
                  ⭐ {match.rating > 0 ? match.rating.toFixed(1) : 'N/A'} <span>/10</span>
                </div>
                <div className="rating-count">
                  {match.votes.toLocaleString("pt-BR")} avaliações
                </div>
              </div>
            </div>
          ) : (
            <div className="header-rating-box">
              <span className="rating-count">Partida futura - Dê seu palpite!</span>
            </div>
          )}
        </div>

        {/* Tabs Menu */}
        <div className="detail-tabs">
          {!isScheduled && (
            <button 
              className={`tab-btn ${activeTab === 'stats-tab' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats-tab')}
            >
              Estatísticas
            </button>
          )}
          <button 
            className={`tab-btn ${activeTab === 'lineup-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('lineup-tab')}
          >
            Escalação Tática
          </button>
          <button 
            className={`tab-btn ${activeTab === 'timeline-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline-tab')}
          >
            Cronologia
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analysis-tab' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis-tab')}
          >
            Análise Tática
          </button>
          {isScheduled ? (
            <button 
              className={`tab-btn ${activeTab === 'predictions-tab' ? 'active' : ''}`}
              onClick={() => setActiveTab('predictions-tab')}
            >
              Palpites da Torcida
            </button>
          ) : (
            <button 
              className={`tab-btn ${activeTab === 'reviews-tab' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews-tab')}
            >
              Notas & Resenhas
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'stats-tab' && match.stats && (
            <div className="stats-list">
              {[
                { name: 'Posse de Bola', key: 'possession', suffix: '%' },
                { name: 'Finalizações', key: 'shots', suffix: '' },
                { name: 'Finalizações no Gol', key: 'shotsOnTarget', suffix: '' },
                { name: 'Gols Esperados (xG)', key: 'xG', suffix: '' },
                { name: 'Faltas', key: 'fouls', suffix: '' },
                { name: 'Escanteios', key: 'corners', suffix: '' },
                { name: 'Cartões Amarelos', key: 'yellowCards', suffix: '' },
                { name: 'Cartões Vermelhos', key: 'redCards', suffix: '' }
              ].map(stat => {
                const homeVal = match.stats![stat.key as keyof typeof match.stats][0];
                const awayVal = match.stats![stat.key as keyof typeof match.stats][1];
                const total = homeVal + awayVal;
                const homePct = total > 0 ? (homeVal / total) * 100 : 50;
                const awayPct = total > 0 ? (awayVal / total) * 100 : 50;

                return (
                  <div className="stat-row" key={stat.name}>
                    <div className="stat-info">
                      <span>{homeVal}{stat.suffix}</span>
                      <span className="stat-name">{stat.name}</span>
                      <span>{awayVal}{stat.suffix}</span>
                    </div>
                    <div className="stat-bar-container">
                      <div className="stat-bar-home" style={{ width: `${homePct}%` }}></div>
                      <div className="stat-bar-away" style={{ width: `${awayPct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'lineup-tab' && (
            <Pitch match={match} />
          )}

          {activeTab === 'timeline-tab' && (
            <div className="timeline-wrapper">
              {match.timeline.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">⏳</div>
                  <p>Partida sem eventos marcantes até o momento.</p>
                </div>
              ) : (
                match.timeline.map((event: TimelineEvent, idx: number) => (
                  <div className="timeline-item" key={idx}>
                    <span className="timeline-icon">{event.icon}</span>
                    <div className="timeline-time">{event.minute}'</div>
                    <div className="timeline-detail">
                      <strong>[{event.team === 'home' ? match.homeTeam : match.awayTeam}]</strong> {event.detail}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'analysis-tab' && (
            <div className="tactical-text">
              {match.tacticalAnalysis || 'Análise em andamento...'}
            </div>
          )}

          {activeTab === 'predictions-tab' && (
            <div className="reviews-section">
              {/* Form de Palpite */}
              <div className="user-rating-card">
                <h4 className="rating-card-title">Deixe seu Palpite</h4>
                <form onSubmit={handlePredictionSubmit}>
                  <div className="predict-score-group">
                    <input 
                      type="number" 
                      className="predict-score-input"
                      min="0" 
                      max="99" 
                      value={predictHomeScore} 
                      onChange={(e) => setPredictHomeScore(parseInt(e.target.value) || 0)}
                      required
                    />
                    <span className="predict-score-divider">x</span>
                    <input 
                      type="number" 
                      className="predict-score-input"
                      min="0" 
                      max="99" 
                      value={predictAwayScore} 
                      onChange={(e) => setPredictAwayScore(parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="review-input-group">
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Sua Análise Pré-Jogo (Opcional):
                    </label>
                    <textarea 
                      className="review-textarea"
                      placeholder="Analise o momento dos times, táticas prováveis, escalações esperadas e dê seu palpite..."
                      value={predictAnalysis}
                      onChange={(e) => setPredictAnalysis(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="submit-review-btn" disabled={predictSubmitting} style={{ background: 'var(--accent-secondary)', color: 'white' }}>
                    <span>{predictSubmitting ? 'Enviando...' : 'Enviar Palpite'}</span>
                    <span className="btn-arrow-circle">↗</span>
                  </button>
                </form>

                {/* Agregado da Comunidade */}
                {match.predictionStats && match.predictionStats.totalCount > 0 && (
                  <div className="predict-community-stats">
                    <h5 className="predict-community-title">Palpites da Comunidade ({match.predictionStats.totalCount})</h5>
                    <div className="community-bar">
                      <div 
                        className="community-bar-home" 
                        style={{ width: `${match.predictionStats.homeWinPct}%` }}
                        title={`Vitória do ${match.homeTeam}: ${match.predictionStats.homeWinPct}%`}
                      ></div>
                      <div 
                        className="community-bar-draw" 
                        style={{ width: `${match.predictionStats.drawPct}%` }}
                        title={`Empate: ${match.predictionStats.drawPct}%`}
                      ></div>
                      <div 
                        className="community-bar-away" 
                        style={{ width: `${match.predictionStats.awayWinPct}%` }}
                        title={`Vitória do ${match.awayTeam}: ${match.predictionStats.awayWinPct}%`}
                      ></div>
                    </div>
                    <div className="community-labels">
                      <span>{match.homeTeam}: {match.predictionStats.homeWinPct}%</span>
                      <span>Empate: {match.predictionStats.drawPct}%</span>
                      <span>{match.awayTeam}: {match.predictionStats.awayWinPct}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de Palpites */}
              <div className="reviews-list">
                <h4 className="rating-card-title">Mural de Palpites ({match.predictions?.length || 0})</h4>
                {!match.predictions || match.predictions.length === 0 ? (
                  <div className="empty-state" style={{ padding: '20px' }}>
                    <div className="empty-state-icon">🗳️</div>
                    <p>Ninguém palpitou ainda. Seja o primeiro!</p>
                  </div>
                ) : (
                  match.predictions.map(pred => (
                    <div className="review-item" key={pred.id}>
                      <div className="review-header">
                        <div className="review-user-info">
                          <span className="avatar" style={{ fontSize: '0.8rem', width: '26px', height: '26px' }}>⚽</span>
                          <span className="review-username">@{pred.username || 'usuario_anonimo'}</span>
                          <span className="review-date">{new Date(pred.createdAt || '').toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span className="review-rating-badge" style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                          Palpite: {pred.predictHomeScore} x {pred.predictAwayScore}
                        </span>
                      </div>
                      {pred.analysis && <div className="review-text">{pred.analysis}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews-tab' && (
            <div className="reviews-section">
              {/* Form de avaliação */}
              <div className="user-rating-card">
                <h4 className="rating-card-title">Avalie o Espetáculo</h4>
                <form onSubmit={handleReviewSubmit}>
                  <div className="slider-group">
                    <div className="slider-header">
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Sua Nota (0 a 10):
                      </span>
                      <span className="slider-val-box">{rating.toFixed(1)}</span>
                    </div>
                    <input 
                      type="range" 
                      className="rating-slider"
                      min="0" 
                      max="10" 
                      step="0.1" 
                      value={rating} 
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="review-input-group">
                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Sua Análise Tática Aprofundada:
                    </label>
                    <textarea 
                      className="review-textarea"
                      placeholder="Fale sobre os esquemas, jogadores de destaque, o ritmo e a tática de jogo..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-review-btn" disabled={submitting}>
                    <span>{submitting ? 'Enviando...' : 'Publicar Avaliação'}</span>
                    <span className="btn-arrow-circle">↗</span>
                  </button>
                </form>
              </div>

              {/* Lista de Avaliações */}
              <div className="reviews-list">
                <h4 className="rating-card-title">Resenhas da Torcida ({match.reviews.length})</h4>
                {match.reviews.length === 0 ? (
                  <div className="empty-state" style={{ padding: '20px' }}>
                    <div className="empty-state-icon">💬</div>
                    <p>Seja o primeiro a publicar uma análise!</p>
                  </div>
                ) : (
                  match.reviews.map(rev => (
                    <div className="review-item" key={rev.id}>
                      <div className="review-header">
                        <div className="review-user-info">
                          <span className="avatar" style={{ fontSize: '0.8rem', width: '26px', height: '26px' }}>⚽</span>
                          <span className="review-username">@{rev.username || 'usuario_anonimo'}</span>
                          <span className="review-date">{new Date(rev.createdAt || '').toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span className="review-rating-badge">⭐ {rev.rating.toFixed(1)}</span>
                      </div>
                      <div className="review-text">{rev.text}</div>
                      <div className="review-likes-container">
                        <span>Esta análise foi útil?</span>
                        <button 
                          className={`like-review-btn ${likedReviews[rev.id] ? 'liked' : ''}`}
                          onClick={() => handleLike(rev.id)}
                          disabled={likedReviews[rev.id]}
                        >
                          👍 Sim ({rev.likes})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
