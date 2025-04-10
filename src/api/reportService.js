import api from '.';
export default {
    async getReport(params) {
        return (await api.get('/reports', {
            params: params,
        })).data;
    }
};
//# sourceMappingURL=reportService.js.map