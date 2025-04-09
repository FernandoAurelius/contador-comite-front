import capitalService from "@/api/capitalService";
import Capital from "@/types/Capital";
import { defineStore } from "pinia";

export const useCapitalStore = defineStore("capital", {
  state: () => ({
      capital: {} as Capital
  }),
  actions: {
    async setInitialCapital(amount: number) {
      this.capital = await capitalService.setInitialAmount(amount);
    },
    async getCapital() {
      this.capital = await capitalService.getCapital();
      console.log("Recebendo solicitação para obter capital: ", this.capital);
      return this.capital;
    },
    async addCapital(amount: number) {
      this.capital = await capitalService.addCapital(amount);
    },
    async removeCapital(amount: number) {
      this.capital = await capitalService.removeCapital(amount);
    }
  }
});
