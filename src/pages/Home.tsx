import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { PlayCircle, Compass, Search } from 'lucide-react';
import { PronunciationLab } from '../components/PronunciationLab';

export const Home: React.FC = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroTag}>💡 Aprenda Inglês de Verdade</span>
          <h1 style={styles.heroTitle}>
            Destrave seu inglês com <span style={{ color: '#3b82f6' }}>filmes, séries</span> e vídeos autênticos
          </h1>
          <p style={styles.heroSubtitle}>
            Pratique sua escuta com clipes reais e valide sua pronúncia de forma instantânea usando nossa ferramenta de reconhecimento de fala integrada.
          </p>
          <div style={styles.ctaGroup}>
            <Link to="/browse" style={styles.ctaPrimary}>
              <Compass size={20} /> Explorar Catálogo
            </Link>
            <Link to="/search" style={styles.ctaSecondary}>
              <Search size={20} /> Buscar Vídeos no YouTube
            </Link>
          </div>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.videoPlaceholder}>
            <PlayCircle size={64} color="#3b82f6" />
            <p style={{ marginTop: '12px', fontWeight: 'bold', color: '#1e293b' }}>
              Aprenda com Cenas Reais do YouTube
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Como funciona o InglesAsFácil?</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={{ ...styles.cardIconBox, backgroundColor: '#eff6ff' }}>
              <Compass size={24} color="#3b82f6" />
            </div>
            <h3 style={styles.cardTitle}>1. Escolha o Conteúdo</h3>
            <p style={styles.cardText}>
              Navegue pelo nosso catálogo ou faça uma busca por qualquer termo que queira aprender em inglês diretamente do YouTube.
            </p>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.cardIconBox, backgroundColor: '#f0fdf4' }}>
              <PlayCircle size={24} color="#10b981" />
            </div>
            <h3 style={styles.cardTitle}>2. Assista e Compreenda</h3>
            <p style={styles.cardText}>
              Assista ao vídeo nativo do YouTube, acompanhe o vocabulário-chave e as expressões sugeridas por nossa plataforma.
            </p>
          </div>

          <div style={styles.card}>
            <div style={{ ...styles.cardIconBox, backgroundColor: '#faf5ff' }}>
              <PlayCircle size={24} color="#a855f7" />
            </div>
            <h3 style={styles.cardTitle}>3. Pratique a Pronúncia</h3>
            <p style={styles.cardText}>
              Fale as frases do clipe no nosso Laboratório de Pronúncia inteligente e obtenha um feedback instantâneo de precisão de fala.
            </p>
          </div>
        </div>
      </section>

      {/* Demo laboratório de pronúncia direto na Home */}
      <section style={{ ...styles.section, marginTop: '60px' }}>
        <div style={styles.demoBox}>
          <div style={{ flex: 1 }}>
            <h2 style={styles.demoTitle}>Pratique agora mesmo!</h2>
            <p style={styles.demoSubtitle}>
              Não precisa de cadastro para testar. Experimente pronunciar a frase em inglês abaixo e veja a pontuação de precisão da sua voz.
            </p>
          </div>
        </div>
        <PronunciationLab phrase="The best way to predict the future is to create it." />
      </section>
    </PageLayout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  hero: {
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
    padding: '40px 0',
    flexWrap: 'wrap'
  },
  heroContent: {
    flex: '1 1 500px'
  },
  heroTag: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    padding: '6px 12px',
    borderRadius: '100px',
    display: 'inline-block',
    marginBottom: '16px'
  },
  heroTitle: {
    fontSize: '44px',
    lineHeight: '1.2',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 16px 0',
    letterSpacing: '-1px'
  },
  heroSubtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#475569',
    margin: '0 0 32px 0'
  },
  ctaGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  ctaPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '700',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
    fontSize: '15px'
  },
  ctaSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    color: '#475569',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '700',
    textDecoration: 'none',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    fontSize: '15px'
  },
  heroCard: {
    flex: '1 1 400px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)'
  },
  videoPlaceholder: {
    height: '280px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  section: {
    marginTop: '80px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
  },
  cardIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 10px 0'
  },
  cardText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#475569',
    margin: 0
  },
  demoBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px'
  },
  demoTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 6px 0'
  },
  demoSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0
  }
};
export default Home;
