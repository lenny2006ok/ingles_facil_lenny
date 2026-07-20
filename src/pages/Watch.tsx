import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { PronunciationLab } from '../components/PronunciationLab';
import { BookOpen, Languages } from 'lucide-react';

interface Vocabulary {
  word: string;
  meaning: string;
  example: string;
}

export const Watch: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const videoTitle = searchParams.get('title') || 'Vídeo de Prática de Inglês';

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedPhrase, setSelectedPhrase] = useState('Excuse me, do you have a moment?');

  // Frases sugeridas fictícias para praticar com base no tema do vídeo
  const SUGGESTED_PHRASES = [
    { text: 'How is it going?', translation: 'Como vão as coisas?' },
    { text: 'Could you repeat that, please?', translation: 'Você poderia repetir isso, por favor?' },
    { text: 'Excuse me, do you have a moment?', translation: 'Com licença, você tem um momento?' },
    { text: 'I am looking forward to working with you.', translation: 'Estou ansioso para trabalhar com você.' },
    { text: 'That sounds like a great plan!', translation: 'Isso parece ser um ótimo plano!' }
  ];

  useEffect(() => {
    // Buscar vocabulários sugeridos do backend
    const fetchVocab = async () => {
      try {
        const response = await fetch('/api/vocabulary');
        if (response.ok) {
          const data = await response.json();
          setVocabulary(data);
        }
      } catch (err) {
        console.error('Erro ao carregar vocabulário:', err);
      }
    };
    fetchVocab();
  }, []);

  return (
    <PageLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>{videoTitle}</h1>
        <p style={styles.subtitle}>
          Assista ao clipe nativo do YouTube, estude o vocabulário recomendado e selecione frases para praticar a pronúncia.
        </p>
      </div>

      <div style={styles.contentGrid}>
        {/* Lado Esquerdo: Player do YouTube e Painel de Estudo */}
        <div style={styles.leftColumn}>
          {/* Iframe responsivo do YouTube */}
          <div style={styles.videoContainer}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={styles.iframe}
            ></iframe>
          </div>

          {/* Dicas e Selecionador de Frases */}
          <div style={styles.phrasesSection}>
            <h3 style={styles.sectionTitle}>
              <Languages size={18} style={{ marginRight: '6px' }} /> Selecione uma frase para praticar:
            </h3>
            <p style={styles.sectionDesc}>
              Clique em qualquer uma das expressões sugeridas do clipe para enviá-la diretamente ao Laboratório de Pronúncia:
            </p>

            <div style={styles.phrasesList}>
              {SUGGESTED_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhrase(phrase.text)}
                  style={{
                    ...styles.phraseButton,
                    borderLeft: selectedPhrase === phrase.text ? '4px solid #3b82f6' : '4px solid #e2e8f0',
                    backgroundColor: selectedPhrase === phrase.text ? '#eff6ff' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={styles.phraseText}>{phrase.text}</span>
                    <span style={styles.phraseTranslation}>{phrase.translation}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito: Laboratório de Pronúncia e Vocabulário de apoio */}
        <div style={styles.rightColumn}>
          {/* Laboratório de Pronúncia */}
          <PronunciationLab phrase={selectedPhrase} />

          {/* Vocabulário Recomendado */}
          <div style={styles.vocabContainer}>
            <h3 style={styles.vocabTitle}>
              <BookOpen size={18} style={{ marginRight: '6px' }} /> Vocabulário de Apoio
            </h3>
            <p style={styles.vocabDesc}>Palavras-chave recomendadas para enriquecer o seu vocabulário neste tema:</p>

            <div style={styles.vocabList}>
              {vocabulary.map((vocab, idx) => (
                <div key={idx} style={styles.vocabCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.vocabWord}>{vocab.word}</span>
                    <span style={styles.vocabMeaning}>{vocab.meaning}</span>
                  </div>
                  <p style={styles.vocabExample}>
                    <strong>Exemplo:</strong> "{vocab.example}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0',
    lineHeight: '1.3'
  },
  subtitle: {
    fontSize: '15px',
    color: '#475569',
    margin: 0
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '30px',
    alignItems: 'start'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  videoContainer: {
    position: 'relative',
    paddingTop: '56.25%', // 16:9
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    backgroundColor: '#000'
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  phrasesSection: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  sectionDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 16px 0'
  },
  phrasesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  phraseButton: {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #f1f5f9',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  phraseText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a'
  },
  phraseTranslation: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px'
  },
  vocabContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0'
  },
  vocabTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  vocabDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 16px 0'
  },
  vocabList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  vocabCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #f1f5f9'
  },
  vocabWord: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3b82f6'
  },
  vocabMeaning: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#e2e8f0',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  vocabExample: {
    fontSize: '12px',
    color: '#64748b',
    margin: '8px 0 0 0',
    fontStyle: 'italic'
  }
};
export default Watch;
