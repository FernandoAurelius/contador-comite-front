import Despesa from "@/types/Despesa";
import api from ".";

export default {
  async getDespesas(): Promise<Despesa[]> {
    return (await api.get("/despesas")).data;
  },
  async getDespesaByDate(date: string) {
    return (await api.get(`/despesas/${date}`)).data;
  },
  async addDespesa(despesa: Despesa) {
    return (await api.post("/despesas", { despesa })).data;
  },
  async updateDespesa(id: number) {
    return (await api.put(`/despesas/${id}`)).data;
  },
  async deleteDespesa(id: number) {
    return await api.delete(`/despesas/${id}`);
  }
}
