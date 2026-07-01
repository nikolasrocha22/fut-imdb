// apps/client/src/components/Pitch.tsx
import React from 'react';
import type { Match, Player } from '@footrate/shared';

const TEAM_COLORS: Record<string, { bg: string; text: string }> = {
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

function getTeamColor(teamName: string) {
  return TEAM_COLORS[teamName] || { bg: "#10b981", text: "#ffffff" }; // Default Green
}

interface PitchProps {
  match: Match;
}

export const Pitch: React.FC<PitchProps> = ({ match }) => {
  if (!match.lineups) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p>Escalações táticas indisponíveis para esta partida.</p>
      </div>
    );
  }

  const homeColors = getTeamColor(match.homeTeam);
  const awayColors = getTeamColor(match.awayTeam);

  const renderPlayer = (player: Player, colors: { bg: string; text: string }) => {
    return (
      <div
        key={`${player.name}-${player.number}`}
        className="pitch-player"
        style={{
          left: `${player.x}%`,
          top: `${player.y}%`
        }}
        title={`${player.name} (${player.pos})`}
      >
        <div
          className="player-jersey"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: '#ffffff'
          }}
        >
          {player.number}
        </div>
        <div className="player-name">
          {player.name.split(" ")[0]}
        </div>
      </div>
    );
  };

  return (
    <div className="pitch-container">
      <div className="tactical-pitch" style={{ width: '100%' }}>
        {/* Field Markings */}
        <div className="pitch-center-line"></div>
        <div className="pitch-center-circle"></div>
        <div className="pitch-box-top"></div>
        <div className="pitch-box-bottom"></div>

        {/* Home Players */}
        {match.lineups.home.players.map(p => renderPlayer(p, homeColors))}

        {/* Away Players */}
        {match.lineups.away.players.map(p => renderPlayer(p, awayColors))}
      </div>

      <div className="lineup-lists-container">
        {/* Home Team Card */}
        <div className="lineup-team-card">
          <h4 className="lineup-team-title">
            <span>{match.homeEmoji} {match.homeTeam}</span>
            <span>Formação: {match.lineups.home.formation}</span>
          </h4>
          {match.lineups.home.players.map(p => (
            <div key={p.number} className="lineup-player-row">
              <span><strong>{p.number}</strong>. {p.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.pos}</span>
            </div>
          ))}
        </div>

        {/* Away Team Card */}
        <div className="lineup-team-card">
          <h4 className="lineup-team-title" style={{ color: '#3b82f6' }}>
            <span>{match.awayEmoji} {match.awayTeam}</span>
            <span>Formação: {match.lineups.away.formation}</span>
          </h4>
          {match.lineups.away.players.map(p => (
            <div key={p.number} className="lineup-player-row">
              <span><strong>{p.number}</strong>. {p.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.pos}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
