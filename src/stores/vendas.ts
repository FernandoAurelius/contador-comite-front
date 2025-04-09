import vendaService from "@/api/vendaService";
import Venda from "@/types/Venda";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useVendaStore = defineStore("venda", () => {
  const vendas = ref<Venda[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getVendas(): Promise<Venda[]> {
    loading.value = true;
    error.value = null;

    try {
      vendas.value = await vendaService.getVendas();
      return vendas.value;
    } catch (err) {
      console.error("Erro ao buscar vendas:", err);
      error.value = "Falha ao carregar vendas";
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function getVendaByDate(dateStr: string): Promise<Venda[]> {
    loading.value = true;
    error.value = null;

    try {
      const result = await vendaService.getVendaByDate(dateStr);
      return Array.isArray(result) ? result : [];
    } catch (err) {
      console.error("Erro ao buscar vendas por data:", err);
      error.value = "Falha ao carregar vendas para esta data";
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function addVenda(venda: Venda): Promise<Venda> {
    loading.value = true;
    error.value = null;

    try {
      const newVenda = await vendaService.addVenda(venda);
      await getVendas(); // Atualizar a lista após adicionar
      return newVenda;
    } catch (err) {
      console.error("Erro ao adicionar venda:", err);
      error.value = "Falha ao salvar a venda";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateVenda(id: number, venda: Venda): Promise<Venda> {
    loading.value = true;
    error.value = null;

    try {
      const updated = await vendaService.updateVenda(id, venda);
      await getVendas(); // Atualizar a lista após modificar
      return updated;
    } catch (err) {
      console.error("Erro ao atualizar venda:", err);
      error.value = "Falha ao atualizar a venda";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteVenda(id: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      await vendaService.deleteVenda(id);
      await getVendas(); // Atualizar a lista após deletar
    } catch (err) {
      console.error("Erro ao excluir venda:", err);
      error.value = "Falha ao excluir a venda";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    vendas,
    loading,
    error,
    getVendas,
    getVendaByDate,
    addVenda,
    updateVenda,
    deleteVenda
  };
});
