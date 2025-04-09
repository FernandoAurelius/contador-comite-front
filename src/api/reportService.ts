import api from '.';

interface ReportRequestParams {
  period: string;
  trote: boolean;
}

export default {
  async getReport(params: ReportRequestParams) {
    return (await api.get('/api/reports', { params })).data;
  }
}
