import api from ".";
export default {
    async getMeta() {
        return (await api.get("/meta")).data;
    },
    async updateMeta(meta) {
        return (await api.put("/meta")).data;
    },
    async incrementMeta(value) {
        return (await api.post("/meta/add", value)).data;
    },
    async subtractMeta(value) {
        return (await api.post("/meta/subtract", value)).data;
    }
};
//# sourceMappingURL=metaService.js.map