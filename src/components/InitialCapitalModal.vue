<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden"
          @click.stop
        >
          <div class="p-4 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg sm:text-xl font-bold">Boas-vindas ao Controle Financeiro</h2>
              <Button variant="ghost" size="icon" @click="closeModal">
                <X class="h-5 w-5" />
                <span class="sr-only">Fechar</span>
              </Button>
            </div>

            <div class="space-y-4">
              <p class="text-sm sm:text-base">Para começarmos a rastrear as finanças do comitê, precisamos do valor inicial do caixa.</p>

              <div class="space-y-2">
                <Label for="initial-amount">Valor inicial (R$)</Label>
                <div class="relative">
                  <DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="initial-amount"
                    type="number"
                    v-model="initialAmount"
                    placeholder="0.00"
                    class="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <Alert v-if="error" variant="destructive">
                <AlertCircle class="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{{ error }}</AlertDescription>
              </Alert>
            </div>
          </div>

          <div class="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-end">
            <Button @click="saveInitialAmount" :disabled="loading">
              <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
              Confirmar e continuar
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { X, DollarSign, Loader2, AlertCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useCapitalStore } from '@/stores/capital';

export default defineComponent({
  name: 'InitialCapitalModal',
  components: {
    X, DollarSign, Loader2, AlertCircle,
    Button, Input, Label, Alert, AlertTitle, AlertDescription
  },
  emits: ['close'],
  setup(_, { emit }) {
    const isOpen = ref(false);
    const initialAmount = ref('');
    const loading = ref(false);
    const error = ref<string | null>(null);
    const capitalStore = useCapitalStore();

    // Verificar se o capital inicial já foi definido
    onMounted(async () => {
      try {
        const capitalStatus = await capitalStore.getCapitalStatus();

        // Só mostra o modal se o capital inicial não tiver sido definido
        if (!capitalStatus.initialSetted) {
          isOpen.value = true;
        }
      } catch (err) {
        console.error('Erro ao verificar status do capital:', err);
      }
    });

    const saveInitialAmount = async () => {
      if (!initialAmount.value || parseFloat(initialAmount.value) < 0) {
        error.value = 'Por favor, insira um valor válido.';
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        await capitalStore.setInitialAmount(parseFloat(initialAmount.value));
        closeModal();
      } catch (err) {
        console.error('Erro ao salvar valor inicial:', err);
        error.value = 'Ocorreu um erro ao salvar o valor. Tente novamente.';
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      isOpen.value = false;
      emit('close');
    };

    return {
      isOpen,
      initialAmount,
      loading,
      error,
      saveInitialAmount,
      closeModal
    };
  }
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
