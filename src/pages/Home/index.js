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
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      toast.error('Por favor, digite seu e-mail corporativo');
      return;
    }
    
    if (!emailRegex.test(email)) {
      toast.error('Por favor, digite um e-mail válido');
      return;
    }

    navigate('/quiz', { state: { email } });
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
              
              <Button type="submit" variant="yellow" size="lg">
                Começar agora
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;