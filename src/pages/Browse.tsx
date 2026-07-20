import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { Film, Briefcase, MessageSquare, Flame, ArrowRight, Play } from 'lucide-react';

interface Series {
  id: string;
  name: string;
  category: string;
}

interface Episode {
  id: string;
  seriesId: string;
  title: string;
}

interface Scene {
  id: string;
  episodeId: string;
  videoId: string;
  title: string;
  startTime: string;
  endTime: string;
}

export const Browse: React.FC = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);

  // Termos de busca de sugestão para cliques rápidos
  const QUICK_SEARCH_TERMS = [
    { label: 'Conversações Diárias', query: 'daily english conversation dialogue' },
    { label: 'Expressões em Filmes', query: 'famous movie scenes with subtitle' },
    { label: 'Inglês para Negócios', query: 'business English vocabulary interview' },
    { label: 'Expressões e Gírias', query: 'American slangs native speakers' },
    { label: 'Pronúncia de Vogais', query: 'english pronunciation training rules' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seriesRes, episodesRes, scenesRes] = await Promise.all([
          fetch('/api/series'),
          fetch('/api/episodes'),
          fetch('/api/scenes')
        ]);

        if (seriesRes.ok && episodesRes.ok && scenesRes.ok) {
          const seriesData = await seriesRes.json();
          const episodesData = await episodesRes.json();
          const scenesData = await scenesRes.json();

          setSeries(seriesData);
          setEpisodes(episodesData);
          setScenes(scenesData);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do catálogo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Everyday English':
        return <MessageSquare size={20} color="#3b82f6" />;
      case 'Business English':
        return <Briefcase size={20} color="#10b981" />;
      case 'Advanced/Legal English':
        return <Film size={20} color="#8b5cf6" />;
      default:
        return <Flame size={20} color="#ef4444" />;
    }
  };

  return (
    <PageLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>🧭 Catálogo de Conteúdo</h1>
        <p style={styles.subtitle}>
          Navegue por tópicos de interesse, assista a cenas de séries famosas estruturadas ou explore termos de busca rápidos.
        </p>
      </div>

      {/* Sugestões de Busca Rápidas */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🔥 Tópicos Recomendados (Busca Rápida)</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
          Selecione uma categoria abaixo para buscar vídeos reais instantaneamente no YouTube:
        </p>
        <div style={styles.tagContainer}>
          {QUICK_SEARCH_TERMS.map((term, index) => (
            <Link
              key={index}
              to={`/search?q=${encodeURIComponent(term.query)}`}
              style={styles.tagLink}
            >
              <span>{term.label}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </section>

      {/* Catálogo de Séries e Cenas de Exemplo */}
      <section style={{ ...styles.section, marginTop: '48px' }}>
        <h2 style={styles.sectionTitle}>🎬 Cenas e Clipes Estruturados</h2>
        {loading ? (
          <p style={styles.loadingText}>Carregando catálogo estruturado...</p>
        ) : (
          <div style={styles.seriesGrid}>
            {series.map((s) => {
              const seriesEpisodes = episodes.filter((e) => e.seriesId === s.id);
              return (
                <div key={s.id} style={styles.seriesCard}>
                  <div style={styles.seriesHeader}>
                    <div style={styles.iconBox}>{getCategoryIcon(s.category)}</div>
                    <div>
                      <h3 style={styles.seriesName}>{s.name}</h3>
                      <span style={styles.seriesCategory}>{s.category}</span>
                    </div>
                  </div>

                  <div style={styles.episodesList}>
                    {seriesEpisodes.length === 0 ? (
                      <p style={styles.emptyText}>Nenhum episódio cadastrado.</p>
                    ) : (
                      seriesEpisodes.map((ep) => {
                        const epScenes = scenes.filter((scene) => scene.episodeId === ep.id);
                        return (
                          <div key={ep.id} style={styles.episodeBox}>
                            <h4 style={styles.episodeTitle}>{ep.title}</h4>
                            <div style={styles.scenesList}>
                              {epScenes.map((scene) => (
                                <Link
                                  key={scene.id}
                                  to={`/watch/${scene.videoId}?title=${encodeURIComponent(scene.title)}`}
                                  style={styles.sceneItem}
                                >
                                  <div style={styles.scenePlayIcon}>
                                    <Play size={12} fill="#fff" color="#fff" />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <p style={styles.sceneTitleText}>{scene.title}</p>
                                    <span style={styles.sceneTime}>
                                      Duração recomendada: {scene.startTime} - {scene.endTime}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 16px 0'
  },
  tagContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  tagLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    border: '1px solid transparent'
  },
  loadingText: {
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px'
  },
  seriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px',
    marginTop: '16px'
  },
  seriesCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0'
  },
  seriesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '14px',
    marginBottom: '16px'
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  seriesName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  seriesCategory: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b'
  },
  episodesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  episodeBox: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #f1f5f9'
  },
  episodeTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155',
    margin: '0 0 8px 0'
  },
  scenesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sceneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'inherit',
    padding: '8px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s'
  },
  scenePlayIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sceneTitleText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0
  },
  sceneTime: {
    fontSize: '11px',
    color: '#64748b'
  },
  emptyText: {
    fontSize: '13px',
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: 0
  }
};
export default Browse;
