import { defineStore } from 'pinia';
import reportService from '@/api/reportService';
import { toast } from 'vue-sonner';

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
        // Adicionar tempo de log para debug
        console.log(`[${new Date().toISOString()}] Buscando relatório: period=${period}, trote=${trote}`);

        this.reportData = await reportService.getReport({ period, trote });
        console.log(`[${new Date().toISOString()}] Relatório obtido com sucesso:`, this.reportData);
        return this.reportData;
      } catch (err: any) {
        console.error('[Report Store] Erro ao buscar relatório:', err);

        // Verificar se é erro de autenticação e mostrar mensagem específica
        if (err.response?.status === 401) {
          this.error = 'Sua sessão expirou ou você não está autenticado. Faça login novamente.';
        } else {
          this.error = err.response?.data || 'Falha ao carregar o relatório. Por favor, tente novamente.';
        }

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
