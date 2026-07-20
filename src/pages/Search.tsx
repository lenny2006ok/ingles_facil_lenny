import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { Search as SearchIcon, Play, Calendar, AlertCircle, Sparkles } from 'lucide-react';

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      } else {
        const errData = await response.json();
        setError(errData.details || 'Erro ao buscar dados do servidor.');
      }
    } catch (err: any) {
      setError('Não foi possível conectar ao servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      fetchVideos(q);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  return (
    <PageLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>🔍 Buscar Vídeos do YouTube</h1>
        <p style={styles.subtitle}>
          Busque por qualquer termo em inglês para localizar vídeos reais. Escolha um para assistir com laboratório de pronúncia integrado!
        </p>
      </div>

      {/* Formulário de Busca */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputWrapper}>
          <SearchIcon size={20} color="#64748b" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Digite palavras-chave, expressões ou temas em inglês (ex: 'restaurant conversation', 'friends comedy')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Buscar
        </button>
      </form>

      {/* Alertas ou Estados */}
      {loading && (
        <div style={styles.centerBox}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '12px', color: '#64748b', fontWeight: '500' }}>
            Buscando vídeos dinamicamente na API do YouTube...
          </p>
        </div>
      )}

      {error && (
        <div style={styles.errorCard}>
          <AlertCircle size={20} color="#ef4444" />
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {/* Lista de Resultados */}
      {!loading && !error && videos.length > 0 && (
        <div style={styles.resultsGrid}>
          {videos.map((video) => (
            <div key={video.videoId} style={styles.videoCard}>
              <div style={styles.thumbnailWrapper}>
                <img src={video.thumbnail} alt={video.title} style={styles.thumbnail} />
                <Link
                  to={`/watch/${video.videoId}?title=${encodeURIComponent(video.title)}`}
                  style={styles.playOverlay}
                >
                  <div style={styles.playIconCircle}>
                    <Play size={20} fill="#fff" color="#fff" />
                  </div>
                </Link>
              </div>

              <div style={styles.videoDetails}>
                <h3 style={styles.videoTitle}>
                  <Link
                    to={`/watch/${video.videoId}?title=${encodeURIComponent(video.title)}`}
                    style={styles.videoTitleLink}
                  >
                    {video.title}
                  </Link>
                </h3>
                <p style={styles.videoChannel}>{video.channelTitle}</p>
                <p style={styles.videoDesc}>{video.description}</p>
                <div style={styles.videoMeta}>
                  <Calendar size={14} />
                  <span>Publicado em {new Date(video.publishedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado Vazio */}
      {!loading && !error && videos.length === 0 && query && (
        <div style={styles.emptyCard}>
          <Sparkles size={32} color="#64748b" />
          <p style={styles.emptyText}>Nenhum vídeo encontrado. Tente buscar por outros termos como "english grammar", "movie conversation".</p>
        </div>
      )}
    </PageLayout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#475569',
    margin: 0
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '280px'
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    fontSize: '15px',
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '0 28px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
  },
  centerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  errorText: {
    margin: 0,
    fontWeight: '600'
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column'
  },
  thumbnailWrapper: {
    position: 'relative',
    paddingTop: '56.25%', // 16:9 Aspect Ratio
    backgroundColor: '#000',
    overflow: 'hidden'
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    cursor: 'pointer'
  },
  playIconCircle: {
    width: '48px',
    height: '48px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
  },
  videoDetails: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  videoTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0',
    lineHeight: '1.4'
  },
  videoTitleLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  videoChannel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    margin: '0 0 8px 0'
  },
  videoDesc: {
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.5',
    margin: '0 0 16px 0',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flex: 1
  },
  videoMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#94a3b8',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '12px',
    marginTop: 'auto'
  },
  emptyCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  emptyText: {
    marginTop: '12px',
    fontSize: '15px',
    color: '#64748b',
    maxWidth: '400px'
  }
};

// Adiciona estilos de hover por código dinâmico usando truques do React
const addHoverStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .videoCard:hover .playOverlay {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
};
if (typeof window !== 'undefined') addHoverStyles();

export default Search;
