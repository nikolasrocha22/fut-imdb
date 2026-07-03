import { useState, useEffect } from 'react';
import { getApiUrl } from '../config';

const SUPPORTED_LEAGUES = [
  { id: 2013, name: 'Brasileirão', emoji: '🇧🇷' },
  { id: 2000, name: 'Copa do Mundo', emoji: '🌎' },
  { id: 2001, name: 'Champions League', emoji: '🏆' },
  { id: 2021, name: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 2014, name: 'La Liga', emoji: '🇪🇸' },
];

export function Standings() {
  const [leagueId, setLeagueId] = useState<number>(2013);
  const [standings, setStandings] = useState<any>(null);
  const [scorers, setScorers] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [stdRes, scoRes] = await Promise.all([
          fetch(`${getApiUrl()}/competitions/${leagueId}/standings`),
          fetch(`${getApiUrl()}/competitions/${leagueId}/scorers`)
        ]);
        const stdData = await stdRes.json();
        const scoData = await scoRes.json();
        
        setStandings(stdData);
        setScorers(scoData);
      } catch (err) {
        console.error('Erro ao buscar dados do campeonato:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [leagueId]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-primary">Classificação e Estatísticas</h2>
        
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tabela de Classificação */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold border-b border-white/10 pb-2">Tabela de Classificação</h3>
            {standings?.standings?.map((group: any, idx: number) => (
              <div key={idx} className="bg-surface rounded-xl overflow-hidden border border-white/5">
                {group.group && <div className="bg-white/5 p-3 font-bold text-sm">{group.group.replace('_', ' ')}</div>}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-textSecondary text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3 text-center">PTS</th>
                        <th className="px-4 py-3 text-center">J</th>
                        <th className="px-4 py-3 text-center">V</th>
                        <th className="px-4 py-3 text-center">E</th>
                        <th className="px-4 py-3 text-center">D</th>
                        <th className="px-4 py-3 text-center">SG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {group.table?.map((row: any) => (
                        <tr key={row.team.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-bold text-textSecondary">{row.position}</td>
                          <td className="px-4 py-3 flex items-center gap-3">
                            <img src={row.team.crest} alt="crest" className="w-6 h-6 object-contain" />
                            <span className="font-semibold">{row.team.name}</span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-primary">{row.points}</td>
                          <td className="px-4 py-3 text-center">{row.playedGames}</td>
                          <td className="px-4 py-3 text-center text-green-400">{row.won}</td>
                          <td className="px-4 py-3 text-center text-yellow-400">{row.draw}</td>
                          <td className="px-4 py-3 text-center text-red-400">{row.lost}</td>
                          <td className="px-4 py-3 text-center">{row.goalDifference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {(!standings || !standings.standings) && (
              <div className="text-textSecondary">Tabela não disponível para esta competição.</div>
            )}
          </div>

          {/* Artilheiros */}
          <div>
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-6">Artilheiros</h3>
            <div className="bg-surface rounded-xl p-1 border border-white/5">
              {scorers?.scorers?.map((scorer: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-textSecondary w-4">{idx + 1}</div>
                    <img src={scorer.team.crest} alt="crest" className="w-8 h-8 object-contain" />
                    <div>
                      <div className="font-bold text-sm">{scorer.player.name}</div>
                      <div className="text-xs text-textSecondary">{scorer.team.name}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-primary text-lg">{scorer.goals}</span>
                    <span className="text-[10px] text-textSecondary uppercase">Gols</span>
                  </div>
                </div>
              ))}
              {(!scorers || !scorers.scorers || scorers.scorers.length === 0) && (
                <div className="p-4 text-center text-textSecondary">Artilharia não disponível.</div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
