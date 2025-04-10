import axios from 'axios';

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
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
