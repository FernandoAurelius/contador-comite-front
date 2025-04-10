<template>
  <div class="space-y-6">
    <!-- Cabeçalho com filtros e botões -->
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <!-- Busca -->
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Buscar transações..."
          v-model="searchTerm"
          class="pl-10"
        />
      </div>

      <!-- Filtros de período e tipo -->
      <div class="flex gap-2">
        <Select v-model="selectedPeriod">
          <SelectTrigger class="w-[150px]">
            <SelectValue :placeholder="periodOptions.find(p => p.value === selectedPeriod)?.label || 'Período'" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Período</SelectLabel>
              <SelectItem v-for="option in periodOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          :variant="isTroteMode ? 'default' : 'outline'"
          class="gap-2"
          @click="toggleTroteMode"
        >
          <CalendarClock v-if="isTroteMode" class="h-4 w-4" />
          <Calendar v-else class="h-4 w-4" />
          {{ isTroteMode ? 'Trote' : 'Regular' }}
        </Button>

        <Button @click="generateReport" class="flex items-center gap-2">
          <FileBarChart class="h-4 w-4" />
          <span>Gerar Relatório</span>
        </Button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-10">
      <div role="status">
        <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
        <span class="sr-only">Carregando...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12 bg-red-50 rounded-lg">
      <AlertCircle class="h-12 w-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-900 mb-1">Erro ao carregar relatório</h3>
      <p class="text-red-500 mb-4">{{ error }}</p>
      <Button variant="outline" @click="generateReport">
        Tentar novamente
      </Button>
    </div>

    <!-- Content when report is available -->
    <div v-else-if="report" class="space-y-6">
      <!-- Summary cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Total de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-emerald-600">R$ {{ formatCurrency(report.totalIncome) }}</div>
            <p class="text-xs text-gray-500 mt-1">{{ getReportPeriodText() }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Total de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-red-600">R$ {{ formatCurrency(report.totalCosts) }}</div>
            <p class="text-xs text-gray-500 mt-1">{{ getReportPeriodText() }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold" :class="getSaldoClass()">
              R$ {{ formatCurrency(calculateBalance()) }}
            </div>
            <p class="text-xs text-gray-500 mt-1">Receitas - Despesas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Lucro</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-indigo-600">
              R$ {{ formatCurrency(report.totalProfit) }}
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Lucro sobre vendas
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Receitas vs Despesas -->
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Comparativo entre receitas e despesas no período</CardDescription>
          </CardHeader>
          <CardContent class="h-80 relative">
            <div class="h-full w-full">
              <BarChart
                v-if="comparisonChartData.length > 0"
                :data="comparisonChartData"
                :items="comparisonChartData"
                index="category"
                :categories="['value']"
                :colors="['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)']"
                :y-formatter="(tick) => `R$ ${formatCurrency(Number(tick))}`"
                class="h-full w-full"
              />
              <div v-else class="h-full flex items-center justify-center">
                <p class="text-gray-500 text-sm">Não há dados suficientes para exibir o gráfico</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Distribution by Category -->
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>{{ isTroteMode ? 'Categorias de vendas em eventos de trote' : 'Categorias de vendas por produto' }}</CardDescription>
          </CardHeader>
          <CardContent class="h-80 relative p-0">
            <div class="h-full flex flex-col pt-0">
              <!-- Legendas movidas para o topo -->
              <div v-if="categoryChartData.length > 0" class="flex-none px-4 pt-2">
                <div class="flex flex-wrap justify-center gap-2 mb-2">
                  <div
                    v-for="(item, index) in categoryChartData"
                    :key="`legend-${index}`"
                    class="flex items-center text-xs bg-gray-50 rounded-md px-2 py-1 border border-gray-100"
                  >
                    <div
                      class="w-2 h-2 rounded-sm mr-1"
                      :style="{ backgroundColor: getChartColor(index) }"
                    ></div>
                    <span class="font-medium">{{ item.name }}</span>
                    <span class="text-gray-500 ml-1">
                      ({{ formatCurrency(item.value) }}{{ item.value ? ` - ${((item.value / getTotalForCategory()) * 100).toFixed(1)}%` : '' }})
                    </span>
                  </div>
                </div>
              </div>

              <!-- Gráfico donut com labels simplificados -->
              <div class="flex-grow px-5 py-5">
                <DonutChart
                  v-if="categoryChartData.length > 0"
                  :data="categoryChartData"
                  :items="categoryChartData"
                  index="category"
                  :categories="['value']"
                  :category-percs="false"
                  :formatter="(value: number) => `R$ ${formatCurrency(value)}`"
                  class="h-full w-full"
                  :legend="false"
                  :show-labels="true"
                />
                <div v-else class="h-full flex items-center justify-center">
                  <p class="text-gray-500 text-sm">Não há dados suficientes para exibir o gráfico</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Detailed Transactions using FinancialItems -->
      <Tabs default-value="income" class="w-full">
        <TabsList>
          <TabsTrigger value="income" class="flex items-center gap-2">
            <TrendingUp class="h-4 w-4" />
            <span>Receitas</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" class="flex items-center gap-2">
            <TrendingDown class="h-4 w-4" />
            <span>Despesas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <div v-if="incomeItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FinancialItem
              v-for="(item, index) in incomeItems"
              :key="index"
              :item="item"
              type="sale"
            />
          </div>
          <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
            <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Nenhuma receita encontrada para este período</p>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div v-if="expenseItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FinancialItem
              v-for="(item, index) in expenseItems"
              :key="index"
              :item="item"
              type="expense"
            />
          </div>
          <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
            <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Nenhuma despesa encontrada para este período</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
      <FileBarChart class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">Nenhum relatório gerado</h3>
      <p class="text-gray-500 mb-4">
        Selecione um período e tipo de evento para gerar um relatório financeiro.
      </p>
      <Button @click="generateReport">
        Gerar Relatório
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Search, Calendar, CalendarClock, Loader2, AlertCircle,
  TrendingUp, TrendingDown, FileBarChart, FileText
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart } from '@/components/ui/chart-bar';
import { DonutChart } from '@/components/ui/chart-donut';
import { useReportStore } from '@/stores/report';
import { toast } from 'vue-sonner';
import FinancialItem from '@/components/FinancialItem.vue';

interface IncomeSummary {
  totalIncome: number;
  copoSum: number;
  copoPercentage: number;
  garrafaSum: number;
  garrafaPercentage: number;
  picoleSum: number;
  picolePercentage: number;
}

interface IncomeProfit {
  totalIncome: number;
  copoSum: number;
  copoPercentage: number;
  garrafaSum: number;
  garrafaPercentage: number;
  picoleSum: number;
  picolePercentage: number;
}

interface TroteSummary {
  cartelaSum: number;
  cartelaPercentage: number;
  correioSum: number;
  correioPercentage: number;
  cadeiaSum: number;
  cadeiaPercentage: number;
  outroSum: number;
  outroPercentage: number;
}

interface CostItem {
  item: string;
  totalCost: number;
}

interface Report {
  totalIncome: number;
  totalProfit: number;
  totalCosts: number;
  income: IncomeSummary;
  profit: IncomeProfit;
  incomeTrote: TroteSummary | null;
  profitTrote: TroteSummary | null;
  costs: CostItem[];
}

export default defineComponent({
  name: 'ReportSection',
  components: {
    Search, Calendar, CalendarClock, Loader2, AlertCircle,
    TrendingUp, TrendingDown, FileBarChart, FileText,
    Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription,
    Tabs, TabsContent, TabsList, TabsTrigger, Badge,
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
    BarChart, DonutChart, FinancialItem
  },
  setup() {
    const reportStore = useReportStore();
    const report = ref<Report | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const searchTerm = ref('');
    const selectedPeriod = ref('diario');
    const isTroteMode = ref(false);

    const periodOptions = [
      { value: 'diario', label: 'Diário' },
      { value: 'semanal', label: 'Semanal' },
      { value: 'mensal', label: 'Mensal' },
    ];

    const toggleTroteMode = () => {
      isTroteMode.value = !isTroteMode.value;
      generateReport();
    };

    const generateReport = async () => {
      loading.value = true;
      error.value = null;

      try {
        const data = await reportStore.fetchReport(selectedPeriod.value, isTroteMode.value);
        report.value = data;
        toast.success("Relatório gerado com sucesso!");
      } catch (err: any) {
        console.error('Erro ao carregar relatório:', err);
        error.value = err.response?.data || 'Não foi possível carregar os dados do relatório. Por favor, tente novamente.';
        toast.error("Falha ao gerar relatório", {
          description: `${error.value}`
        });
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return format(date, 'dd/MM/yyyy', { locale: ptBR });
      } catch (e) {
        return 'Data inválida';
      }
    };

    // Versão segura do formatCurrency
    const formatCurrency = (value: number | null | undefined) => {
      // Se o valor for null, undefined ou NaN, retorna zero formatado
      if (value === null || value === undefined || isNaN(value)) {
        return '0,00';
      }
      return value.toFixed(2).replace('.', ',');
    };

    const getReportPeriodText = () => {
      if (!report.value) return '';

      switch (selectedPeriod.value) {
        case 'diario': return 'No dia';
        case 'semanal': return 'Na semana';
        case 'mensal': return 'No mês';
        default: return '';
      }
    };

    // Calcular o saldo (receitas - despesas)
    const calculateBalance = () => {
      if (!report.value) return 0;
      return report.value.totalIncome - report.value.totalCosts;
    };

    // Determinar a classe de cor para o saldo
    const getSaldoClass = () => {
      if (!report.value) return '';
      const balance = calculateBalance();
      return balance >= 0 ? 'text-emerald-600' : 'text-red-600';
    };

    // Dados para o gráfico de comparação com formato correto
    const comparisonChartData = computed(() => {
      if (!report.value) return [];

      return [
        { category: 'Receitas', name: 'Receitas', value: report.value.totalIncome },
        { category: 'Despesas', name: 'Despesas', value: Math.abs(report.value.totalCosts) }
      ];
    });

    // Dados para o gráfico de categorias com formato correto para DonutChart
    const categoryChartData = computed(() => {
      if (!report.value) return [];

      if (isTroteMode.value && report.value.incomeTrote) {
        // Lógica para eventos de trote
        const troteSummary = report.value.incomeTrote;

        // Gerando dados para o gráfico de trote
        return [
          { category: 'Cartela Bingo', name: 'Cartela Bingo', value: troteSummary.cartelaSum || 0 },
          { category: 'Correio Elegante', name: 'Correio Elegante', value: troteSummary.correioSum || 0 },
          { category: 'Cadeia do Amor', name: 'Cadeia do Amor', value: troteSummary.cadeiaSum || 0 },
          { category: 'Outros', name: 'Outros', value: troteSummary.outroSum || 0 }
        ].filter(item => item.value > 0);
      } else {
        // Lógica para vendas regulares
        const income = report.value.income;
        if (!income) return [];

        return [
          { category: 'Refri (copo)', name: 'Refri (copo)', value: income.copoSum || 0 },
          { category: 'Refri (garrafa)', name: 'Refri (garrafa)', value: income.garrafaSum || 0 },
          { category: 'Picolé', name: 'Picolé', value: income.picoleSum || 0 }
        ].filter(item => item.value > 0);
      }
    });

    // Transformar os dados de receitas para o formato do FinancialItem
    const incomeItems = computed(() => {
      if (!report.value) return [];

      const currentDate = formatDate(new Date().toISOString());
      const items = [];

      if (isTroteMode.value && report.value.incomeTrote) {
        // Items para trote
        const troteSummary = report.value.incomeTrote;

        // Cartela Bingo
        if (troteSummary.cartelaSum > 0) {
          items.push({
            id: 'cartela',
            date: currentDate,
            itemType: 'CARTELA_BINGO',
            quantity: Math.round(troteSummary.cartelaSum / 2.5), // Estimando quantidades
            unitPrice: 2.5,
            totalPrice: troteSummary.cartelaSum,
            notes: 'Resumo do período (trote)'
          });
        }

        // Correio Elegante
        if (troteSummary.correioSum > 0) {
          items.push({
            id: 'correio',
            date: currentDate,
            itemType: 'CORREIO_ELEGANTE',
            quantity: Math.round(troteSummary.correioSum / 1.5),
            unitPrice: 1.5,
            totalPrice: troteSummary.correioSum,
            notes: 'Resumo do período (trote)'
          });
        }

        // Cadeia do Amor
        if (troteSummary.cadeiaSum > 0) {
          items.push({
            id: 'cadeia',
            date: currentDate,
            itemType: 'CADEIA_AMOR',
            quantity: Math.round(troteSummary.cadeiaSum / 2),
            unitPrice: 2,
            totalPrice: troteSummary.cadeiaSum,
            notes: 'Resumo do período (trote)'
          });
        }

        // Outros itens de trote
        if (troteSummary.outroSum > 0) {
          items.push({
            id: 'outros_trote',
            date: currentDate,
            itemType: 'OUTROS',
            quantity: 1,
            unitPrice: troteSummary.outroSum,
            totalPrice: troteSummary.outroSum,
            notes: 'Outros itens de trote'
          });
        }
      } else {
        // Items para vendas regulares
        const income = report.value.income;
        if (!income) return [];

        // Refri copo
        if (income.copoSum > 0) {
          items.push({
            id: 'copo',
            date: currentDate,
            itemType: 'REFRI_COPO',
            quantity: Math.round(income.copoSum / 2.5), // Estimando quantidades com base no preço
            unitPrice: 2.5,
            totalPrice: income.copoSum,
            notes: 'Resumo do período'
          });
        }

        // Refri garrafa
        if (income.garrafaSum > 0) {
          items.push({
            id: 'garrafa',
            date: currentDate,
            itemType: 'REFRI_GARRAFA',
            quantity: Math.round(income.garrafaSum / 15),
            unitPrice: 15,
            totalPrice: income.garrafaSum,
            notes: 'Resumo do período'
          });
        }

        // Picolé
        if (income.picoleSum > 0) {
          items.push({
            id: 'picole',
            date: currentDate,
            itemType: 'PICOLE',
            quantity: Math.round(income.picoleSum / 4),
            unitPrice: 4,
            totalPrice: income.picoleSum,
            notes: 'Resumo do período'
          });
        }
      }

      return items;
    });

    // Transformar os dados de despesas para o formato do FinancialItem
    const expenseItems = computed(() => {
      if (!report.value || !report.value.costs || !report.value.costs.length) return [];

      // Data atual como referência
      const currentDate = formatDate(new Date().toISOString());

      return report.value.costs.map((cost, index) => ({
        id: index,
        date: currentDate,
        item: cost.item,
        quantity: 1, // Assumindo que cada item é uma unidade
        unitCost: cost.totalCost,
        totalCost: cost.totalCost,
        notes: 'Resumo do período'
      }));
    });

    // Cores para o gráfico
    const chartColors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Função para obter a cor para cada categoria
    const getChartColor = (index: number) => {
      return chartColors[index % chartColors.length];
    };

    // Função para calcular o total das categorias (para percentuais)
    const getTotalForCategory = () => {
      if (!categoryChartData.value || !categoryChartData.value.length) return 0;
      return categoryChartData.value.reduce((sum, item) => sum + item.value, 0);
    };

    return {
      report,
      loading,
      error,
      searchTerm,
      selectedPeriod,
      isTroteMode,
      periodOptions,
      toggleTroteMode,
      generateReport,
      formatDate,
      formatCurrency,
      getReportPeriodText,
      calculateBalance,
      getSaldoClass,
      comparisonChartData,
      categoryChartData,
      incomeItems,
      expenseItems,
      getChartColor,
      getTotalForCategory
    };
  }
});
</script>

<style scoped>
/* Ajustes para garantir que os gráficos fiquem contidos em seus containers */
.h-80 {
  height: 20rem;
  position: relative;
}

/* Estilo para melhorar a exibição e posicionamento dos gráficos */
:deep(.recharts-responsive-container) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.recharts-wrapper) {
  width: 100% !important;
  height: 100% !important;
  margin: 0 auto !important;
}

