import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { MailIcon } from '../../components/Icons';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
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

    try {
      console.log('Registrando usuário...');
      const { user } = await api.registerUser(email);
      console.log('Usuário registrado:', user);

      try {
        const { result } = await api.getQuizResult(email);
        if (result) {
          console.log('Quiz já foi completado, indo direto para trilha');
          toast.success('Bem-vindo de volta! Você já completou o quiz.');
          navigate('/trail', { 
            state: { 
              email,
              fromQuizCompletion: true 
            } 
          });
          return;
        }
      } catch (err) {
        console.log('Quiz não completado ainda');
      }

      navigate('/quiz', { state: { email } });
      
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Erro ao acessar o sistema. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
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