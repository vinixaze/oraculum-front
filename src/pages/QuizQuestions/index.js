import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import HintModal from '../../components/HintModal';
import './QuizQuestions.css';

let questionsData;
try {
  questionsData = require('../../data/questions.json');
} catch (error) {
  questionsData = {
    questions: [
      {
        id: 1,
        question: "O que é computação em nuvem?",
        options: [
          "Armazenamento de dados apenas no computador local",
          "Acesso a recursos de computação pela internet",
          "Um tipo de backup físico",
          "Uma rede social"
        ],
        correctAnswer: 1,
        hint: "Pense em acessar arquivos de qualquer lugar pela internet."
      }
    ]
  };
}

function QuizQuestions() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const questions = questionsData.questions;
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    const completed = localStorage.getItem(`quiz_completed_${email}`);
    if (completed) {
      const data = JSON.parse(completed);
      navigate('/completion', { 
        state: { email, score: data.score, total: data.total } 
      });
      return;
    }

    const savedProgress = localStorage.getItem(`quiz_progress_${email}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentQuestion(progress.currentQuestion);
      setScore(progress.score);
      setUserAnswers(progress.userAnswers || []);
    }
  }, [email, navigate]);

  const handleSelectAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    let newScore = score;
    if (selectedAnswer === question.correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (isLastQuestion) {
      const completionData = {
        email,
        score: newScore,
        total: questions.length,
        completedAt: new Date().toISOString(),
        percentage: Math.round((newScore / questions.length) * 100)
      };
      
      localStorage.setItem(`quiz_completed_${email}`, JSON.stringify(completionData));
      localStorage.removeItem(`quiz_progress_${email}`);

      navigate('/completion', { 
        state: { 
          email, 
          score: newScore, 
          total: questions.length 
        },
        replace: true
      });
    } else {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      
      const progress = {
        currentQuestion: nextQuestion,
        score: newScore,
        userAnswers: newAnswers
      };
      localStorage.setItem(`quiz_progress_${email}`, JSON.stringify(progress));
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleFinish = () => {
    navigate('/quiz', { state: { email } });
  };

  if (!email) return null;

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="quiz-questions-page">
        <Header />
        
        <main className="quiz-questions-container">
          <div className="quiz-card">
            <div className="quiz-result">
              <div className="result-icon">🎉</div>
              <h1 className="result-title">Quiz Concluído!</h1>
              <div className="result-score">
                {score} / {questions.length}
              </div>
              <p className="result-message">
                Você acertou {percentage}% das questões!
              </p>
              
              <div className="quiz-actions" style={{ justifyContent: 'center' }}>
                <Button variant="outline" onClick={handleRestart}>
                  Refazer Quiz
                </Button>
                <Button variant="yellow" onClick={handleFinish}>
                  Finalizar
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <h2 className="question-title">Pergunta sobre o tema...</h2>
            <span className="question-counter">...{currentQuestion + 1}?</span>
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

        <button className="hint-button" onClick={() => setShowHint(true)}>
          Dica
        </button>

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