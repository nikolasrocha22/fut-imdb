import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../config';
import { MatchCard } from '../components/MatchCard';

export function MyRanking() {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/auth/me/ranking`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Erro ao buscar ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReviews();
  }, [token]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Deseja realmente excluir esta avaliação?')) return;
    try {
      await fetch(`${getApiUrl()}/auth/me/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchReviews();
    } catch (err) {
      alert('Erro ao excluir avaliação.');
    }
  };

  if (!user) {
    return <div className="text-center mt-12">Você precisa estar logado para ver seu ranking.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8 text-primary">Meu Ranking Pessoal</h2>
      
      {loading ? (
        <div className="text-center text-textSecondary">Carregando...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-textSecondary">Você ainda não avaliou nenhuma partida.</div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-surface border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-6">
              <div className="flex-1 pointer-events-none">
                <MatchCard match={review.match} hidePrediction />
              </div>
              
              <div className="flex-1 bg-background/50 rounded-lg p-4 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-primary">Sua Avaliação</h4>
                  <div className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">
                    Nota: {review.rating.toFixed(1)}
                  </div>
                </div>
                
                <p className="text-textSecondary italic mb-4">
                  "{review.text}"
                </p>
                
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="text-red-400 hover:text-red-300 text-sm underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
