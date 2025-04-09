import Meta from "@/types/Meta";
import api from ".";

export default {
  async getMeta() {
    return (await api.get("/meta")).data;
  },

  async updateMeta(meta: Meta) {
    return (await api.put("/meta")).data;
  },

  async incrementMeta(value: number) {
    return (await api.post("/meta/add", value)).data;
  },

  async subtractMeta(value: number) {
    return (await api.post("/meta/subtract", value)).data;
  }
}
