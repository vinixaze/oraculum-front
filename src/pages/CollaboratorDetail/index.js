import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import api from '../../services/api';
import './CollaboratorDetail.css';

function CollaboratorDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const adminEmail = location.state?.adminEmail;

  const [collaborator, setCollaborator] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      navigate('/manager/dashboard');
      return;
    }

    loadCollaboratorDetails();
  }, [email]);

  const loadCollaboratorDetails = async () => {
    try {
      console.log('📥 Carregando detalhes do colaborador:', email);
      const response = await api.getCollaboratorDetail(email, adminEmail);
      
      if (response.collaborator) {
        console.log('✅ Detalhes carregados:', response.collaborator);
        setCollaborator(response.collaborator);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar detalhes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/manager/dashboard');
  };

  const getNivelColor = (nivel) => {
    const colors = {
      'AVANÇADO': '#10b981',
      'INTERMEDIÁRIO': '#3b82f6',
      'INICIANTE': '#f59e0b',
      'N/A': '#6b7280'
    };
    return colors[nivel] || colors['N/A'];
  };

  if (isLoading) {
    return (
      <div className="collaborator-detail-page">
        <Header />
        <main className="collaborator-main">
          <h1 className="loading-text">Carregando...</h1>
        </main>
      </div>
    );
  }

  if (!collaborator) {
    return (
      <div className="collaborator-detail-page">
        <Header />
        <main className="collaborator-main">
          <h1 className="loading-text">Colaborador não encontrado</h1>
          <Button variant="yellow" onClick={handleBack}>
            Voltar
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="collaborator-detail-page">
      <Header />
      
      <main className="collaborator-main">
        <div className="detail-header">
          <Button variant="outline" onClick={handleBack} className="back-button">
            ← Voltar
          </Button>
        </div>

        {/* Informações Principais */}
        <div className="detail-card main-info">
          <div className="user-header">
            <div className="user-avatar-large">
              {collaborator.nome ? collaborator.nome.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="user-header-info">
              <h1 className="user-name-large">{collaborator.nome || 'Sem nome'}</h1>
              <p className="user-email-large">{collaborator.email}</p>
              <div className="user-dates">
                <span>📅 Cadastrado em: {new Date(collaborator.dataCriacao).toLocaleDateString('pt-BR')}</span>
                <span>🕐 Último acesso: {collaborator.lastAccess ? new Date(collaborator.lastAccess).toLocaleDateString('pt-BR') : 'Nunca'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-box-icon">🎯</div>
            <div className="stat-box-content">
              <div className="stat-box-label">Status do Quiz</div>
              <div className="stat-box-value">
                {collaborator.quizCompleted ? '✓ Completo' : '○ Não Iniciado'}
              </div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-icon">🏆</div>
            <div className="stat-box-content">
              <div className="stat-box-label">Nível Alcançado</div>
              <div 
                className="stat-box-value nivel-badge-large"
                style={{ 
                  backgroundColor: getNivelColor(collaborator.nivelFinal),
                  color: 'white'
                }}
              >
                {collaborator.nivelFinal}
              </div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-icon">⭐</div>
            <div className="stat-box-content">
              <div className="stat-box-label">Pontuação Total</div>
              <div className="stat-box-value">{collaborator.pontuacaoFinal} pontos</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-box-icon">✓</div>
            <div className="stat-box-content">
              <div className="stat-box-label">Taxa de Acerto</div>
              <div className="stat-box-value">
                {collaborator.quizCompleted 
                  ? `${Math.round((collaborator.acertos / collaborator.totalPerguntas) * 100)}%`
                  : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes do Quiz */}
        {collaborator.quizCompleted && (
          <div className="detail-card">
            <h2 className="card-title">📊 Resultados do Quiz</h2>
            <div className="quiz-details-grid">
              <div className="quiz-detail-item">
                <span className="detail-label">Total de Perguntas:</span>
                <span className="detail-value">{collaborator.totalPerguntas}</span>
              </div>
              <div className="quiz-detail-item">
                <span className="detail-label">Acertos:</span>
                <span className="detail-value success">{collaborator.acertos}</span>
              </div>
              <div className="quiz-detail-item">
                <span className="detail-label">Erros:</span>
                <span className="detail-value error">{collaborator.erros}</span>
              </div>
              <div className="quiz-detail-item">
                <span className="detail-label">Percentual de Conclusão:</span>
                <span className="detail-value">{collaborator.percentualQuiz}%</span>
              </div>
              <div className="quiz-detail-item">
                <span className="detail-label">Modo:</span>
                <span className="detail-value">{collaborator.modo}</span>
              </div>
              <div className="quiz-detail-item">
                <span className="detail-label">Atingiu Máximo:</span>
                <span className="detail-value">
                  {collaborator.atingiuMaximo ? '✓ Sim' : '○ Não'}
                </span>
              </div>
              {collaborator.dataRealizacao && (
                <div className="quiz-detail-item">
                  <span className="detail-label">Data de Realização:</span>
                  <span className="detail-value">
                    {new Date(collaborator.dataRealizacao).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progresso da Trilha */}
        <div className="detail-card">
          <h2 className="card-title">📚 Progresso na Trilha de Aprendizado</h2>
          <div className="trail-progress-section">
            <div className="progress-info-large">
              <div className="progress-header-large">
                <span>Progresso Geral</span>
                <span className="progress-percentage-large">{collaborator.trailProgress}%</span>
              </div>
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large"
                  style={{ width: `${collaborator.trailProgress}%` }}
                />
              </div>
              <div className="progress-details">
                <span>{collaborator.completedLessonsCount} de {collaborator.totalLessons} aulas concluídas</span>
                {collaborator.trailLastUpdate && (
                  <span className="last-update">
                    Última atualização: {new Date(collaborator.trailLastUpdate).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>

            <div className="current-position">
              <div className="position-item">
                <span className="position-label">Módulo Atual:</span>
                <span className="position-value">Módulo {collaborator.currentModule}</span>
              </div>
              <div className="position-item">
                <span className="position-label">Aula Atual:</span>
                <span className="position-value">Aula {collaborator.currentLesson}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges e Conquistas */}
        {collaborator.badges && collaborator.badges.length > 0 && (
          <div className="detail-card">
            <h2 className="card-title">🏅 Badges e Conquistas</h2>
            <div className="badges-grid">
              {collaborator.badges.map(badge => (
                <div key={badge.id} className="badge-card">
                  <div className="badge-icon-large">{badge.icon}</div>
                  <div className="badge-info">
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-description">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Histórico de Respostas */}
        {collaborator.answersHistory && collaborator.answersHistory.length > 0 && (
          <div className="detail-card">
            <h2 className="card-title">📝 Histórico de Respostas</h2>
            <div className="history-timeline">
              {collaborator.answersHistory.map((answer, index) => (
                <div key={index} className="history-item">
                  <div className={`history-marker ${answer.acertou ? 'correct' : 'incorrect'}`}>
                    {answer.acertou ? '✓' : '✗'}
                  </div>
                  <div className="history-content">
                    <div className="history-header">
                      <span className="history-title">
                        Pergunta {index + 1} - {answer.dificuldade}
                      </span>
                      <span className="history-date">
                        {new Date(answer.answered_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="history-details">
                      <span className={answer.acertou ? 'correct-text' : 'incorrect-text'}>
                        {answer.acertou ? 'Acertou' : 'Errou'}
                      </span>
                      <span>•</span>
                      <span>+{answer.pontos_ganhos} pontos</span>
                      <span>•</span>
                      <span>Nível: {answer.nivel_atual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CollaboratorDetail;