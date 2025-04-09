import { defineStore } from "pinia";
import { ref } from "vue";
import despesaService from "@/api/despesaService";
import Despesa from "@/types/Despesa";

export const useDespesaStore = defineStore("despesa", () => {
  const despesas = ref<Despesa[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getDespesas(): Promise<Despesa[]> {
    loading.value = true;
    error.value = null;

    try {
      despesas.value = await despesaService.getDespesas();
      return despesas.value;
    } catch (err) {
      console.error("Erro ao buscar despesas:", err);
      error.value = "Falha ao carregar despesas";
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function getDespesaByDate(date: Date) {
    loading.value = true;
    error.value = null;

    try {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const dateStr = `${day}-${month}-${year}`;

      return await despesaService.getDespesaByDate(dateStr);
    } catch (err) {
      console.error("Erro ao buscar despesas por data:", err);
      error.value = "Falha ao carregar despesas para esta data";
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function addDespesa(despesa: Despesa) {
    loading.value = true;
    error.value = null;

    try {
      const newDespesa = await despesaService.addDespesa(despesa);
      await getDespesas(); // Atualizar a lista após adicionar
      return newDespesa;
    } catch (err) {
      console.error("Erro ao adicionar despesa:", err);
      error.value = "Falha ao salvar a despesa";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateDespesa(id: number, despesa: Despesa) {
    loading.value = true;
    error.value = null;

    try {
      // Implementar método updateDespesa no despesaService
      const updated = await despesaService.updateDespesa(id);
      await getDespesas(); // Atualizar a lista após modificar
      return updated;
    } catch (err) {
      console.error("Erro ao atualizar despesa:", err);
      error.value = "Falha ao atualizar a despesa";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteDespesa(id: number) {
    loading.value = true;
    error.value = null;

    try {
      await despesaService.deleteDespesa(id);
      await getDespesas(); // Atualizar a lista após deletar
    } catch (err) {
      console.error("Erro ao excluir despesa:", err);
      error.value = "Falha ao excluir a despesa";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    despesas,
    loading,
    error,
    getDespesas,
    getDespesaByDate,
    addDespesa,
    updateDespesa,
    deleteDespesa
  };
});
