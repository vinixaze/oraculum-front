const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('[API] Fazendo requisição:', url);
      console.log('[API] Dados:', options.body);

      const response = await fetch(url, config);
      const data = await response.json();

      console.log('[API] Resposta:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('[API] Erro:', error);
      throw error;
    }
  }

  async registerUser(email, role = 'user') {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async getUser(email) {
    return this.request(`/users/${email}`);
  }

  async startQuiz(email, modo = 'MEDIO') {
    return this.request('/quiz/start', {
      method: 'POST',
      body: JSON.stringify({ email, modo }),
    });
  }

  async submitAnswer(email, questaoId, respostaCorreta, dificuldadeQuestao) {
    return this.request('/quiz/answer', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        questaoId, 
        respostaCorreta, 
        dificuldadeQuestao 
      }),
    });
  }

  async submitQuiz(email) {
    return this.request('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getQuizResult(email) {
    return this.request(`/quiz/result/${email}`);
  }

  async saveTrailProgress(email, progressData) {
    return this.request('/trail/progress', {
      method: 'POST',
      body: JSON.stringify({ email, ...progressData }),
    });
  }

  async getTrailProgress(email) {
    return this.request(`/trail/progress/${email}`);
  }

  async getManagerDashboard(email) {
    return this.request(`/manager/dashboard?email=${email}`);
  }

  async getCollaboratorDetail(email, adminEmail) {
    return this.request(`/manager/collaborator/${email}?email=${adminEmail}`);
  }
}

export default new ApiService();