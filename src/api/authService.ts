import api from '.';
import { useAuthStore } from '@/stores/auth';

export default {
  async login(email: string, password: string): Promise<void> {
    const response = await api.post('/api/auth/login', { email: email, password: password });

    if (response.status === 401) throw new Error('E-mail ou senha inválidos.');

    const store = useAuthStore();

    store.setUser(response.data);
  },

  async logout(): Promise<void> {
    const response = await api.post('/api/auth/logout');

    if (response.status !== 200) throw new Error();

    const store = useAuthStore();

    store.removeUser();
  },

  async checkAuthStatus(): Promise<boolean> {
    const store = useAuthStore();

    try {
      const response = await api.get('/api/users/me');

      if (response.status === 401) throw new Error();

      store.setUser(response.data);

      return true;
    } catch (error) {
      store.removeUser();
      return false;
    }
  },
};
