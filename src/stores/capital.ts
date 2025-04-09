import { defineStore } from 'pinia';
import { ref } from 'vue';
import capitalService from '@/api/capitalService';
import type { CapitalStatus } from '@/api/capitalService';

export const useCapitalStore = defineStore('capital', () => {
  const initialAmount = ref<number>(0);
  const currentAmount = ref<number>(0);
  const totalAmount = ref<number>(0);
  const initialSetted = ref<boolean>(false);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const getCapitalStatus = async (): Promise<CapitalStatus | null> => {
    loading.value = true;
    error.value = null;

    try {
      const capital = await capitalService.getCapitalStatus();

      initialAmount.value = capital.initialAmount;
      currentAmount.value = capital.currentAmount;
      totalAmount.value = capital.totalAmount;
      initialSetted.value = capital.initialSetted;

      return capital;
    } catch (err) {
      console.error('Erro ao buscar capital:', err);
      error.value = 'Erro ao buscar dados do capital.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const setInitialAmount = async (amount: number): Promise<CapitalStatus | null> => {
    loading.value = true;
    error.value = null;

    try {
      const capital = await capitalService.setInitialAmount(amount);

      initialAmount.value = capital.initialAmount;
      currentAmount.value = capital.currentAmount;
      totalAmount.value = capital.totalAmount;
      initialSetted.value = capital.initialSetted;

      return capital;
    } catch (err) {
      console.error('Erro ao definir capital inicial:', err);
      error.value = 'Erro ao definir o capital inicial.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateCurrentAmount = async (amount: number): Promise<CapitalStatus | null> => {
    loading.value = true;
    error.value = null;

    try {
      const capital = await capitalService.updateCurrentAmount(amount);

      initialAmount.value = capital.initialAmount;
      currentAmount.value = capital.currentAmount;
      totalAmount.value = capital.totalAmount;

      return capital;
    } catch (err) {
      console.error('Erro ao atualizar capital atual:', err);
      error.value = 'Erro ao atualizar o capital atual.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    initialAmount,
    currentAmount,
    totalAmount,
    initialSetted,
    error,
    loading,
    getCapitalStatus,
    setInitialAmount,
    updateCurrentAmount
  };
});
