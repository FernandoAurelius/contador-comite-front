import metaService from "@/api/metaService";
import Meta from "@/types/Meta";
import { defineStore } from "pinia";

export const useMetaStore = defineStore("meta", {
  state: () => ({
    meta: {} as Meta
  }),
  actions: {
    async getMeta() {
      this.meta = await metaService.getMeta();
      return this.meta;
    },
    async updateMeta(meta: Meta) {
      this.meta = await metaService.updateMeta(meta);
      return this.meta;
    },
    async incrementMeta(value: number) {
      this.meta = await metaService.incrementMeta(value);
      return this.meta;
    },
    async subtractMeta(value: number) {
      this.meta = await metaService.subtractMeta(value);
      return this.meta;
    }
  }
});
