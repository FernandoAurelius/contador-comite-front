import State from "@/interfaces/State";
import Token from "@/interfaces/Token";
import User from "@/interfaces/User";
import { createStore } from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default createStore<State>({
  state: {
    token: {} as Token | null,
    user: {} as User | null
  },
  actions: actions,
  mutations: mutations,
  getters: getters
});
