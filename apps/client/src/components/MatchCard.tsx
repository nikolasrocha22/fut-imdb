// apps/client/src/components/MatchCard.tsx
import React from 'react';
import type { Match } from '@footrate/shared';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';
  
  // No simulador virtual enviamos o "minute" atualizado
  const statusText = isLive 
    ? `${(match as any).minute || 74}'` 
    : isScheduled 
      ? match.time 
      : 'Encerrado';

  const ratingText = match.rating > 0 ? `⭐ ${match.rating.toFixed(1)}` : 'Sem nota';

  return (
    <div className="match-card" onClick={onClick}>
      <div className="card-header">
        <span className="card-league">{match.leagueEmoji} {match.league}</span>
        <span className={`card-status ${isLive ? 'live' : ''}`}>{statusText}</span>
      </div>
      
      <div className="card-teams">
        <div className="team-row">
          <div className="team-info">
            <span className="team-emoji">{match.homeEmoji}</span>
            <span className="team-name">{match.homeTeam}</span>
          </div>
          <span className="team-score">{!isScheduled ? match.score?.home : '-'}</span>
        </div>
        <div className="team-row">
          <div className="team-info">
            <span className="team-emoji">{match.awayEmoji}</span>
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
      </div>
    </div>
  );
};
