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
      
      const saved = localStorage.getItem(`quiz_completed_${stateData.email}`);
      if (!saved) {
        const completionInfo = {
          email: stateData.email,
          score: stateData.score,
          total: stateData.total,
          completedAt: new Date().toISOString(),
          percentage: Math.round((stateData.score / stateData.total) * 100)
        };
        localStorage.setItem(`quiz_completed_${stateData.email}`, JSON.stringify(completionInfo));
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const handleStartTrail = () => {
    if (completionData) {
      navigate('/trail', { 
        state: { 
          email: completionData.email, 
          score: completionData.score, 
          total: completionData.total 
        } 
      });
    }
  };

  if (!completionData) return null;

  const percentage = Math.round((completionData.score / completionData.total) * 100);

  return (
    <div className="completion-page">
      <Header />
      
      <main className="completion-main">
        <div className="completion-content">
          <h1 className="completion-title">
            Parabéns pela conclusão do quiz<br />
            de nivelamento!
          </h1>

          <p className="completion-subtitle">
            Agora começa a sua jornada<br />
            de aprendizado em<br />
            Segurança da Informação.
          </p>

          <div style={{ marginBottom: '1rem', color: '#1e40af', fontSize: '1.125rem' }}>
            <p>Você acertou <strong>{completionData.score}</strong> de <strong>{completionData.total}</strong> questões ({percentage}%)</p>
          </div>

          <Button 
            variant="yellow" 
            size="lg"
            onClick={handleStartTrail}
            className="completion-button"
          >
            INICIAR TRILHA
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Completion;