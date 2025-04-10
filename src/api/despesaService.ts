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
    // Remover o ID ao criar uma nova despesa
    const { id, ...despesaWithoutId } = despesa as any;
    return (await api.post("/despesas", despesaWithoutId)).data;
  },
  async updateDespesa(id: number, despesa: Despesa) {
    return (await api.put(`/despesas/${id}`, despesa)).data;
  },
  async deleteDespesa(id: number) {
    return await api.delete(`/despesas/${id}`);
  }
}
