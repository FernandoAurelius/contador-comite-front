import api from ".";

export default {
  async setInitialValue(value: number) {
    return api.post("/capital/initial", { value })
  }
}
