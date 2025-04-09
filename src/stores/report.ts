import { defineStore } from 'pinia';
import reportService from '@/api/reportService';

interface ReportState {
  reportData: any | null;
  loading: boolean;
  error: string | null;
}

export const useReportStore = defineStore('report', {
  state: (): ReportState => ({
    reportData: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchReport(period: string, trote: boolean) {
      this.loading = true;
      this.error = null;

      try {
        this.reportData = await reportService.getReport({ period, trote });
        return this.reportData;
      } catch (err) {
        console.error('Erro ao buscar relatório:', err);
        this.error = 'Falha ao carregar o relatório. Por favor, tente novamente.';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    clearReport() {
      this.reportData = null;
    }
  },
  getters: {
    hasReport: (state) => !!state.reportData,
    isLoading: (state) => state.loading
  }
});
