import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import VideoPlayer from '../../components/VideoPlayer';
import './Summary.css';

function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  const goBack = () => {
    navigate('/quiz', { state: { email } });
  };

  return (
    <div className="summary-page">
      <Header />
      
      <main className="summary-container">
        <div className="summary-grid">
          <div className="summary-left">
            <h1 className="summary-title">
              Resumo sobre<br />
              Segurança em Nuvem
            </h1>

            <div className="video-container">
              <div className="video-wrapper">
                <VideoPlayer 
                    videoId="7EfcDCFekCc"  
                    title="Resumo sobre Segurança em Nuvem"
                />
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={goBack}
              className="back-button"
            >
              Retornar
            </Button>
          </div>

          <div className="summary-right">
            <div className="info-box">
              <p className="info-text">
                Se você nunca ouviu falar em segurança em nuvem, não tem problema!
              </p>
              <p className="info-text" style={{ marginTop: '0.75rem' }}>
                Este vídeo foi feito para explicar de forma simples o que é a nuvem, 
                por que precisamos protegê-la e como funciona essa proteção.
              </p>
            </div>

            <div className="content-section">
              <p className="section-text">
                Durante o quiz, você encontrará perguntas simples e objetivas sobre 
                boas práticas digitais, conceitos básicos e situações do dia a dia.
              </p>
              <p className="section-text">
                Não se preocupe se não souber todas as respostas - o objetivo é 
                aprender e melhorar continuamente!
              </p>
            </div>

            <div className="highlight-box">
              <h3 className="highlight-title">
                Assista ao resumo para entender o básico antes de responder ao quiz.
              </h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Summary;