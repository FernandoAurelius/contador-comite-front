import metaService from "@/api/metaService";
import { defineStore } from "pinia";
export const useMetaStore = defineStore("meta", {
    state: () => ({
        meta: {}
    }),
    actions: {
        async getMeta() {
            this.meta = await metaService.getMeta();
            return this.meta;
        },
        async updateMeta(meta) {
            this.meta = await metaService.updateMeta(meta);
            return this.meta;
        },
        async incrementMeta(value) {
            this.meta = await metaService.incrementMeta(value);
            return this.meta;
        },
        async subtractMeta(value) {
            this.meta = await metaService.subtractMeta(value);
            return this.meta;
        }
    }
});
//# sourceMappingURL=meta.js.map