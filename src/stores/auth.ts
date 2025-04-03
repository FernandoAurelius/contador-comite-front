import User from "@/interfaces/User";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null
  }),

  getters: {
    user: (state) => state.user
  },

  actions: {
    setUser(user: User) {
      this.user = user;
    },
    removeUser() {
      this.user = null;
    }
  }
});
