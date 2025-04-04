import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const api = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const store = useAuthStore();

    if (error.response?.status == 401) {
      store.removeUser();

      router.push('/login');
    }
  },
);

export default api;
