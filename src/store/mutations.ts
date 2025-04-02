import State from "@/interfaces/State";
import Token from "@/interfaces/Token";

export default {
  SET_TOKEN(state: State, token: Token) {
    state.token = token;
  }
}
