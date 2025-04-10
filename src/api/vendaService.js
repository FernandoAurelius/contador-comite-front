import api from ".";
export default {
    async getVendas() {
        return (await api.get("/vendas")).data;
    },
    async getVendaByDate(date) {
        return (await api.get(`/vendas/${date}`)).data;
    },
    async addVenda(venda) {
        // Remover o ID ao criar uma nova venda
        const { id, ...vendaWithoutId } = venda;
        return (await api.post("/vendas", vendaWithoutId)).data;
    },
    async updateVenda(id, venda) {
        return (await api.put(`/vendas/${id}`, venda)).data;
    },
    async deleteVenda(id) {
        return await api.delete(`/vendas/${id}`);
    }
};
//# sourceMappingURL=vendaService.js.map