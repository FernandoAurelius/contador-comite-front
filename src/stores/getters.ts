import State from "@/interfaces/State"
import User from "@/interfaces/User";

export default {
  token: (state: State): String | null => {
    if (state.token.expiration.getTime() < Date.now()) return null;

    return state.token.value;
  },
  user: (state: State): User => {
    return state.user;
  }
}
