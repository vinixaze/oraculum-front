import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import './Quiz.css';

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  const startQuiz = () => {
    // TODO: Navegar para página do quiz
    console.log('Quiz iniciado para:', email);
  };

  const viewSummary = () => {
    navigate('/summary', { state: { email } });
  };

  if (!email) return null;

  return (
    <div className="quiz-page">
      <Header />
      
      <main className="quiz-main">
        <div className="quiz-content">
          <h1 className="quiz-title">
            Bem-vindo(a) ao Quiz de<br />
            Nivelamento em Cibersegurança!
          </h1>
          
          <div className="quiz-description">
            <p>
              Este é o primeiro passo dentro da plataforma. O objetivo aqui é avaliar seu 
              conhecimento em cibersegurança na nuvem, a partir disso, direcionar você para 
              uma trilha de aprendizado mais adequada ao seu perfil.
            </p>
            
            <p>
              Durante o quiz, você encontrará perguntas simples e objetivas sobre boas 
              práticas digitais, conceitos básicos e situações do dia a dia.
            </p>
          </div>

          <div className="quiz-cards">
            <div className="quiz-card">
              <h3 className="quiz-card-title">
                Realizar Quiz de<br />Nivelamento
              </h3>
              <Button 
                variant="yellow" 
                size="lg"
                onClick={startQuiz}
                className="quiz-card-button"
              >
                INICIAR QUIZ
              </Button>
            </div>

            <div className="quiz-card">
              <h3 className="quiz-card-title">
                Resumo básico sobre<br />cibersegurança em<br />nuvem
              </h3>
              <Button 
                variant="yellow" 
                size="lg"
                onClick={viewSummary}
                className="quiz-card-button"
              >
                ENTRAR
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Quiz;