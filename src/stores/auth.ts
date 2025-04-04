import User from "@/types/User";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null
  }),

  actions: {
    setUser(user: User) {
      this.user = user;
    },
    removeUser() {
      this.user = null;
    }
  }
});
