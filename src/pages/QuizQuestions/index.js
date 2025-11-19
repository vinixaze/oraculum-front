import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import HintModal from '../../components/HintModal';
import api from '../../services/api';
import './QuizQuestions.css';

let questionsData;
try {
  questionsData = require('../../data/questions.json');
} catch (error) {
  questionsData = { questions: [] };
}

function QuizQuestions() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const questions = questionsData.questions;
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    const initQuiz = async () => {
      try {
        console.log('Iniciando quiz...');
        await api.startQuiz(email, 'MEDIO');
        setSessionStarted(true);
        console.log('Quiz iniciado');
      } catch (error) {
        console.error('Erro ao iniciar quiz:', error);
      }
    };

    initQuiz();
  }, [email, navigate]);

  const handleSelectAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    
    const dificuldade = question.id <= 5 ? 'INICIANTE' : 'EXPERT';

    try {
      console.log('Enviando resposta...');
      const response = await api.submitAnswer(
        email,
        question.id,
        isCorrect,
        dificuldade
      );
      console.log('Resposta processada:', response);

      if (isLastQuestion) {
        console.log('Finalizando quiz...');
        const { relatorio } = await api.submitQuiz(email);
        console.log('Quiz finalizado:', relatorio);

        navigate('/completion', { 
          state: { 
            email, 
            score: relatorio.acertos,
            total: relatorio.totalPerguntas,
            nivel: relatorio.nivelFinal,
            pontuacao: relatorio.pontuacaoFinal
          },
          replace: true
        });
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error('Erro ao processar resposta:', error);
      alert('Erro ao processar resposta. Tente novamente.');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  if (!email || !sessionStarted) return (
    <div className="quiz-questions-page">
      <Header />
      <main className="quiz-questions-container">
        <div className="quiz-header">
          <h1 className="quiz-header-title">Carregando quiz...</h1>
        </div>
      </main>
    </div>
  );

  return (
    <div className="quiz-questions-page">
      <Header />
      
      <main className="quiz-questions-container">
        <div className="quiz-header">
          <h1 className="quiz-header-title">
            Quiz de nivelamento em cibersegurança
          </h1>
          <p className="quiz-header-subtitle">
            As perguntas a seguir vão lhe guiar para os conteúdos relacionados ao seu nível de conhecimento.
          </p>
        </div>

        <div className="quiz-card">
          <div className="question-header">
            <h2 className="question-title">Pergunta sobre o tema</h2>
            <span className="question-counter">{currentQuestion + 1}?</span>
            <button 
              className="hint-button-header" 
              onClick={() => setShowHint(true)}
            >
              <span className="hint-icon">💡</span>
              <span>Dica</span>
            </button>
          </div>

          <p className="question-text">{question.question}</p>

          <div className="options-list">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-item ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(index)}
              >
                <span className="option-radio"></span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          <div className="quiz-navigation">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>

            <Button
              variant="yellow"
              onClick={handleNext}
              disabled={selectedAnswer === null}
            >
              {isLastQuestion ? 'Finalizar' : 'Próximo'}
            </Button>
          </div>
        </div>

        {showHint && (
          <HintModal
            hint={question.hint}
            onClose={() => setShowHint(false)}
          />
        )}
      </main>
    </div>
  );
}

export default QuizQuestions;