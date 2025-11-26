import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../services/api';
import './ManagerDashboard.css';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail] = useState('admin@empresa.com');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    
    if (!isAuthenticated) {
      navigate('/admin', { replace: true });
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      console.log('📊 Carregando dashboard...');
      const response = await api.getManagerDashboard(adminEmail);
      
      if (response.dashboard) {
        console.log('✅ Dashboard carregado:', response.dashboard);
        setCollaborators(response.dashboard);
        
        // Calcular estatísticas
        const stats = {
          total: response.dashboard.length,
          completed: response.dashboard.filter(c => c.status === 'completed').length,
          inProgress: response.dashboard.filter(c => c.status === 'in-progress').length,
          notStarted: response.dashboard.filter(c => c.status === 'not-started').length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollaboratorClick = (email) => {
    navigate('/manager/collaborator', { state: { email, adminEmail } });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const getStatusBadge = (status) => {
    const badges = {
      'completed': { text: 'Completo', color: '#10b981', icon: '✓' },
      'in-progress': { text: 'Em Progresso', color: '#3b82f6', icon: '⟳' },
      'not-started': { text: 'Não Iniciado', color: '#6b7280', icon: '○' }
    };
    return badges[status] || badges['not-started'];
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
      <div className="manager-dashboard-page">
        <Header />
        <main className="manager-main">
          <h1 className="manager-title">Carregando...</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="manager-dashboard-page">
      <Header />
      
      <main className="manager-main">
        <div className="dashboard-header">
          <div>
            <h1 className="manager-title">
              Portal do Gestor - Dashboard de Treinamento
            </h1>
            <p className="manager-subtitle">
              Acompanhe o progresso de toda a equipe em tempo real
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            🚪 Sair
          </button>
        </div>

        {/* Estatísticas Gerais */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total de Usuários</div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completaram</div>
            </div>
          </div>

          <div className="stat-card stat-progress">
            <div className="stat-icon">⟳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.inProgress}</div>
              <div className="stat-label">Em Progresso</div>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">○</div>
            <div className="stat-content">
              <div className="stat-value">{stats.notStarted}</div>
              <div className="stat-label">Não Iniciaram</div>
            </div>
          </div>
        </div>

        {/* Tabela de Colaboradores */}
        <div className="dashboard-section">
          <h2 className="section-title">
            📋 Colaboradores ({collaborators.length})
          </h2>
          
          <div className="table-wrapper">
            <table className="collaborators-table">
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Status</th>
                  <th>Quiz</th>
                  <th>Nível</th>
                  <th>Pontuação</th>
                  <th>Acertos</th>
                  <th>Trilha</th>
                  <th>Último Acesso</th>
                </tr>
              </thead>
              <tbody>
                {collaborators.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p>Nenhum colaborador cadastrado ainda</p>
                    </td>
                  </tr>
                ) : (
                  collaborators.map((collab) => {
                    const statusBadge = getStatusBadge(collab.status);
                    return (
                      <tr 
                        key={collab.email} 
                        onClick={() => handleCollaboratorClick(collab.email)}
                        className="table-row-clickable"
                      >
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {collab.nome ? collab.nome.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="user-info">
                              <div className="user-name">{collab.nome || 'Sem nome'}</div>
                              <div className="user-email">{collab.email}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: statusBadge.color }}
                          >
                            {statusBadge.icon} {statusBadge.text}
                          </span>
                        </td>
                        
                        <td>
                          {collab.quizCompleted ? (
                            <span className="quiz-status completed">
                              ✓ Completo
                            </span>
                          ) : (
                            <span className="quiz-status pending">
                              ○ Pendente
                            </span>
                          )}
                        </td>
                        
                        <td>
                          <span 
                            className="nivel-badge"
                            style={{ 
                              backgroundColor: getNivelColor(collab.nivelFinal),
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.875rem',
                              fontWeight: '600'
                            }}
                          >
                            {collab.nivelFinal}
                          </span>
                        </td>
                        
                        <td>
                          <span className="pontuacao-value">
                            {collab.pontuacaoFinal} pts
                          </span>
                        </td>
                        
                        <td>
                          {collab.quizCompleted ? (
                            <span className="acertos-info">
                              {collab.acertos}/{collab.totalPerguntas}
                              <span className="percentual">
                                ({Math.round((collab.acertos / collab.totalPerguntas) * 100)}%)
                              </span>
                            </span>
                          ) : (
                            <span className="na-text">-</span>
                          )}
                        </td>
                        
                        <td>
                          <div className="progress-cell">
                            <div className="mini-progress-bar">
                              <div 
                                className="mini-progress-fill"
                                style={{ width: `${collab.progress}%` }}
                              />
                            </div>
                            <span className="progress-text">{collab.progress}%</span>
                          </div>
                        </td>
                        
                        <td>
                          <span className="last-access">
                            {collab.lastAccess 
                              ? new Date(collab.lastAccess).toLocaleDateString('pt-BR')
                              : 'Nunca'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;