import User from "@/interfaces/User";
import api from ".";
import Token from "@/interfaces/Token";

export default {
  async login(user: User): Promise<Token> {
      const response = await api.post("/api/auth/login", { "email": user.email, "password": user.password });

      if (response.status != 200) throw new Error;

      return { value: response.data.value, expiration: response.data.expiration };
  }
}
