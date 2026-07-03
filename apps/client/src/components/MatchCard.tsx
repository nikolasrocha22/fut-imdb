// apps/client/src/components/MatchCard.tsx
import React, { useState } from 'react';
import type { Match } from '@footrate/shared';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  hidePrediction?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onClick, hidePrediction }) => {
  const [homeLogoError, setHomeLogoError] = useState(false);
  const [awayLogoError, setAwayLogoError] = useState(false);

  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';
  
  const statusText = isLive 
    ? `${(match as any).minute || 74}'` 
    : isScheduled 
      ? match.time 
      : 'Encerrado';

  const ratingText = match.rating > 0 ? `⭐ ${match.rating.toFixed(1)}` : 'Sem nota';

  const renderHomeLogo = () => {
    if (match.homeLogoUrl && !homeLogoError) {
      return (
        <img 
          src={match.homeLogoUrl} 
          alt={match.homeTeam} 
          className="logo-base logo-card" 
          onError={() => setHomeLogoError(true)}
        />
      );
    }
    return <span className="team-emoji">{match.homeEmoji}</span>;
  };

  const renderAwayLogo = () => {
    if (match.awayLogoUrl && !awayLogoError) {
      return (
        <img 
          src={match.awayLogoUrl} 
          alt={match.awayTeam} 
          className="logo-base logo-card" 
          onError={() => setAwayLogoError(true)}
        />
      );
    }
    return <span className="team-emoji">{match.awayEmoji}</span>;
  };

  return (
    <div className="match-card fade-in-up-anim" onClick={onClick}>
      <div className="double-bezel-outer">
        <div className="double-bezel-inner">
          <div className="card-header">
            <span className="card-league">{match.leagueEmoji} {match.league}</span>
            <span className={`card-status ${isLive ? 'live' : ''}`}>{statusText}</span>
          </div>
          
          <div className="card-teams">
            <div className="team-row">
              <div className="team-info">
                {renderHomeLogo()}
                <span className="team-name">{match.homeTeam}</span>
              </div>
              <span className="team-score">{!isScheduled ? match.score?.home : '-'}</span>
            </div>
            <div className="team-row">
              <div className="team-info">
                {renderAwayLogo()}
                <span className="team-name">{match.awayTeam}</span>
              </div>
              <span className="team-score">{!isScheduled ? match.score?.away : '-'}</span>
            </div>
          </div>

          <div className="card-footer">
            <span className="match-venue">📍 {match.stadium.split(',')[0]}</span>
            {!isScheduled && (
              <span className={`rating-badge ${match.rating === 0 ? 'no-rating' : ''}`}>
                {ratingText}
              </span>
            )}
            {isScheduled && match.predictionStats && match.predictionStats.totalCount > 0 && !hidePrediction && (
              <span className="rating-badge" style={{ color: 'var(--accent-secondary)', borderColor: 'rgba(59, 130, 246, 0.25)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%)' }}>
                🗳️ {match.predictionStats.totalCount} palpites
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
