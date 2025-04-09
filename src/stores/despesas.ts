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
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const dateStr = `${year}-${month}-${day}`;
      return await despesaService.getDespesaByDate(dateStr);
    },
    async addDespesa(despesa: Despesa): Promise<Despesa> {
      const newDespesa = await despesaService.addDespesa(despesa);
      await this.getDespesas();
      return newDespesa;
    },
    async updateDespesa(id: number, despesa: Despesa) {
      const updatedDespesa = await despesaService.updateDespesa(id, despesa);
      await this.getDespesas();
      return updatedDespesa;
    },
    async deleteDespesa(id: number) {
      await despesaService.deleteDespesa(id);
      await this.getDespesas();
    }
  }
});
