import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import './CollaboratorDetail.css';

const mockCollaboratorData = {
  email: 'joao.silva@empresa.com.br',
  progress: 75,
  level: 'Junior',
  score: 60,
  badges: [
    { id: 1, name: 'Módulo 1 Concluído', icon: '🎯' },
    { id: 2, name: 'Módulo 2 Concluído', icon: '🏆' },
    { id: 3, name: 'Quiz Completo', icon: '✅' }
  ]
};

function CollaboratorDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || mockCollaboratorData.email;

  const handleBack = () => {
    navigate('/manager/dashboard');
  };

  return (
    <div className="collaborator-detail-page">
      <Header />
      
      <main className="collaborator-main">
        <div className="collaborator-card">
          <h1 className="collaborator-header">
            Colaborador: <span className="email-highlight">{email}</span>
          </h1>

          <div className="collaborator-content">
            <div className="avatar-section">
              <div className="avatar-placeholder">
                <div className="avatar-circle"></div>
                <div className="avatar-body"></div>
              </div>
            </div>

            <div className="info-section">
              <div className="progress-info">
                <h2 className="info-label">Progresso: <span className="progress-value">{mockCollaboratorData.progress}%</span></h2>
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill-large green" 
                    style={{ width: `${mockCollaboratorData.progress}%` }}
                  />
                  <div 
                    className="progress-fill-large blue" 
                    style={{ width: `${100 - mockCollaboratorData.progress}%` }}
                  />
                </div>
              </div>

              <div className="details-info">
                <p className="detail-item">
                  <span className="detail-label">Nível:</span>
                  <span className="detail-value">{mockCollaboratorData.level}</span>
                </p>
                <p className="detail-item">
                  <span className="detail-label">Pontuação:</span>
                  <span className="detail-value">{mockCollaboratorData.score} pontos</span>
                </p>
              </div>

              <div className="badges-section">
                <div className="badges-container">
                  <h3 className="badges-title">Selos de conclusão dos módulos</h3>
                  <div className="badges-grid">
                    {mockCollaboratorData.badges.map(badge => (
                      <div key={badge.id} className="badge-item">
                        <span className="badge-icon">{badge.icon}</span>
                        <span className="badge-name">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <Button variant="yellow" size="lg" onClick={handleBack}>
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CollaboratorDetail;