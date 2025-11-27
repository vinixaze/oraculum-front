import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';
import api from '../../services/api';
import './Trail.css';

const modulesData = [
  {
    id: 1,
    title: 'Introdução',
    lessons: [
      { id: 1, title: '01 - Vídeo 1', duration: '15min', videoId: 'oyR4hCJhwMU' },
      { id: 2, title: '02 - Vídeo 2', duration: '14min', videoId: '1QYYgtadygI' },
      { id: 3, title: '03 - Vídeo 3', duration: '29min', videoId: 'Z6LBLB4y-aE' }
    ]
  },
  {
    id: 2,
    title: 'Módulo 2',
    lessons: [
      { id: 4, title: '01 - Fundamentos', duration: '14min', videoId: 'iRb_eXEKJVY' }
    ]
  },
  {
    id: 3,
    title: 'Módulo 3',
    lessons: []
  },
  {
    id: 4,
    title: 'Módulo 4',
    lessons: []
  },
  {
    id: 5,
    title: 'Módulo 5',
    lessons: []
  },
  {
    id: 6,
    title: 'Módulo 6',
    lessons: []
  },
  {
    id: 7,
    title: 'Conclusão',
    lessons: []
  }
];

function Trail() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState(null);

  const [currentLesson, setCurrentLesson] = useState(modulesData[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [expandedModules, setExpandedModules] = useState([1]);
  const [activeTab, setActiveTab] = useState('links');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Ref para evitar múltiplos toasts
  const lastToastTime = useRef(0);
  const saveTimeout = useRef(null);

  useEffect(() => {
    const stateEmail = location.state?.email;
    
    if (stateEmail) {
      setEmail(stateEmail);
      loadProgress(stateEmail);
    } else {
      console.log('Email não encontrado, redirecionando...');
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const loadProgress = async (userEmail) => {
    try {
      console.log('📥 Carregando progresso da trilha...');
      const { progress } = await api.getTrailProgress(userEmail);
      
      if (progress) {
        console.log('✅ Progresso carregado:', progress);
        setCompletedLessons(progress.completedLessons || []);
        if (progress.notes) setNotes(progress.notes);
        
        if (progress.currentLesson) {
          const lesson = findLessonById(progress.currentLesson);
          if (lesson) {
            setCurrentLesson(lesson);
          }
        }
      } else {
        console.log('ℹ️ Nenhum progresso anterior encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar progresso:', error);
    }
  };

  const findLessonById = (lessonId) => {
    for (const module of modulesData) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  const saveProgress = async (completed, currentNotes) => {
    if (!email || isSaving) return;

    setIsSaving(true);
    
    // Limpar timeout anterior
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    try {
      console.log('💾 Salvando progresso...', {
        completedLessons: completed,
        currentLesson: currentLesson.id
      });

      await api.saveTrailProgress(email, {
        completedLessons: completed,
        notes: currentNotes,
        currentModule: 1,
        currentLesson: currentLesson.id
      });

      console.log('✅ Progresso salvo com sucesso!');
      
      // Mostrar toast apenas se passou mais de 3 segundos do último
      const now = Date.now();
      if (now - lastToastTime.current > 3000) {
        toast.success('Progresso salvo!');
        lastToastTime.current = now;
      }
    } catch (error) {
      console.error('❌ Erro ao salvar progresso:', error);
      // Mostrar erro apenas se passou mais de 3 segundos
      const now = Date.now();
      if (now - lastToastTime.current > 3000) {
        toast.error('Erro ao salvar progresso');
        lastToastTime.current = now;
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectLesson = (lesson) => {
    setCurrentLesson(lesson);
    // Salvar automaticamente ao trocar de aula (com debounce)
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    saveTimeout.current = setTimeout(() => {
      saveProgress(completedLessons, notes);
    }, 1000);
  };

  const markAsCompleted = async () => {
    if (!completedLessons.includes(currentLesson.id)) {
      const updated = [...completedLessons, currentLesson.id];
      setCompletedLessons(updated);
      await saveProgress(updated, notes);
      
      // Verificar se completou toda a trilha
      const totalLessons = modulesData.reduce((acc, mod) => acc + mod.lessons.length, 0);
      if (updated.length === totalLessons) {
        toast.success('🎉 Parabéns! Você completou toda a trilha!');
      } else {
        toast.success('Aula concluída! 🎉');
      }
    } else {
      toast.info('Esta aula já foi concluída');
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
  };

  const handleNotesSave = () => {
    // Limpar timeout anterior
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    // Salvar com debounce
    saveTimeout.current = setTimeout(() => {
      saveProgress(completedLessons, notes);
    }, 500);
  };

  const totalLessons = modulesData.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  if (!email) return null;

  return (
    <div className="trail-page">
      <Header />
      
      <main className="trail-main">
        <div className="trail-container">
          <div className="trail-left">
            <div className="breadcrumb">
              <span>Trilha Conceitos Básicos</span>
              <span> &gt; </span>
              <span>Introdução</span>
              <span> &gt; </span>
              <span>{currentLesson.title}</span>
            </div>

            <h1 className="trail-title">{currentLesson.title}</h1>

            <div className="video-section">
              <div className="video-player-container">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                  title={currentLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="content-below-fold">
              <div className="lesson-description">
                <h3>Texto sobre o vídeo...</h3>
                <p>
                  Este é um conteúdo introdutório sobre segurança da informação. 
                  Aqui você aprenderá os conceitos fundamentais necessários para 
                  proteger dados e sistemas em ambientes digitais.
                </p>
              </div>

              <div className="lesson-tabs">
                <button 
                  className={`tab ${activeTab === 'links' ? 'active' : ''}`}
                  onClick={() => setActiveTab('links')}
                >
                  Links Úteis
                </button>
                <button 
                  className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notes')}
                >
                  Anotações
                </button>
                <button 
                  className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recommendations')}
                >
                  Recomendações
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'links' && (
                  <div className="links-section">
                    <p>Links úteis relacionados a esta aula...</p>
                    <ul>
                      <li><a href="https://www.cloudflare.com/learning/" target="_blank" rel="noopener noreferrer">Cloudflare Learning Center</a></li>
                      <li><a href="https://owasp.org/" target="_blank" rel="noopener noreferrer">OWASP - Segurança em Aplicações</a></li>
                      <li><a href="https://www.cisecurity.org/" target="_blank" rel="noopener noreferrer">CIS Security</a></li>
                    </ul>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="notes-section">
                    <textarea
                      value={notes}
                      onChange={handleNotesChange}
                      onBlur={handleNotesSave}
                      placeholder="Digite aqui suas anotações..."
                      maxLength={25000}
                    />
                    <div className="notes-counter">{notes.length}/25000</div>
                    <Button 
                      variant="yellow" 
                      size="sm" 
                      onClick={handleNotesSave}
                      disabled={isSaving}
                      style={{ marginTop: '0.5rem' }}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Anotações'}
                    </Button>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div className="recommendations-section">
                    <p>Recomendações de próximos passos...</p>
                    <ul>
                      <li>Pratique os conceitos aprendidos</li>
                      <li>Revise o material anterior se necessário</li>
                      <li>Participe dos fóruns de discussão</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="trail-right">
            <div className="trail-nav-buttons">
              <button className="nav-btn">&lt;</button>
              <button className="nav-btn">&gt;</button>
              <Button 
                variant="yellow" 
                size="sm"
                onClick={markAsCompleted}
                disabled={completedLessons.includes(currentLesson.id) || isSaving}
              >
                {completedLessons.includes(currentLesson.id) ? '✓ Concluída' : 'Concluir aula'}
              </Button>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Progresso total do curso</span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-info-text">
                {completedLessons.length} de {totalLessons} aulas concluídas
              </div>
            </div>

            <div className="search-section">
              <input
                type="text"
                placeholder="Pesquisar aula"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="search-button">🔍</button>
            </div>

            <div className="modules-list">
              {modulesData.map(module => (
                <div key={module.id} className="module-item">
                  <button 
                    className="module-header"
                    onClick={() => toggleModule(module.id)}
                  >
                    <span>{module.title}</span>
                    <div className="module-info">
                      <span className="module-progress">
                        {module.lessons.length > 0
                          ? `${Math.round((module.lessons.filter(l => completedLessons.includes(l.id)).length / module.lessons.length) * 100)}%`
                          : '0%'}
                      </span>
                      <span className="module-icon">
                        {expandedModules.includes(module.id) ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  {expandedModules.includes(module.id) && (
                    <div className="lessons-list">
                      {module.lessons.length > 0 ? (
                        module.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            className={`lesson-item ${currentLesson.id === lesson.id ? 'active' : ''} ${completedLessons.includes(lesson.id) ? 'completed' : ''}`}
                            onClick={() => selectLesson(lesson)}
                          >
                            <span className="lesson-icon">
                              {completedLessons.includes(lesson.id) ? '✓' : '○'}
                            </span>
                            <span className="lesson-title">{lesson.title}</span>
                            <span className="lesson-duration">{lesson.duration}</span>
                          </button>
                        ))
                      ) : (
                        <p className="no-lessons">Nenhuma aula disponível</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Trail;