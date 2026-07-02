// apps/client/src/components/LiveStats.tsx
// Componente de estatísticas ao vivo com gráficos Recharts

import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

interface StatPair { home: number; away: number }

interface LiveStatsData {
  homeTeam: string;
  awayTeam: string;
  possession: StatPair;
  shotsTotal: StatPair;
  shotsOnGoal: StatPair;
  corners: StatPair;
  fouls: StatPair;
  yellowCards: StatPair;
  redCards: StatPair;
  offsides: StatPair;
  passesTotal: StatPair;
  passesAccuracy: StatPair;
  dangerousAttacks: StatPair;
}

interface LiveStatsProps {
  stats: LiveStatsData;
  homeColor?: string;
  awayColor?: string;
}

const NEON_HOME = '#00ff88';
const NEON_AWAY = '#00c3ff';

export const LiveStats: React.FC<LiveStatsProps> = ({
  stats,
  homeColor = NEON_HOME,
  awayColor = NEON_AWAY,
}) => {
  const { homeTeam, awayTeam } = stats;

  // Dados para gráfico de posse (pizza)
  const possessionData = [
    { name: homeTeam, value: stats.possession.home, color: homeColor },
    { name: awayTeam, value: stats.possession.away, color: awayColor },
  ];

  // Dados para radar de desempenho (normalizado 0-100)
  const maxAttacks = Math.max(stats.dangerousAttacks.home, stats.dangerousAttacks.away, 1);
  const maxPasses = Math.max(stats.passesTotal.home, stats.passesTotal.away, 1);
  const maxShots = Math.max(stats.shotsTotal.home, stats.shotsTotal.away, 1);

  const radarData = [
    {
      subject: 'Posse',
      [homeTeam]: stats.possession.home,
      [awayTeam]: stats.possession.away,
    },
    {
      subject: 'Chutes',
      [homeTeam]: Math.round((stats.shotsTotal.home / maxShots) * 100),
      [awayTeam]: Math.round((stats.shotsTotal.away / maxShots) * 100),
    },
    {
      subject: 'Passes',
      [homeTeam]: Math.round((stats.passesTotal.home / maxPasses) * 100),
      [awayTeam]: Math.round((stats.passesTotal.away / maxPasses) * 100),
    },
    {
      subject: 'Ataques',
      [homeTeam]: Math.round((stats.dangerousAttacks.home / maxAttacks) * 100),
      [awayTeam]: Math.round((stats.dangerousAttacks.away / maxAttacks) * 100),
    },
    {
      subject: 'Precisão',
      [homeTeam]: stats.passesAccuracy.home || 0,
      [awayTeam]: stats.passesAccuracy.away || 0,
    },
  ];

  // Dados para barras de chutes
  const shotsData = [
    { stat: 'Total', home: stats.shotsTotal.home, away: stats.shotsTotal.away },
    { stat: 'No gol', home: stats.shotsOnGoal.home, away: stats.shotsOnGoal.away },
    { stat: 'Bloqueados', home: Math.max(0, stats.shotsTotal.home - stats.shotsOnGoal.home), away: Math.max(0, stats.shotsTotal.away - stats.shotsOnGoal.away) },
  ];

  return (
    <div className="live-stats-container">

      {/* ─── Radar de desempenho ─────────────────────────────── */}
      <div className="stats-card">
        <h4 className="stats-title">⚡ Radar de Desempenho</h4>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
            <Radar name={homeTeam} dataKey={homeTeam} stroke={homeColor} fill={homeColor} fillOpacity={0.15} strokeWidth={2} />
            <Radar name={awayTeam} dataKey={awayTeam} stroke={awayColor} fill={awayColor} fillOpacity={0.15} strokeWidth={2} />
            <Tooltip
              contentStyle={{ background: '#0a0a0a', border: `1px solid ${homeColor}33`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="radar-legend">
          <span style={{ color: homeColor }}>● {homeTeam}</span>
          <span style={{ color: awayColor }}>● {awayTeam}</span>
        </div>
      </div>

      {/* ─── Posse de bola ───────────────────────────────────── */}
      <div className="stats-card stats-possession">
        <h4 className="stats-title">⚽ Posse de Bola</h4>
        <div className="possession-row">
          <div className="possession-bar-wrap">
            <span className="team-label left" style={{ color: homeColor }}>{homeTeam}</span>
            <div className="possession-bar">
              <div className="possession-fill home" style={{ width: `${stats.possession.home}%`, background: homeColor }} />
              <div className="possession-fill away" style={{ width: `${stats.possession.away}%`, background: awayColor }} />
            </div>
            <span className="team-label right" style={{ color: awayColor }}>{awayTeam}</span>
          </div>
          <div className="possession-values">
            <span style={{ color: homeColor }}>{stats.possession.home}%</span>
            <span style={{ color: awayColor }}>{stats.possession.away}%</span>
          </div>
        </div>
        <div className="possession-donut">
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={possessionData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" startAngle={90} endAngle={-270}>
                {possessionData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Chutes ──────────────────────────────────────────── */}
      <div className="stats-card">
        <h4 className="stats-title">🎯 Chutes</h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={shotsData} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
            <YAxis type="category" dataKey="stat" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} width={65} />
            <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="home" name={homeTeam} fill={homeColor} fillOpacity={0.8} radius={[0, 4, 4, 0]} />
            <Bar dataKey="away" name={awayTeam} fill={awayColor} fillOpacity={0.8} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Grid de métricas ────────────────────────────────── */}
      <div className="stats-card">
        <h4 className="stats-title">📊 Métricas da Partida</h4>
        <div className="stats-grid">
          {[
            { label: 'Escanteios', home: stats.corners.home, away: stats.corners.away, icon: '📐' },
            { label: 'Faltas', home: stats.fouls.home, away: stats.fouls.away, icon: '⚠️' },
            { label: 'Passes', home: stats.passesTotal.home, away: stats.passesTotal.away, icon: '🔗' },
            { label: 'Ataques', home: stats.dangerousAttacks.home, away: stats.dangerousAttacks.away, icon: '⚡' },
            { label: 'Cartões 🟨', home: stats.yellowCards.home, away: stats.yellowCards.away, icon: '🟨' },
            { label: 'Impedimentos', home: stats.offsides.home, away: stats.offsides.away, icon: '🚩' },
          ].map(row => (
            <div key={row.label} className="stat-row">
              <span className="stat-val home" style={{ color: homeColor }}>{row.home}</span>
              <span className="stat-label">{row.label}</span>
              <span className="stat-val away" style={{ color: awayColor }}>{row.away}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LiveStats;
