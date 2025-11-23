import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import './Completion.css';

function Completion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [completionData, setCompletionData] = useState(null);

  useEffect(() => {
    const stateData = location.state;
    
    if (stateData?.email && stateData?.score !== undefined) {
      setCompletionData(stateData);
      console.log('📊 Dados de conclusão:', stateData);
    } else {
      console.log('⚠️ Sem dados de conclusão, redirecionando...');
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const handleStartTrail = () => {
    if (completionData) {
      navigate('/trail', { 
        state: { 
          email: completionData.email,
          fromQuizCompletion: true
        } 
      });
    }
  };

  if (!completionData) return null;

  const getNivelDescription = (nivel) => {
    const descriptions = {
      'AVANÇADO': 'Você demonstrou domínio técnico sólido! 🎯',
      'INTERMEDIÁRIO': 'Você possui conhecimento funcional consistente! 📚',
      'INICIANTE': 'Continue estudando, você está no caminho certo! 🌱'
    };
    return descriptions[nivel] || '';
  };

  return (
    <div className="completion-page">
      <Header />
      
      <main className="completion-main">
        <div className="completion-content">
          <h1 className="completion-title">
            Parabéns pela conclusão do quiz<br />
            de nivelamento!
          </h1>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            padding: '2rem', 
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ 
              color: '#1e40af', 
              fontSize: '1.5rem', 
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              📊 Seu Resultado
            </h2>

            <div style={{ color: '#1e40af', fontSize: '1.125rem', lineHeight: '1.8' }}>
              <p><strong>Perguntas respondidas:</strong> {completionData.total}</p>
              <p><strong>Acertos:</strong> {completionData.score} ({completionData.percentual || Math.round((completionData.score / completionData.total) * 100)}%)</p>
              <p><strong>Pontuação final:</strong> {completionData.pontuacao} pontos</p>
              <p><strong>Nível classificado:</strong> <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700',
                color: completionData.nivel === 'AVANÇADO' ? '#059669' : 
                       completionData.nivel === 'INTERMEDIÁRIO' ? '#2563eb' : '#dc2626'
              }}>{completionData.nivel}</span></p>
              
              <p style={{ 
                marginTop: '1rem', 
                fontStyle: 'italic',
                color: '#4a5568'
              }}>
                {getNivelDescription(completionData.nivel)}
              </p>
            </div>
          </div>

          <p className="completion-subtitle">
            Agora começa a sua jornada<br />
            de aprendizado personalizado em<br />
            Segurança da Informação.
          </p>

          <Button 
            variant="yellow" 
            size="lg"
            onClick={handleStartTrail}
            className="completion-button"
          >
            INICIAR TRILHA DE APRENDIZADO
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Completion;