import api from ".";
export default {
    async getCapital() {
        console.log("Capital: ", (await api.get("/capital")).data);
        return (await api.get("/capital")).data;
    },
    async setInitialAmount(amount) {
        return (await api.put("/capital/initial", amount)).data;
    },
    async addCapital(amount) {
        return (await api.put("/capital/add", amount)).data;
    },
    async removeCapital(amount) {
        return (await api.put("/capital/subtract", amount)).data;
    }
};
//# sourceMappingURL=capitalService.js.map