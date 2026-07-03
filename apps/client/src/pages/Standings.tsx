import { useState, useEffect } from 'react';
import { getApiUrl } from '../config';

const SUPPORTED_LEAGUES = [
  { id: 2013, name: 'Brasileirão', emoji: '🇧🇷' },
  { id: 50, name: 'Copa do Mundo', emoji: '🌍' },
  { id: 15, name: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 45, name: 'Champions League', emoji: '🏆' },
  { id: 46, name: 'Europa League', emoji: '🏆' },
  { id: 10, name: 'La Liga', emoji: '🇪🇸' },
];

function getPositionZoneClass(position: number, leagueId: number): string {
  if (leagueId === 15) { // Premier League
    if (position <= 4) return 'zone-cl';
    if (position === 5) return 'zone-el';
    if (position >= 18) return 'zone-relegation';
  } else if (leagueId === 10) { // La Liga
    if (position <= 4) return 'zone-cl';
    if (position === 5 || position === 6) return 'zone-el';
    if (position >= 18) return 'zone-relegation';
  } else if (leagueId === 2013) { // Brasileirão
    if (position <= 4) return 'zone-cl';
    if (position === 5 || position === 6) return 'zone-el'; // G6 pre-libertadores
    if (position >= 17) return 'zone-relegation';
  }
  return '';
}

export function Standings() {
  const [leagueId, setLeagueId] = useState<number>(2013);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${getApiUrl()}/competitions/${leagueId}/standings`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Erro ao buscar dados do campeonato:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [leagueId]);

  const standings = data?.data?.standings || [];
  const leagueInfo = data?.data?.league || {};
  const seasonInfo = data?.data?.season || {};

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Classificação</h2>
          {seasonInfo?.year && (
            <p className="text-textSecondary text-sm mt-1">Temporada {seasonInfo.year}</p>
          )}
        </div>
        
        <select 
          value={leagueId}
          onChange={(e) => setLeagueId(Number(e.target.value))}
          className="bg-surface border border-white/10 text-white rounded-lg px-4 py-2 outline-none"
        >
          {SUPPORTED_LEAGUES.map(l => (
            <option key={l.id} value={l.id}>{l.emoji} {l.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-textSecondary">Carregando dados da competição...</div>
      ) : standings.length > 0 ? (
        <div className="standings-container">
          {leagueInfo?.image && (
            <div className="flex items-center gap-3 p-4 bg-white/5 border-b border-white/5">
              <img src={leagueInfo.image} alt={leagueInfo.name} className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg">{leagueInfo.name}</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="standings-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Time</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>PTS</th>
                  <th style={{ textAlign: 'center', width: '60px' }}>J</th>
                  <th style={{ textAlign: 'center', width: '60px' }}>V</th>
                  <th style={{ textAlign: 'center', width: '60px' }}>E</th>
                  <th style={{ textAlign: 'center', width: '60px' }}>D</th>
                  <th style={{ textAlign: 'center', width: '60px' }}>GP</th>
                  <th style={{ textAlign: 'center', width: '60px' }}>GC</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>SG</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row: any) => (
                  <tr 
                    key={row.team?.team_id || row.position} 
                    className={getPositionZoneClass(row.position, leagueId)}
                  >
                    <td className="font-bold" style={{ paddingLeft: '24px' }}>{row.position}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        {row.team?.team_logo ? (
                          <img src={row.team.team_logo} alt="" className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="w-6 h-6 flex items-center justify-center">⚽</span>
                        )}
                        <span className="font-semibold">{row.team?.team_name || '—'}</span>
                      </div>
                    </td>
                    <td className="text-center pts-col">{row.record?.points ?? 0}</td>
                    <td className="text-center">{row.record?.matches_played ?? 0}</td>
                    <td className="text-center text-green-400">{row.record?.wins ?? 0}</td>
                    <td className="text-center text-yellow-400">{row.record?.draws ?? 0}</td>
                    <td className="text-center text-red-400">{row.record?.losses ?? 0}</td>
                    <td className="text-center">{row.goals?.for ?? 0}</td>
                    <td className="text-center">{row.goals?.against ?? 0}</td>
                    <td className="text-center font-semibold" style={{
                      color: (row.goals?.difference ?? 0) > 0 ? '#10b981' : (row.goals?.difference ?? 0) < 0 ? '#ef4444' : 'inherit'
                    }}>
                      {(row.goals?.difference ?? 0) > 0 ? '+' : ''}{row.goals?.difference ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state fade-in-up-anim">
          <div className="empty-state-icon">📊</div>
          <p>Tabela não disponível para esta competição.</p>
        </div>
      )}
    </div>
  );
}
