import { ZodError } from 'zod';
import api from '.';
import { useAuthStore } from '@/stores/auth';

export default {
  async login(email: string, password: string): Promise<void> {
    const response = await api.post('/auth/login', { email, password });

    if (response.status === 401) throw new Error('E-mail ou senha inválidos.');

    const store = useAuthStore();

    try {
      store.setUser(response.data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(
          'Os dados recebidos pela API não são compatíveis com o tipo User. Por favor, entre em contato com o administrador.',
        );
        alert('Erro! Dados não compatíveis com User type.');
        store.removeUser();
      }
    }
  },

  async logout(): Promise<void> {
    const response = await api.post('/auth/logout');

    if (response.status !== 200) throw new Error();

    const store = useAuthStore();

    store.removeUser();
  },

  async register(name: string, email: string, password: string): Promise<void> {
    const response = await api.post('/auth/register', { name, email, password, role: "user" });

    if (response.status === 400) throw new Error('Registro inválido: e-mail já em uso.');
  },

  async userIsLogged(): Promise<boolean> {
    const store = useAuthStore();

    return api
      .get('/user/me')
      .then((response) => {
        if (response.status === 401) throw new Error();
        store.setUser(response.data);
        return true;
      })
      .catch((error) => {
        store.removeUser();
        return false;
      });
  },
};
