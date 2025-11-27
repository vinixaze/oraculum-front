const API_URL = process.env.REACT_APP_API_URL || 'https://oraculum-back-production-600b.up.railway.app/';

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
      console.log('[API] Requisição:', url);
      if (options.body) {
        console.log('[API] Payload:', JSON.parse(options.body));
      }

      const response = await fetch(url, config);
      const data = await response.json();

      console.log('[API] Resposta:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('[API] Erro:', error.message);
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

  async getNextQuestion(email) {
    return this.request(`/quiz/next-question/${email}`);
  }

async submitAnswer(email, perguntaId, alternativaEscolhidaId, usouDica = false) {
    return this.request('/quiz/answer', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        perguntaId, 
        alternativaEscolhidaId,
        usouDica
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

  // Trail endpoints
  async saveTrailProgress(email, progressData) {
    return this.request('/trail/progress', {
      method: 'POST',
      body: JSON.stringify({ email, ...progressData }),
    });
  }

  async getTrailProgress(email) {
    return this.request(`/trail/progress/${email}`);
  }

  // Manager endpoints
  async getManagerDashboard(adminEmail) {
    return this.request(`/manager/dashboard?email=${adminEmail}`);
  }

  async getCollaboratorDetail(email, adminEmail) {
    return this.request(`/manager/collaborator/${email}?adminEmail=${adminEmail}`);
  }
}

export default new ApiService();