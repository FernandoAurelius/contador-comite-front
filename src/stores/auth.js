import authService from '@/api/authService';
import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        registered: false,
        logged: false
    }),
    actions: {
        async setUser(user) {
            this.user = user;
            this.logged = await authService.userIsLogged();
        },
        removeUser() {
            this.user = null;
            this.logged = false;
        },
    },
});
//# sourceMappingURL=auth.js.map