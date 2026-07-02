// apps/client/src/components/AiPanel.tsx
// Painel de análise de IA — pré-jogo, ao vivo e pós-jogo

import React, { useState, useEffect, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AiPanelProps {
  matchId: string;
  matchStatus: 'scheduled' | 'live' | 'completed';
  liveMinute?: number | null;
}

interface AiAnalysisResponse {
  matchId: string;
  type: string;
  content: string;
  liveCommentary: string | null;
  liveMinute: number | null;
  aiEnabled: boolean;
  allAnalyses: Array<{ type: string; minute: number; content: string; createdAt: string }>;
}

export const AiPanel: React.FC<AiPanelProps> = ({ matchId, matchStatus, liveMinute }) => {
  const [analysis, setAnalysis] = useState<AiAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterRef = useRef<any>(null);
  const lastContentRef = useRef('');

  // Busca análise ao carregar ou quando o minuto avança 5 posições
  useEffect(() => {
    fetchAnalysis();
  }, [matchId]);

  // Recarrega a cada 5 minutos durante jogos ao vivo
  useEffect(() => {
    if (matchStatus !== 'live') return;
    const interval = setInterval(fetchAnalysis, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [matchStatus, matchId]);

  async function fetchAnalysis() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/matches/${matchId}/ai-analysis`);
      if (!res.ok) throw new Error('Falha ao buscar análise');
      const data: AiAnalysisResponse = await res.json();
      setAnalysis(data);

      // Decide qual texto mostrar
      const textToShow = data.liveCommentary || data.content || '';

      // Só dispara o typewriter se o texto for novo
      if (textToShow && textToShow !== lastContentRef.current) {
        lastContentRef.current = textToShow;
        startTypewriter(textToShow);
      } else if (textToShow && !displayedText) {
        setDisplayedText(textToShow);
      }
    } catch (err) {
      console.error('[AiPanel] Erro:', err);
    } finally {
      setLoading(false);
    }
  }

  function startTypewriter(text: string) {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    typewriterRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(typewriterRef.current!);
        setIsTyping(false);
      }
    }, 12); // ~83 chars/segundo
  }

  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, []);

  const getStatusLabel = () => {
    if (!analysis) return '';
    switch (analysis.type) {
      case 'pre_match': return 'Análise pré-jogo';
      case 'live': return `Comentário do minuto ${analysis.liveMinute || liveMinute}'`;
      case 'post_match': return 'Análise pós-jogo';
      default: return 'Análise IA';
    }
  };

  const getStatusIcon = () => {
    switch (matchStatus) {
      case 'live': return '🔴';
      case 'completed': return '📋';
      default: return '🎯';
    }
  };

  return (
    <div className="ai-panel">
      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-badge">
          <span className="ai-icon">🤖</span>
          <span className="ai-label">Análise Gemini AI</span>
          {matchStatus === 'live' && (
            <span className="live-pulse-small">● AO VIVO</span>
          )}
        </div>
        <div className="ai-status-label">
          {getStatusIcon()} {getStatusLabel()}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="ai-panel-content">
        {loading && !displayedText ? (
          <div className="ai-loading">
            <div className="ai-thinking-dots">
              <span />
              <span />
              <span />
            </div>
            <p>IA analisando a partida...</p>
          </div>
        ) : analysis && !analysis.aiEnabled ? (
          <div className="ai-disabled-notice">
            <span className="ai-disabled-icon">⚙️</span>
            <p>
              Análise de IA não configurada.<br />
              <span>Para ativar, adicione <code>GEMINI_API_KEY</code> no <code>.env</code> do servidor.</span>
            </p>
            {/* Mostra análise manual do seed como fallback */}
            {displayedText && (
              <div className="ai-fallback-text">
                <p>{displayedText}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="ai-text-container">
            <p className="ai-text">
              {displayedText}
              {isTyping && <span className="cursor-blink">|</span>}
            </p>
          </div>
        )}
      </div>

      {/* Timeline de análises ao vivo */}
      {analysis && analysis.allAnalyses.length > 1 && matchStatus === 'live' && (
        <div className="ai-timeline">
          <h5>Análises anteriores</h5>
          {analysis.allAnalyses
            .filter(a => a.type === 'live')
            .slice(1, 4)
            .map((a, i) => (
              <div key={i} className="ai-timeline-item">
                <span className="ai-timeline-minute">Min {a.minute}'</span>
                <p className="ai-timeline-text">{a.content.slice(0, 100)}...</p>
              </div>
            ))
          }
        </div>
      )}

      {/* Footer com botão de atualizar */}
      <div className="ai-panel-footer">
        <button
          className="ai-refresh-btn"
          onClick={fetchAnalysis}
          disabled={loading}
        >
          {loading ? '⏳ Analisando...' : '🔄 Atualizar análise'}
        </button>
        <span className="ai-powered-by">Powered by Google Gemini 1.5 Flash</span>
      </div>
    </div>
  );
};

export default AiPanel;
