import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import HintModal from '../../components/HIntModal';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import './QuizQuestions.css';

function QuizQuestions() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const email = location.state?.email;

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStatus, setQuizStatus] = useState({
    pontuacaoAtual: 0,
    nivelAtual: 'INICIANTE',
    totalPerguntas: 0,
    perguntaNumero: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    initializeQuiz();
  }, [email, navigate]);

  const initializeQuiz = async () => {
    try {
      setIsLoading(true);
      
      await api.startQuiz(email, 'MEDIO');
      console.log('✅ Quiz iniciado');

      await loadNextQuestion();

    } catch (error) {
      console.error('❌ Erro ao inicializar quiz:', error);
      toast.error('Erro ao iniciar o quiz. Tente novamente.');
      navigate('/quiz', { state: { email } });
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextQuestion = async () => {
    try {
      console.log('📥 Buscando próxima pergunta...');
      
      const response = await api.getNextQuestion(email);
      
      if (response.finished) {
        console.log('🏁 Quiz finalizado');
        await handleQuizFinished();
        return;
      }

      if (response.question) {
        setCurrentQuestion(response.question);
        setQuizStatus({
          pontuacaoAtual: response.pontuacaoAtual,
          nivelAtual: response.nivelAtual,
          totalPerguntas: response.totalPerguntas,
          perguntaNumero: response.perguntaNumero
        });
        setSelectedAnswer(null);
        setUsedHint(false);
        console.log(`📝 Pergunta ${response.perguntaNumero} carregada`);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar pergunta:', error);
      toast.error('Erro ao carregar pergunta');
    }
  };

  const handleSelectAnswer = (alternativaId) => {
    setSelectedAnswer(alternativaId);
  };

    const handleShowHint = () => {
    setShowHint(true);
    setUsedHint(true);
    console.log('💡 Dica utilizada - pontos serão reduzidos em 50%');
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('📤 Enviando resposta...');
      
            const response = await api.submitAnswer(
        email,
        currentQuestion.id,
        selectedAnswer,
        usedHint
      );

      console.log('✅ Resposta processada');

      if (usedHint) {
        toast.info('💡 Dica usada: pontos reduzidos em 50%');
      }

      if (response.finalizado) {
        console.log('🏁 Quiz finalizado após resposta');
        await handleQuizFinished();
      } else {
        await loadNextQuestion();
      }

    } catch (error) {
      console.error('❌ Erro ao enviar resposta:', error);
      toast.error('Erro ao processar resposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizFinished = async () => {
    try {
      console.log('📊 Finalizando quiz...');
      
      const { relatorio } = await api.submitQuiz(email);
      console.log('✅ Relatório gerado:', relatorio);

      navigate('/completion', { 
        state: { 
          email, 
          score: relatorio.acertos,
          total: relatorio.totalPerguntas,
          nivel: relatorio.nivelFinal,
          pontuacao: relatorio.pontuacaoFinal,
          percentual: relatorio.percentualConclusao,
          dicasUsadas: relatorio.dicasUsadas
        },
        replace: true
      });

    } catch (error) {
      console.error('❌ Erro ao finalizar quiz:', error);
      toast.error('Erro ao finalizar quiz');
    }
  };

  if (!email) return null;

  if (isLoading) {
    return (
      <div className="quiz-questions-page">
        <Header />
        <main className="quiz-questions-container">
          <div className="quiz-header">
            <h1 className="quiz-header-title">Carregando quiz...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-questions-page">
        <Header />
        <main className="quiz-questions-container">
          <div className="quiz-header">
            <h1 className="quiz-header-title">Carregando pergunta...</h1>
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
            Quiz de Nivelamento em Cibersegurança
          </h1>
          <p className="quiz-header-subtitle">
            Pergunta <strong>{quizStatus.perguntaNumero}</strong> de 12
          </p>
        </div>

        <div className="quiz-card">
          <div className="question-header">
            <h2 className="question-title">
              Pergunta {quizStatus.perguntaNumero}
            </h2>
            
            {currentQuestion.dica && (
              <button
                className={`hint-button-header ${usedHint ? 'hint-used' : ''}`}
                onClick={handleShowHint}
                type="button"
                disabled={usedHint}
              >
                <span className="hint-icon">💡</span>
                {usedHint ? 'Dica Usada' : 'Dica'}  
                </button>
            )}
          </div>

          {usedHint && (
            <div className="hint-warning">
              ⚠️ Você usou a dica - seus pontos para esta questão serão reduzidos em 50%
            </div>
          )}

          <p className="question-text">{currentQuestion.texto}</p>

          <div className="options-list">
            {currentQuestion.alternativas && currentQuestion.alternativas.map((alternativa) => (
              <button
                key={alternativa.id}
                className={`option-item ${selectedAnswer === alternativa.id ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(alternativa.id)}
                disabled={isSubmitting}
              >
                <span className="option-radio"></span>
                <span className="option-text">
                  {alternativa.letra}) {alternativa.texto}
                </span>
              </button>
            ))}
          </div>

          <div className="quiz-navigation">
            <Button
              variant="yellow"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null || isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Responder'}
            </Button>
          </div>
        </div>
      </main>

      {showHint && currentQuestion.dica && (
        <HintModal
          hint={currentQuestion.dica}
          onClose={() => setShowHint(false)}
        />
      )}
    </div>
  );
}

export default QuizQuestions;