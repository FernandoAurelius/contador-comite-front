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
              R$ {{ formatCurrency(goalStatus.currentAmount) }}
            </span>
          </div>

          <div class="text-right">
            <span class="block text-gray-500">Meta</span>
            <span class="font-semibold text-lg">
              R$ {{ formatCurrency(goalStatus.goalAmount) }}
            </span>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium">{{ goalStatus.percentage.toFixed(1) }}% concluído</span>
            <span class="text-xs font-medium">
              Falta: R$ {{ formatCurrency(goalStatus.goalAmount - goalStatus.currentAmount) }}
            </span>
          </div>
          <Progress :value="goalStatus.percentage" class="h-2.5" />
        </div>

        <p class="text-xs text-gray-500 text-right mt-2">
          Última atualização: {{ formatDate(goalStatus.lastUpdate) }}
        </p>
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
import bankStatementService from '@/services/bankStatementService';
import { GoalStatus } from '@/types/BankStatement';

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
    const goalStatus = ref<GoalStatus>({
      currentAmount: 0,
      goalAmount: 100000,
      percentage: 0,
      lastUpdate: new Date()
    });

    onMounted(async () => {
      try {
        goalStatus.value = await bankStatementService.getGoalStatus();
      } catch (error) {
        console.error('Erro ao carregar dados da meta:', error);
      } finally {
        loading.value = false;
      }
    });

    const formatCurrency = (value: number): string => {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (date: Date | string): string => {
      if (!date) return '';
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    return {
      loading,
      goalStatus,
      formatCurrency,
      formatDate
    };
  }
});
</script>
