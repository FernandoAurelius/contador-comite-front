import State from "@/interfaces/State";
import Token from "@/interfaces/Token";
import User from "@/interfaces/User";

export default {
  SET_TOKEN(state: State, token: Token) {
    state.token = token;

    localStorage.setItem("authTokenValue", state.token.value);
    localStorage.setItem("authTokenExpiration", state.token.expiration.toISOString());
  },
  SET_USER(state: State, user: User) {
    state.user = user;

    // For posterior identification of the user
    localStorage.setItem("userEmail", user.email);
    this.SET_TOKEN(state, user.token);
  },
  REMOVE_USER(state: State) {
    state.user = null;
  }
}
