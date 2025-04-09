<template>
  <div class="container py-4 sm:py-6 md:py-8 mx-auto">
    <div class="grid gap-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p class="text-gray-500 text-sm sm:text-base">
          Bem-vindo ao Painel de Controle do Comitê
        </p>
      </div>

      <!-- Cards de resumo -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Caixa Inicial</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="text-xl sm:text-2xl font-bold text-gray-400">
              Carregando...
            </div>
            <div v-else class="text-xl sm:text-2xl font-bold text-blue-600">
              R$ {{ formatCurrency(capitalStore.initialAmount || 0) }}
            </div>
            <p class="text-xs text-gray-500 mt-1">Valor inicial definido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="text-xl sm:text-2xl font-bold text-gray-400">
              Carregando...
            </div>
            <div v-else class="text-xl sm:text-2xl font-bold text-emerald-600">
              R$ {{ formatCurrency(incomeTotal || 0) }}
            </div>
            <p class="text-xs text-gray-500 mt-1">Total de vendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="text-xl sm:text-2xl font-bold text-gray-400">
              Carregando...
            </div>
            <div v-else class="text-xl sm:text-2xl font-bold text-red-600">
              R$ {{ formatCurrency(expenseTotal || 0) }}
            </div>
            <p class="text-xs text-gray-500 mt-1">Total de gastos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="text-xl sm:text-2xl font-bold text-gray-400">
              Carregando...
            </div>
            <div v-else class="text-xl sm:text-2xl font-bold"
                 :class="currentBalance >= 0 ? 'text-emerald-600' : 'text-red-600'">
              R$ {{ formatCurrency(currentBalance || 0) }}
            </div>
            <p class="text-xs text-gray-500 mt-1">Caixa + Receitas - Despesas</p>
          </CardContent>
        </Card>
      </div>

      <!-- Calendário de vendas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vendas por Dia</CardTitle>
            <CardDescription>Segunda a sexta, gerencie suas vendas diárias</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="flex justify-center py-6">
              <Loader2 class="h-6 w-6 animate-spin text-gray-400" />
            </div>
            <DayCarousel
              v-else
              :days="businessDays"
              @day-click="openDayModal"
              :is-disabled="isDateDisabled"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Mês</CardTitle>
            <CardDescription>{{ formatDate(new Date(), 'MMMM yyyy') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="flex justify-center py-6">
              <Loader2 class="h-6 w-6 animate-spin text-gray-400" />
            </div>

            <div v-else-if="error" class="text-center py-4 text-sm text-red-500">
              {{ error }}
            </div>

            <div v-else class="space-y-4">
              <div class="flex justify-between">
                <span>Vendas no mês:</span>
                <span class="font-medium">{{ salesCount }}</span>
              </div>
              <div class="flex justify-between">
                <span>Dias com vendas:</span>
                <span class="font-medium">{{ salesDaysCount }}</span>
              </div>
              <div class="flex justify-between">
                <span>Vendas em trotes:</span>
                <span class="font-medium">{{ troteSalesCount }}</span>
              </div>
              <div class="flex justify-between">
                <span>Produto mais vendido:</span>
                <span class="font-medium">{{ bestSellingItem || 'Nenhum' }}</span>
              </div>

              <!-- Adicionar botão para relatório detalhado -->
              <div class="mt-4 pt-2 border-t border-gray-100">
                <Button variant="outline" size="sm" class="w-full" as-child>
                  <router-link to="/relatorios">
                    <BarChart2 class="h-4 w-4 mr-2" />
                    <span>Ver relatório detalhado</span>
                  </router-link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Modais -->
    <DayModal
      v-if="selectedDay"
      :date="selectedDay"
      :is-open="isDayModalOpen"
      @update:is-open="isDayModalOpen = $event"
      @save="handleSaveVenda"
    />
    <InitialCapitalModal @close="fetchCapitalData" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { format, addDays, subDays, startOfMonth, endOfMonth, isWeekend, isSameMonth, startOfWeek, addWeeks, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart2, Loader2 } from 'lucide-vue-next';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DayCarousel from '@/components/DayCarousel.vue';
import DayModal from '@/components/DayModal.vue';
import InitialCapitalModal from '@/components/InitialCapitalModal.vue';

import { useCapitalStore } from '@/stores/capital';
import { useVendaStore } from '@/stores/vendas';
import api from "@/api";

export default defineComponent({
  name: 'DashboardView',
  components: {
    Card, CardContent, CardHeader, CardTitle, CardDescription,
    Button, DayCarousel, DayModal, InitialCapitalModal, BarChart2,
    Loader2
  },
  setup() {
    const capitalStore = useCapitalStore();
    const vendaStore = useVendaStore();
    const despesaStore = useDespesaStore();

    // Estado para os modais
    const selectedDay = ref<Date | null>(null);
    const isDayModalOpen = ref(false);

    // Estado para dados
    const incomeTotal = ref(0);
    const expenseTotal = ref(0);
    const salesCount = ref(0);
    const salesDaysCount = ref(0);
    const troteSalesCount = ref(0);
    const bestSellingItem = ref('');
    const loading = ref(true);
    const error = ref<string | null>(null);

    // Criar apenas dias úteis - segunda a sexta para os próximos 3 meses
    const businessDays = computed(() => {
      const today = new Date();
      const result: Date[] = [];

      // Data limite em 3 meses a partir de hoje
      const endDate = addDays(today, 90);

      // Começando de hoje, gerar dias úteis até o limite
      let current = new Date(today);
      while (current <= endDate) {
        if (!isWeekend(current)) {
          result.push(new Date(current));
        }
        current = addDays(current, 1);
      }

      return result;
    });

    const currentBalance = ref(0);

    // Observadores de dados para atualização dinâmica
    watch(
      () => capitalStore.initialAmount,
      () => {
        // Recalcular saldo quando o capital inicial mudar
        currentBalance.value = calculateCurrentBalance();
      }
    );

    watch(
      () => capitalStore.currentAmount,
      () => {
        // Recalcular saldo quando o capital atual mudar
        currentBalance.value = calculateCurrentBalance();
      }
    );

    const calculateCurrentBalance = () => {
      return capitalStore.initialAmount + incomeTotal.value - expenseTotal.value;
    };

    // Métodos
    const openDayModal = (day: Date) => {
      selectedDay.value = day;
      isDayModalOpen.value = true;
    };

    const isDateDisabled = (day: Date) => {
      const today = new Date();
      return isAfter(day, today);
    };

    const formatDate = (date: Date, formatStr: string): string => {
      return format(date, formatStr, { locale: ptBR });
    };

    const formatCurrency = (value: number): string => {
      if (value === undefined || value === null) return '0,00';
      return value.toFixed(2).replace('.', ',');
    };

    const fetchCapitalData = async () => {
      loading.value = true;
      try {
        await capitalStore.getCapitalStatus();
        currentBalance.value = calculateCurrentBalance();
      } catch (error) {
        console.error('Erro ao buscar dados do capital:', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchSummaryData = async () => {
      loading.value = true;
      error.value = null;

      try {
        // Buscar dados de receitas (vendas)
        const vendas = await vendaStore.getVendas();

        // Filtrar apenas vendas do mês atual
        const today = new Date();
        const currentMonthVendas = vendas.filter(venda => {
          const vendaDate = new Date(venda.date.split('/').reverse().join('-'));
          return isSameMonth(vendaDate, today);
        });

        // Calcular totais de vendas
        incomeTotal.value = currentMonthVendas.reduce((total, venda) => total + venda.totalPrice, 0);
        salesCount.value = currentMonthVendas.length;

        // Contar dias únicos com vendas
        const uniqueDays = new Set(currentMonthVendas.map(venda => venda.date.split('/')[0]));
        salesDaysCount.value = uniqueDays.size;

        // Buscar dados de despesas
        await despesaStore.getDespesas();
        const allDespesas = despesaStore.despesas;

        // Filtrar apenas despesas do mês atual
        const currentMonthDespesas = allDespesas.filter(despesa => {
          const despesaDate = new Date(despesa.date);
          return isSameMonth(despesaDate, today);
        });

        // Calcular total de despesas
        expenseTotal.value = currentMonthDespesas.reduce((total, despesa) => total + despesa.totalCost, 0);

        // Contar vendas em dias de trote
        const troteSales = currentMonthVendas.filter(venda => venda.notes && venda.notes.includes("Trote"));
        troteSalesCount.value = troteSales.length;

        // Encontrar item mais vendido
        const itemCounts: Record<string, { count: number, name: string }> = {};

        // Mapear os tipos de item para nomes amigáveis
        const itemTypeNames: Record<string, string> = {
          "REFRI_COPO": "Refri (copo)",
          "REFRI_GARRAFA": "Refri (garrafa)",
          "PICOLE": "Picolé",
          "CARTELA_BINGO": "Cartela de Bingo",
          "CORREIO_ELEGANTE": "Correio Elegante",
          "OUTROS": "Outros"
        };

        // Contar quantidade vendida por tipo de item
        currentMonthVendas.forEach(venda => {
          const itemType = venda.itemType;
          const name = itemTypeNames[itemType] || itemType;

          if (!itemCounts[itemType]) {
            itemCounts[itemType] = { count: 0, name };
          }

          itemCounts[itemType].count += venda.quantity;
        });

        // Encontrar o item mais vendido
        let maxCount = 0;
        let mostSoldItem = '';

        Object.values(itemCounts).forEach(item => {
          if (item.count > maxCount) {
            maxCount = item.count;
            mostSoldItem = item.name;
          }
        });

        bestSellingItem.value = mostSoldItem;

        // Recalcular saldo atual após atualizar receitas e despesas
        currentBalance.value = calculateCurrentBalance();

      } catch (err) {
        console.error('Erro ao buscar dados de resumo:', err);
        error.value = 'Falha ao carregar dados de resumo';
      } finally {
        loading.value = false;
      }
    };

    const handleSaveVenda = () => {
      fetchSummaryData(); // Atualiza os dados após salvar uma nova venda
    };

    // Inicialização
    onMounted(async () => {
      loading.value = true;
      try {
        await fetchCapitalData();
        await fetchSummaryData();
      } catch (err) {
        console.error("Erro na inicialização:", err);
        error.value = "Erro ao carregar dados iniciais";
      } finally {
        loading.value = false;
      }
    });

    return {
      businessDays,
      selectedDay,
      isDayModalOpen,
      capitalStore,
      incomeTotal,
      expenseTotal,
      currentBalance,
      salesCount,
      salesDaysCount,
      troteSalesCount,
      bestSellingItem,
      loading,
      error,
      openDayModal,
      isDateDisabled,
      formatDate,
      formatCurrency,
      fetchCapitalData,
      handleSaveVenda,
      calculateCurrentBalance
    };
  }
});
</script>
