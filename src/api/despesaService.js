import api from ".";
export default {
    async getDespesas() {
        return (await api.get("/despesas")).data;
    },
    async getDespesaByDate(date) {
        return (await api.get(`/despesas/${date}`)).data;
    },
    async addDespesa(despesa) {
        // Remover o ID ao criar uma nova despesa
        const { id, ...despesaWithoutId } = despesa;
        return (await api.post("/despesas", despesaWithoutId)).data;
    },
    async updateDespesa(id, despesa) {
        return (await api.put(`/despesas/${id}`, despesa)).data;
    },
    async deleteDespesa(id) {
        return await api.delete(`/despesas/${id}`);
    }
};
//# sourceMappingURL=despesaService.js.map