/* Melhorar a exibição das legendas */
:deep(.recharts-default-legend) {
  margin-top: 10px !important;
  display: flex !important;
  justify-content: center !important;
}

:deep(.recharts-legend-item) {
  margin: 0 8px !important;
}

:deep(.recharts-legend-item-text) {
  font-size: 0.875rem !important;
  color: #374151 !important;
}

/* Ajustar o tamanho e a cor dos rótulos dos eixos */
:deep(.recharts-cartesian-axis-tick-value) {
  font-size: 0.75rem !important;
  fill: #6B7280 !important;
}

/* Garantir que as barras tenham cores distintas */
:deep(.recharts-bar-rectangle:nth-child(1)) path {
  fill: rgba(16, 185, 129, 0.7) !important;
}

:deep(.recharts-bar-rectangle:nth-child(2)) path {
  fill: rgba(239, 68, 68, 0.7) !important;
}

/* Adicionar um pequeno padding interno nos gráficos */
:deep(.recharts-surface) {
  overflow: visible;
}

/* Estilos específicos para o gráfico Donut */
:deep(.donut-chart-container) {
  margin-top: -20px !important;
  transform: scale(0.85);
}

/* Reduzir o tamanho do SVG para dar mais espaço e centralizar melhor */
:deep(svg) {
  max-height: 220px !important;
}

:deep(.recharts-pie-label-text) {
  font-weight: 500;
  font-size: 0.75rem;
}

:deep(.recharts-sector) {
  stroke: white;
  stroke-width: 1;
}
</style>
