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
            <div class="text-2xl font-bold text-red-600">R$ {{ formatCurrency(report.totalExpenses) }}</div>
            <p class="text-xs text-gray-500 mt-1">{{ getReportPeriodText() }}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold" :class="report.balance >= 0 ? 'text-emerald-600' : 'text-red-600'">
              R$ {{ formatCurrency(report.balance) }}
            </div>
            <p class="text-xs text-gray-500 mt-1">Receitas - Despesas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-500">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-indigo-600">
              {{ report.incomeTransactions + report.expenseTransactions }}
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ report.incomeTransactions }} receitas, {{ report.expenseTransactions }} despesas
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
          <CardContent class="h-80">
            <BarChart
              v-if="comparisonChartData.length > 0"
              :data="comparisonChartData"
              index="category"
              :categories="['value']"
              :colors="['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)']"
              :y-formatter="(tick) => `R$ ${formatCurrency(Number(tick))}`"
            />
            <div v-else class="h-full flex items-center justify-center">
              <p class="text-gray-500 text-sm">Não há dados suficientes para exibir o gráfico</p>
            </div>
          </CardContent>
        </Card>

        <!-- Distribution by Category -->
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>{{ isTroteMode ? 'Categorias de vendas em eventos de trote' : 'Categorias de vendas regulares' }}</CardDescription>
          </CardHeader>
          <CardContent class="h-80">
            <DonutChart
              v-if="categoryChartData.length > 0"
              :data="categoryChartData"
              index="category"
              :category-percs="true"
            />
            <div v-else class="h-full flex items-center justify-center">
              <p class="text-gray-500 text-sm">Não há dados suficientes para exibir o gráfico</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Detailed Transaction Tables -->
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
          <Card>
            <CardContent class="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead class="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="transaction in filteredIncomeTransactions" :key="transaction.id">
                    <TableCell>{{ formatDate(transaction.date) }}</TableCell>
                    <TableCell>
                      <div>
                        {{ transaction.description }}
                        <p v-if="transaction.notes" class="text-xs text-gray-500 mt-1">{{ transaction.notes }}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{{ transaction.category }}</Badge>
                    </TableCell>
                    <TableCell class="text-right font-medium text-emerald-600">R$ {{ formatCurrency(transaction.amount) }}</TableCell>
                  </TableRow>
                  <TableRow v-if="filteredIncomeTransactions.length === 0">
                    <TableCell colspan="4" class="text-center py-4 text-gray-500">
                      Nenhuma receita encontrada para este período
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent class="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead class="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="transaction in filteredExpenseTransactions" :key="transaction.id">
                    <TableCell>{{ formatDate(transaction.date) }}</TableCell>
                    <TableCell>
                      <div>
                        {{ transaction.description }}
                        <p v-if="transaction.notes" class="text-xs text-gray-500 mt-1">{{ transaction.notes }}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{{ transaction.category }}</Badge>
                    </TableCell>
                    <TableCell class="text-right font-medium text-red-600">R$ {{ formatCurrency(transaction.amount) }}</TableCell>
                  </TableRow>
                  <TableRow v-if="filteredExpenseTransactions.length === 0">
                    <TableCell colspan="4" class="text-center py-4 text-gray-500">
                      Nenhuma despesa encontrada para este período
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
  TrendingUp, TrendingDown, FileBarChart
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart } from '@/components/ui/chart-bar';
import { DonutChart } from '@/components/ui/chart-donut';
import axios from 'axios';

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  notes?: string;
}

interface Report {
  period: string;
  trote: boolean;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeTransactions: number;
  expenseTransactions: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  transactions: Transaction[];
}

export default defineComponent({
  name: 'ReportSection',
  components: {
    Search, Calendar, CalendarClock, Loader2, AlertCircle,
    TrendingUp, TrendingDown, FileBarChart,
    Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Tabs, TabsContent, TabsList, TabsTrigger, Badge,
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
    BarChart, DonutChart
  },
  setup() {
    const report = ref<Report | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const searchTerm = ref('');
    const selectedPeriod = ref('monthly');
    const isTroteMode = ref(false);

    const periodOptions = [
      { value: 'daily', label: 'Diário' },
      { value: 'weekly', label: 'Semanal' },
      { value: 'monthly', label: 'Mensal' },
      { value: 'yearly', label: 'Anual' },
    ];

    const toggleTroteMode = () => {
      isTroteMode.value = !isTroteMode.value;
      generateReport();
    };

    const generateReport = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axios.get('/api/reports', {
          params: {
            period: selectedPeriod.value,
            trote: isTroteMode.value
          }
        });

        report.value = response.data;
      } catch (err) {
        console.error('Erro ao carregar relatório:', err);
        error.value = 'Não foi possível carregar os dados do relatório. Por favor, tente novamente.';
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    };

    const formatCurrency = (value: number) => {
      return value.toFixed(2).replace('.', ',');
    };

    const getReportPeriodText = () => {
      if (!report.value) return '';

      switch (selectedPeriod.value) {
        case 'daily': return 'No dia';
        case 'weekly': return 'Na semana';
        case 'monthly': return 'No mês';
        case 'yearly': return 'No ano';
        default: return '';
      }
    };

    const filteredTransactions = computed(() => {
      if (!report.value) return [];

      return report.value.transactions.filter(transaction => {
        const searchLower = searchTerm.value.toLowerCase();
        return transaction.description.toLowerCase().includes(searchLower) ||
               (transaction.notes && transaction.notes.toLowerCase().includes(searchLower)) ||
               transaction.category.toLowerCase().includes(searchLower);
      });
    });

    const filteredIncomeTransactions = computed(() => {
      return filteredTransactions.value.filter(t => t.amount > 0);
    });

    const filteredExpenseTransactions = computed(() => {
      return filteredTransactions.value.filter(t => t.amount < 0);
    });

    const comparisonChartData = computed(() => {
      if (!report.value) return [];

      return [
        { category: 'Receitas', value: report.value.totalIncome },
        { category: 'Despesas', value: Math.abs(report.value.totalExpenses) }
      ];
    });

    const categoryChartData = computed(() => {
      if (!report.value) return [];

      const categories = isTroteMode.value
        ? Object.entries(report.value.incomeByCategory).map(([category, value]) => ({
            category,
            value
          }))
        : Object.entries(report.value.expensesByCategory).map(([category, value]) => ({
            category,
            value: Math.abs(value)
          }));

      return categories.filter(item => item.value > 0);
    });

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
      filteredIncomeTransactions,
      filteredExpenseTransactions,
      comparisonChartData,
      categoryChartData
    };
  }
});
</script>

<style scoped>
/* Adicione estilos específicos aqui, se necessário */
</style>
