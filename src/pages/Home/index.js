import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { MailIcon } from '../../components/Icons';
import { useToast } from '../../components/Toast';
import './Home.css';

function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Por favor, digite seu e-mail corporativo');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Por favor, digite um e-mail válido');
      return;
    }

    setIsSubmitting(true);
    
    // Simula uma pequena validação/processamento
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/quiz', { state: { email } });
    }, 300);
  };

  return (
    <div className="home-page">
      <Header />
      
      <main className="home-main">
        <div className="home-content">
          <h1 className="home-title">
            A sua primeira linha de defesa contra ataques cibernéticos é o conhecimento.
          </h1>
          
          <div className="home-cta-section">
            <p className="home-cta-text">
              Teste agora suas habilidades em cibersegurança!
            </p>
            
            <form onSubmit={handleSubmit} className="home-form">
              <Input
                type="email"
                placeholder="Digite seu e-mail corporativo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<MailIcon />}
              />
              
              <Button 
                type="submit" 
                variant="yellow" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Carregando...' : 'Começar agora'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;