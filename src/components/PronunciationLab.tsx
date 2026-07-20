import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, CheckCircle, AlertTriangle, XCircle, Volume2, Save, History } from 'lucide-react';
import { useAuth } from '../features/AuthContext';

// Estendendo o objeto Window para suportar a Web Speech API no TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface PronunciationLabProps {
  phrase?: string;
  onSuccess?: (score: number) => void;
}

export const PronunciationLab: React.FC<PronunciationLabProps> = ({
  phrase = "Hello, welcome to InglesAsFacil!",
  onSuccess
}) => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'excellent' | 'good' | 'poor' | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Buscar histórico do usuário
  const fetchHistory = async () => {
    try {
      const username = user?.username || 'Guest';
      const response = await fetch(`/api/pronunciation-attempts?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.slice(-5).reverse()); // pegar as últimas 5 tentativas
      }
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Função para ouvir a pronúncia correta por voz sintética
  const speakTargetPhrase = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Seu navegador não suporta síntese de voz (Text-to-Speech).');
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const s2 = str2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    
    if (s1 === s2) return 100;
    
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    
    let matches = 0;
    words1.forEach(word => {
      if (words2.includes(word)) {
        matches++;
      }
    });

    const maxWords = Math.max(words1.length, words2.length);
    if (maxWords === 0) return 0;
    
    const baseScore = Math.round((matches / maxWords) * 100);
    return Math.min(100, Math.max(10, baseScore));
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta a Web Speech API. Use o Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setScore(null);
      setFeedback(null);
    };

    recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de fala:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);

      // Calcular Score
      const calculatedScore = calculateSimilarity(phrase, resultText);
      setScore(calculatedScore);

      let currentFeedback: 'excellent' | 'good' | 'poor' = 'poor';
      if (calculatedScore >= 85) {
        currentFeedback = 'excellent';
        if (onSuccess) onSuccess(calculatedScore);
      } else if (calculatedScore >= 50) {
        currentFeedback = 'good';
      }
      setFeedback(currentFeedback);
    };

    recognition.start();
  };

  const saveAttempt = async () => {
    if (score === null) return;
    setSaving(true);
    try {
      const response = await fetch('/api/pronunciation-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user?.username || 'Guest',
          text: phrase,
          transcript: transcript,
          score: score,
          success: score >= 85
        })
      });

      if (response.ok) {
        await fetchHistory();
      }
    } catch (err) {
      console.error('Erro ao salvar tentativa:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎙️ Laboratório de Pronúncia</h3>
      <p style={styles.subtitle}>Escute a frase, aperte o microfone e repita em inglês!</p>

      {/* Frase Alvo */}
      <div style={styles.targetCard}>
        <div style={styles.targetHeader}>
          <span style={styles.badge}>Frase Alvo (Inglês)</span>
          <button onClick={speakTargetPhrase} style={styles.speakButton} title="Ouvir Pronúncia">
            <Volume2 size={18} /> Ouvir
          </button>
        </div>
        <p style={styles.phraseText}>"{phrase}"</p>
      </div>

      {/* Controles de Gravação */}
      <div style={styles.controls}>
        <button
          onClick={isListening ? () => {} : startListening}
          disabled={isListening}
          style={{
            ...styles.micButton,
            backgroundColor: isListening ? '#ef4444' : '#3b82f6',
            transform: isListening ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {isListening ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="#fff" />}
          <span style={{ marginLeft: '8px', color: '#fff', fontWeight: 'bold' }}>
            {isListening ? 'Ouvindo...' : 'Falar Agora'}
          </span>
        </button>

        {transcript && (
          <button
            onClick={() => {
              setTranscript('');
              setScore(null);
              setFeedback(null);
            }}
            style={styles.resetButton}
          >
            <RotateCcw size={16} /> Reiniciar
          </button>
        )}
      </div>

      {/* Resultados e transcrição falada */}
      {transcript && (
        <div style={styles.resultCard}>
          <p style={styles.resultLabel}>Sua fala transcrita:</p>
          <p style={styles.transcriptText}>"{transcript}"</p>

          {score !== null && (
            <div style={styles.scoreContainer}>
              <div style={styles.scoreCircle}>
                <span style={styles.scoreValue}>{score}%</span>
                <span style={styles.scoreLabel}>Precisão</span>
              </div>

              <div style={styles.feedbackContainer}>
                {feedback === 'excellent' && (
                  <div style={{ ...styles.feedbackAlert, backgroundColor: '#d1fae5', color: '#065f46' }}>
                    <CheckCircle size={20} />
                    <span style={{ marginLeft: '8px' }}>Excelente pronúncia! Muito próximo ao nativo.</span>
                  </div>
                )}
                {feedback === 'good' && (
                  <div style={{ ...styles.feedbackAlert, backgroundColor: '#fef3c7', color: '#92400e' }}>
                    <AlertTriangle size={20} />
                    <span style={{ marginLeft: '8px' }}>Boa tentativa! Pratique um pouco mais para a perfeição.</span>
                  </div>
                )}
                {feedback === 'poor' && (
                  <div style={{ ...styles.feedbackAlert, backgroundColor: '#fee2e2', color: '#991b1b' }}>
                    <XCircle size={20} />
                    <span style={{ marginLeft: '8px' }}>Tente pronunciar mais devagar e de forma clara.</span>
                  </div>
                )}

                <button onClick={saveAttempt} disabled={saving} style={styles.saveButton}>
                  <Save size={16} /> {saving ? 'Salvando...' : 'Salvar no meu progresso'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Histórico Recente de Tentativas */}
      {history.length > 0 && (
        <div style={styles.historySection}>
          <h4 style={styles.historyTitle}>
            <History size={16} style={{ marginRight: '6px' }} /> Seu histórico recente:
          </h4>
          <div style={styles.historyList}>
            {history.map((h: any, idx: number) => (
              <div key={idx} style={styles.historyItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={styles.historyPhrase}>"{h.text}"</span>
                  <span
                    style={{
                      ...styles.historyScore,
                      color: h.score >= 85 ? '#10b981' : h.score >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    {h.score}%
                  </span>
                </div>
                <p style={styles.historyTranscript}>Falou: "{h.transcript}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f0f0f0',
    marginTop: '20px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 20px 0'
  },
  targetCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid #3b82f6',
    marginBottom: '20px'
  },
  targetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  badge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  speakButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3b82f6',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px'
  },
  phraseText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    fontStyle: 'italic'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  micButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontWeight: '600',
    padding: '10px 16px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  },
  resultCard: {
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e5e5e5',
    marginBottom: '20px'
  },
  resultLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    margin: '0 0 4px 0'
  },
  transcriptText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#334155',
    margin: '0 0 16px 0',
    fontStyle: 'italic'
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  scoreCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f0fdf4',
    border: '3px solid #10b981'
  },
  scoreValue: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#10b981'
  },
  scoreLabel: {
    fontSize: '10px',
    color: '#047857',
    fontWeight: '600'
  },
  feedbackContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  feedbackAlert: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    alignSelf: 'flex-start'
  },
  historySection: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '16px',
    marginTop: '16px'
  },
  historyTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    margin: '0 0 10px 0'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  historyItem: {
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    padding: '10px',
    fontSize: '13px',
    border: '1px solid #f1f5f9'
  },
  historyPhrase: {
    fontWeight: '500',
    color: '#334155'
  },
  historyScore: {
    fontWeight: '700'
  },
  historyTranscript: {
    margin: '4px 0 0 0',
    fontStyle: 'italic',
    color: '#64748b'
  }
};
