<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Extratos Bancários</CardTitle>
        <CardDescription>
          Acompanhe os extratos bancários e a evolução da arrecadação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Filtro de períodos -->
        <div class="mb-6 space-y-2">
          <Label for="periodFilter">Filtrar por período</Label>
          <div class="flex space-x-2">
            <Select id="periodFilter" v-model="selectedPeriod" class="w-full">
              <option value="">Todos os períodos</option>
              <option v-for="period in uniquePeriods" :key="period" :value="period">
                {{ period }}
              </option>
            </Select>
            <Button variant="outline" @click="selectedPeriod = ''">
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- Gráfico -->
        <div class="h-64 mb-6" v-if="statements.length > 0">
          <h3 class="text-sm font-medium mb-2">Evolução da Arrecadação</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart :data="chartData">
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="valor" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span class="ml-2">Carregando extratos...</span>
        </div>

        <div v-else-if="filteredStatements.length === 0" class="py-6 text-center">
          <FileX class="w-12 h-12 mx-auto text-gray-400" />
          <p class="mt-2 text-gray-500">
            {{ selectedPeriod ? `Nenhum extrato encontrado para o período ${selectedPeriod}.` : 'Nenhum extrato disponível.' }}
          </p>
        </div>

        <div v-else>
          <!-- Estatísticas Resumidas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader class="p-4">
                <CardTitle class="text-sm">Total de Lançamentos</CardTitle>
              </CardHeader>
              <CardContent class="p-4 pt-0">
                <p class="text-2xl font-bold">{{ filteredStatements.length }}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="p-4">
                <CardTitle class="text-sm">Total Arrecadado</CardTitle>
              </CardHeader>
              <CardContent class="p-4 pt-0">
                <p class="text-2xl font-bold text-emerald-600">
                  R$ {{ formatCurrency(totalAmount) }}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="p-4">
                <CardTitle class="text-sm">Períodos</CardTitle>
              </CardHeader>
              <CardContent class="p-4 pt-0">
                <p class="text-2xl font-bold">{{ uniquePeriods.length }}</p>
              </CardContent>
            </Card>
          </div>

          <!-- Tabela de Extratos -->
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor (R$)</TableHead>
                  <TableHead class="hidden md:table-cell">Descrição</TableHead>
                  <TableHead>Legenda</TableHead>
                  <TableHead class="hidden md:table-cell">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="statement in filteredStatements" :key="statement.id">
                  <TableCell class="font-medium">{{ statement.period }}</TableCell>
                  <TableCell
                    :class="statement.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'"
                    class="font-medium"
                  >
                    {{ formatCurrency(statement.amount) }}
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    <div class="truncate max-w-[200px]" :title="statement.description">
                      {{ statement.description }}
                    </div>
                  </TableCell>
                  <TableCell>{{ statement.legend }}</TableCell>
                  <TableCell class="hidden md:table-cell">{{ formatDate(statement.createdAt) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileX, X } from 'lucide-vue-next';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import bankStatementService from '@/services/bankStatementService';
import { BankStatement } from '@/types/BankStatement';

export default defineComponent({
  name: 'PublicBankStatements',
  components: {
    Card, CardContent, CardHeader, CardTitle, CardDescription,
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
    Select, Label, Button,
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    FileX, X
  },
  setup() {
    const loading = ref(true);
    const statements = ref<BankStatement[]>([]);
    const selectedPeriod = ref('');

    onMounted(async () => {
      try {
        statements.value = await bankStatementService.getStatements();
      } catch (error) {
        console.error('Erro ao carregar extratos:', error);
      } finally {
        loading.value = false;
      }
    });

    const uniquePeriods = computed(() => {
      const periods = new Set<string>();
      statements.value.forEach(statement => {
        periods.add(statement.period);
      });
      return Array.from(periods).sort();
    });

    const filteredStatements = computed(() => {
      if (!selectedPeriod.value) {
        return statements.value;
      }
      return statements.value.filter(s => s.period === selectedPeriod.value);
    });

    const totalAmount = computed(() => {
      return filteredStatements.value.reduce((sum, statement) => sum + statement.amount, 0);
    });

    const chartData = computed(() => {
      // Agregar dados por período para o gráfico
      const periodMap = new Map<string, number>();

      statements.value.forEach(statement => {
        const currentValue = periodMap.get(statement.period) || 0;
        periodMap.set(statement.period, currentValue + statement.amount);
      });

      // Converter para formato do recharts e ordenar por período
      return Array.from(periodMap.entries())
        .map(([period, value]) => ({ name: period, valor: value }))
        .sort((a, b) => {
          // Ordenar os períodos cronologicamente
          const periodA = a.name.split('/');
          const periodB = b.name.split('/');

          // Se for período composto (MM/YYYY-MM/YYYY), pegar o primeiro
          const yearA = parseInt(periodA[periodA.length > 1 ? 1 : 0]);
          const yearB = parseInt(periodB[periodB.length > 1 ? 1 : 0]);

          if (yearA !== yearB) return yearA - yearB;

          const monthA = parseInt(periodA[0]);
          const monthB = parseInt(periodB[0]);
          return monthA - monthB;
        });
    });

    const formatCurrency = (value: number): string => {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (date: Date | string): string => {
      if (!date) return '';
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
    };

    return {
      loading,
      statements,
      selectedPeriod,
      uniquePeriods,
      filteredStatements,
      totalAmount,
      chartData,
      formatCurrency,
      formatDate
    };
  }
});
</script>
