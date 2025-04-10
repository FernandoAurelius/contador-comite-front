import authService from '@/api/authService';
import User from '@/types/User';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    registered: false,
    logged: false
  }),
  actions: {
    async setUser(user: User) {
      this.user = user;
      this.logged = await authService.userIsLogged();
    },
    removeUser() {
      this.user = null;
      this.logged = false;
    },
  },
});
