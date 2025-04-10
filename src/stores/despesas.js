import despesaService from "@/api/despesaService";
import { defineStore } from "pinia";
export const useDespesaStore = defineStore("despesa", {
    state: () => ({
        despesas: []
    }),
    actions: {
        async getDespesas() {
            this.despesas = await despesaService.getDespesas();
            return this.despesas;
        },
        async getDespesaByDate(date) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const dateStr = `${day}-${month}-${year}`;
            return await despesaService.getDespesaByDate(dateStr);
        },
        async addDespesa(despesa) {
            // A remoção do id agora é feita no service
            const newDespesa = await despesaService.addDespesa(despesa);
            await this.getDespesas();
            return newDespesa;
        },
        async updateDespesa(id, despesa) {
            const updatedDespesa = await despesaService.updateDespesa(id, despesa);
            await this.getDespesas();
            return updatedDespesa;
        },
        async deleteDespesa(id) {
            await despesaService.deleteDespesa(id);
            await this.getDespesas();
        }
    }
});
//# sourceMappingURL=despesas.js.map