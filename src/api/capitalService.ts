import Capital from "@/types/Capital";
import api from ".";

export default {
  async getCapital(): Promise<Capital> {
    console.log("Capital: ", (await api.get("/capital")).data)
    return (await api.get("/capital")).data;
  },
  async setInitialAmount(amount: number): Promise<Capital> {
    return (await api.put("/capital/initial", amount)).data;
  },
  async addCapital(amount: number): Promise<Capital> {
    return (await api.put("/capital/add", amount)).data;
  },
  async removeCapital(amount: number): Promise<Capital> {
    return (await api.put("/capital/subtract", amount)).data;
  }
}
