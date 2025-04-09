import axios from 'axios';

// Configurando a instância do axios com as configurações necessárias
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true, // Importante para enviar cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para debugging de requisições
api.interceptors.request.use(request => {
  console.log('API Request:', request.method?.toUpperCase(), request.url, request.params || request.data);
  return request;
});

// Interceptor para debugging de respostas
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Error Response:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;
