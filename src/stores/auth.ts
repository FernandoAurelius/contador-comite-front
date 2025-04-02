import Token from "@/interfaces/Token";
import User from "@/interfaces/User";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as Token | null,
    user: null as User | null
  }),

  getters: {
    currentToken: (state) => {
      if (!state.token?.expiration || state.token.expiration.getTime() < Date.now()) return null;

      return state.token.value;
    },

    user: (state) => state.user
  },

  actions: {
    setToken(token: Token) {
      this.token = token;
      localStorage.setItem("tokenValue", token.value);
      localStorage.setItem("tokenExpiration", token.expiration.toISOString());
    },
    setUser(user: User) {
      this.user = user;

      this.setToken(user.token);
    }
  }
});
