import capitalService from "@/api/capitalService";
import { defineStore } from "pinia";
export const useCapitalStore = defineStore("capital", {
    state: () => ({
        capital: {}
    }),
    actions: {
        async setInitialCapital(amount) {
            this.capital = await capitalService.setInitialAmount(amount);
        },
        async getCapital() {
            this.capital = await capitalService.getCapital();
            console.log("Recebendo solicitação para obter capital: ", this.capital);
            return this.capital;
        },
        async addCapital(amount) {
            this.capital = await capitalService.addCapital(amount);
        },
        async removeCapital(amount) {
            this.capital = await capitalService.removeCapital(amount);
        }
    }
});
//# sourceMappingURL=capital.js.map