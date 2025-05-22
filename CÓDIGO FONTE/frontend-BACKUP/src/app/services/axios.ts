import axios from "axios";


interface IBackendConnectionConfig {
  backend_url: string;
}

declare var backendIp: (() => IBackendConnectionConfig) | undefined

export const api = axios.create({
  baseURL: (window as any).backendIp ? (backendIp as () => IBackendConnectionConfig)().backend_url : /*'http://vagas.pep2.ifsp.edu.br:8080/api' ||*/ 'http://localhost:4001'
});


api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    console.log('originalRequest: ', originalRequest);
    originalRequest._retry = true;
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    if (error.response.status === 401 && !originalRequest._retry) {
      console.log('401 error');
      try {
        const response = await api.get(`/refresh-token/`, { headers });
        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem('token', token);
          return api(originalRequest);
        }
      } catch (error) {
        console.log('Erro ao atualizar token');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
