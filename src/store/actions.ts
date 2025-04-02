import api from "@/api";
import Token from "@/interfaces/Token";
import User from "@/interfaces/User";
import { Commit, Dispatch } from "vuex";

export default {
  async getToken({ commit, dispatch }: { commit: Commit, dispatch: Dispatch }, user: User): Promise<void> {
    let token: Token = { value: response.data.value, expiration: response.data.expiration };
    commit("SET_TOKEN", token);
  }
}
