import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './ManagerDashboard.css';

const mockData = {
  collaborators: [
    { id: 1, email: 'joao.silva@empresa.com.br', status: 'completed', progress: 100 },
    { id: 2, email: 'maria.santos@empresa.com.br', status: 'in-progress', progress: 45 },
    { id: 3, email: 'pedro.oliveira@empresa.com.br', status: 'in-progress', progress: 60 },
    { id: 4, email: 'ana.costa@empresa.com.br', status: 'completed', progress: 100 },
    { id: 5, email: 'carlos.souza@empresa.com.br', status: 'completed', progress: 100 },
    { id: 6, email: 'julia.lima@empresa.com.br', status: 'in-progress', progress: 30 }
  ],
  levelStats: {
    iniciante: { count: 3, percentage: 33 },
    intermediario: { count: 6, percentage: 67 },
    avancado: { count: 0, percentage: 0 }
  }
};

function ManagerDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('collaborator');

  const handleCollaboratorClick = (email) => {
    navigate('/manager/collaborator', { state: { email } });
  };

  return (
    <div className="manager-dashboard-page">
      <Header />
      
      <main className="manager-main">
        <h1 className="manager-title">Bem vindo(a) a verificação de resultados da equipe</h1>

        <div className="dashboard-content">
          {/* Visão Geral */}
          <div className="dashboard-section">
            <h2 className="section-title">Visão geral</h2>
            
            <div className="table-container">
              <div className="table-header">
                <div className="table-header-cell collaborator-column">Colaborador</div>
                <div className="table-header-cell status-column">Status</div>
              </div>

              <div className="table-body">
                {mockData.collaborators.map((collab) => (
                  <div 
                    key={collab.id} 
                    className="table-row"
                    onClick={() => handleCollaboratorClick(collab.email)}
                  >
                    <div className="table-cell collaborator-cell">
                      <span className="user-icon">👤</span>
                      <span className="user-email">{collab.email}</span>
                    </div>
                    <div className="table-cell status-cell">
                      {collab.status === 'completed' ? (
                        <span className="status-icon completed">✓</span>
                      ) : (
                        <div className="progress-bar-small">
                          <div 
                            className="progress-fill-small" 
                            style={{ width: `${collab.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico de Nível */}
          <div className="dashboard-section">
            <h2 className="section-title">Gráfico de nível</h2>
            
            <div className="charts-container">
              <div className="chart-wrapper">
                <div className="chart">
                  <div className="chart-row">
                    <span className="chart-label">A</span>
                    <div className="chart-bar">
                      <div className="chart-bar-fill" style={{ width: '30%' }}>
                        <span className="chart-value">3</span>
                      </div>
                      <span className="chart-max">6</span>
                    </div>
                  </div>
                  <div className="chart-row">
                    <span className="chart-label">B</span>
                    <div className="chart-bar">
                      <div className="chart-bar-fill" style={{ width: '80%' }}>
                        <span className="chart-value">8</span>
                      </div>
                      <span className="chart-max">14</span>
                    </div>
                  </div>
                  <div className="chart-row">
                    <span className="chart-label">C</span>
                    <div className="chart-bar">
                      <div className="chart-bar-fill" style={{ width: '89%' }}>
                        <span className="chart-value">16</span>
                      </div>
                      <span className="chart-max">18</span>
                    </div>
                  </div>
                </div>
                <div className="chart-axis">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>

              <div className="chart-wrapper">
                <div className="chart">
                  <div className="chart-row">
                    <span className="chart-label">A</span>
                    <div className="chart-bar">
                      <div className="chart-bar-fill" style={{ width: '30%' }}>
                        <span className="chart-value">3</span>
                      </div>
                      <span className="chart-max">6</span>
                    </div>
                  </div>
                  <div className="chart-row">
                    <span className="chart-label">B</span>
                    <div className="chart-bar">
                      <div className="chart-bar-fill" style={{ width: '80%' }}>
                        <span className="chart-value">8</span>
                      </div>
                      <span className="chart-max">14</span>
                    </div>
                  </div>
                  <div className="chart-row">
                    <span className="chart-label">C</span>
                    <div className="chart-bar">
                      <div className="chart-bar-fill" style={{ width: '89%' }}>
                        <span className="chart-value">16</span>
                      </div>
                      <span className="chart-max">18</span>
                    </div>
                  </div>
                </div>
                <div className="chart-axis">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;