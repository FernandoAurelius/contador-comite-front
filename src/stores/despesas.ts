import despesaService from "@/api/despesaService";
import Despesa from "@/types/Despesa";
import { defineStore } from "pinia";

export const useDespesaStore = defineStore("despesa", {
  state: () => ({
    despesas: [] as Despesa[]
  }),
  actions: {
    async getDespesas(): Promise<Despesa[]> {
      this.despesas = await despesaService.getDespesas();
      return this.despesas;
    },
    async getDespesaByDate(date: Date) {
      let dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return await despesaService.getDespesaByDate(dateStr);
    },
    async addDespesa(despesa: Despesa) {
      const newDespesa = await despesaService.addDespesa(despesa);
      this.getDespesas();
      return newDespesa;
    },
    async updateDespesa(id: number) {
      const updatedDespesa = await despesaService.updateDespesa(id);
      this.getDespesas();
      return updatedDespesa;
    },
    async deleteDespesa(id: number) {
      despesaService.deleteDespesa(id)
      .then(response => {
          if (response.status !== 204) throw new Error("Despesa não encontrada.");
          this.getDespesas();
      });
    }
  }
})
