<template>
  <Card class="w-full shadow-md">
    <CardHeader class="pb-2">
      <CardTitle class="text-xl">Meta de Arrecadação</CardTitle>
      <CardDescription>Acompanhe o progresso da nossa meta financeira</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="flex justify-center items-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
        <span class="ml-2">Carregando...</span>
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center justify-between text-sm">
          <div>
            <span class="block text-gray-500">Arrecadado</span>
            <span class="font-semibold text-lg text-emerald-600">
              R$ {{ formatCurrency(meta.currentValue) }}
            </span>
          </div>

          <div class="text-right">
            <span class="block text-gray-500">Meta</span>
            <span class="font-semibold text-lg">
              R$ {{ formatCurrency(meta.goalValue) }}
            </span>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium">{{ calcularPorcentagem().toFixed(1) }}% concluído</span>
            <span class="text-xs font-medium">
              Falta: R$ {{ formatCurrency(meta.goalValue - meta.currentValue) }}
            </span>
          </div>
          <Progress :value="calcularPorcentagem()" class="h-2.5" />
        </div>

        <p class="text-xs text-gray-500 text-right mt-2">
          Última atualização: {{ formatDate(meta.startDate) }}
        </p>

        <p v-if="meta.description" class="text-xs mt-2 text-gray-600">
          {{ meta.description }}
        </p>

        <div v-if="meta.status !== 'ATIVA'"
             :class="[
               'text-xs font-medium px-2 py-1 rounded-full text-white inline-block mt-1',
               meta.status === 'CONCLUIDA' ? 'bg-emerald-500' : 'bg-gray-500'
             ]">
          {{ meta.status === 'CONCLUIDA' ? 'Meta concluída' : 'Meta cancelada' }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import metaService from '@/api/metaService';
import Meta from '@/types/Meta';

export default defineComponent({
  name: 'PublicGoalProgress',
  components: {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Progress
  },
  setup() {
    const loading = ref(true);
    const meta = ref<Meta>({
      id: 0,
      description: "",
      goalValue: 100000,
      currentValue: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: "ATIVA"
    });

    onMounted(async () => {
      try {
        console.log('Carregando dados da meta...');
        const metaData = await metaService.getMeta();
        meta.value = metaData;
        console.log('Dados da meta carregados:', meta.value);
      } catch (error) {
        console.error('Erro ao carregar dados da meta:', error);
      } finally {
        loading.value = false;
      }
    });

    const calcularPorcentagem = (): number => {
      if (meta.value.goalValue === 0) return 0;
      return (meta.value.currentValue / meta.value.goalValue) * 100;
    };

    const formatCurrency = (value: number): string => {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (date: string): string => {
      if (!date) return '';
      const dateObj = new Date(date);
      return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    return {
      loading,
      meta,
      calcularPorcentagem,
      formatCurrency,
      formatDate
    };
  }
});
</script>
