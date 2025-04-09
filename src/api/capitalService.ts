import api from ".";

export interface CapitalStatus {
  currentAmount: number;
  initialAmount: number;
  totalAmount: number;
  initialSetted: boolean;
}

export default {
  // Obter o status atual do capital
  async getCapitalStatus(): Promise<CapitalStatus> {
    return (await api.get("/capital")).data;
  },

  // Definir o valor inicial do capital
  async setInitialAmount(amount: number): Promise<CapitalStatus> {
    return (await api.post("/capital/initial", { amount })).data;
  },

  // Atualizar o valor atual do capital (opcional, se necessário)
  async updateCurrentAmount(amount: number): Promise<CapitalStatus> {
    return (await api.put("/capital/current", { amount })).data;
  }
}
