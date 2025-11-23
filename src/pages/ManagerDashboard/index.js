import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../services/api';
import './ManagerDashboard.css';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@empresa.com');

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    
    if (!isAuthenticated) {
      navigate('/admin', { replace: true });
      return;
    }

    const loadDashboard = async () => {
      try {
        console.log('Carregando dashboard...');
        const { dashboard } = await api.getManagerDashboard(adminEmail);
        console.log('Dashboard carregado:', dashboard);
        setCollaborators(dashboard);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [adminEmail, navigate]);

  const handleCollaboratorClick = (email) => {
    navigate('/manager/collaborator', { state: { email, adminEmail } });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="manager-title" style={{ margin: 0 }}>
            Bem vindo(a) a verificação de resultados da equipe
          </h1>
          <button 
            onClick={handleLogout}
            style={{
              background: 'white',
              color: '#1E2B5F',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            🚪 Sair
          </button>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">Visão geral</h2>
            
            <div className="table-container">
              <div className="table-header">
                <div className="table-header-cell collaborator-column">Colaborador</div>
                <div className="table-header-cell status-column">Status</div>
              </div>

              <div className="table-body">
                {collaborators.map((collab) => (
                  <div 
                    key={collab.email} 
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

          <div className="dashboard-section">
            <h2 className="section-title">Gráfico de nível</h2>
            <p style={{color: '#666', padding: '1rem'}}>Gráficos em desenvolvimento...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;