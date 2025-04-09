import Venda from "@/types/Venda";
import api from ".";

export default {
  async getVendas(): Promise<Venda[]> {
    return (await api.get("/vendas")).data;
  },
  async getVendaByDate(date: string) {
    return (await api.get(`/vendas/${date}`)).data;
  },
  async addVenda(venda: Venda) {
    return (await api.post("/vendas", venda)).data;
  },
  async updateVenda(id: number, venda: Venda) {
    return (await api.put(`/vendas/${id}`, venda)).data;
  },
  async deleteVenda(id: number) {
    return await api.delete(`/vendas/${id}`);
  }
}
