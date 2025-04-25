export interface BankStatement {
  id?: string;
  period: string; // Formato: 'MM/YYYY' ou 'MM/YYYY-MM/YYYY' para períodos
  amount: number;
  description: string;
  legend: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  attachmentUrl?: string; // URL opcional para anexo (PDF ou imagem)
}

export interface GoalStatus {
  currentAmount: number;
  goalAmount: number;
  percentage: number;
  lastUpdate: Date | string;
}
