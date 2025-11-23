import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';
import './AdminLogin.css';

const ADMIN_PASSWORD = 'admin123'; // Senha padrão (pode ser alterada)

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Por favor, digite a senha');
      return;
    }

    setIsSubmitting(true);

    // Simular validação
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        toast.success('Login realizado com sucesso!');
        // Salvar autenticação no sessionStorage
        sessionStorage.setItem('adminAuth', 'true');
        navigate('/manager/dashboard');
      } else {
        setError('Senha incorreta. Tente novamente.');
        setPassword('');
      }
      setIsSubmitting(false);
    }, 500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-page">
      <Header />
      
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-lock-icon">🔐</div>
          <h1 className="admin-login-title">Portal do Gestor</h1>
          <p className="admin-login-subtitle">
            Digite a senha para acessar o painel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha de Acesso
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                placeholder="Digite a senha"
                disabled={isSubmitting}
                autoFocus
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password-btn"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="yellow"
            size="lg"
            disabled={isSubmitting}
            className="admin-login-button"
          >
            {isSubmitting ? 'Verificando...' : 'Acessar Dashboard'}
          </Button>
        </form>

        <div className="back-to-home">
          <Link to="/" className="back-link">
            <span>←</span>
            <span>Voltar para a página inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;