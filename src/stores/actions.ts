import authService from "@/api/authService";
import Token from "@/interfaces/Token";
import User from "@/interfaces/User";
import { Commit } from "vuex";

export default {
  async getToken({ commit }: { commit: Commit }, user: User): Promise<void> {
    try {
      const token: Token = await authService.login(user);

      user.token = token;
      commit("SET_USER", user);
    } catch (error) {
      // TODO: handle API communication error
    }
  }
}
