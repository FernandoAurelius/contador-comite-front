<template>
  <div class="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
    <Dashboard
      :initial-capital="appData.initialCapital"
      :total-raised="appData.totalRaised"
      :total-spent="appData.totalSpent"
      :current-balance="currentBalance"
      :goal="appData.goals[0]?.value || 0"
    />

    <Tabs default-value="calendar" class="mt-6 sm:mt-8">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="calendar">Calendário</TabsTrigger>
        <TabsTrigger value="expenses">Despesas</TabsTrigger>
        <TabsTrigger value="goals">Metas</TabsTrigger>
      </TabsList>

      <TabsContent value="calendar" class="mt-4">
        <!-- Título responsive com navegação de data em mobile -->
        <div class="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div class="w-full sm:w-auto flex justify-between sm:justify-start gap-2">
            <Button
              variant="outline"
              @click="handlePreviousWeek"
              class="flex items-center gap-1 transition-all hover:gap-2"
            >
              <ChevronLeft class="h-4 w-4" />
              <span class="sr-only sm:not-sr-only sm:inline">Anterior</span>
            </Button>

            <h2 class="text-base sm:text-xl font-medium text-gray-700 text-center">
              {{ formatDate(weekStart, "dd 'de' MMM") }} -
              {{ formatDate(addDays(weekStart, 6), "dd 'de' MMM") }}
            </h2>

            <Button
              variant="outline"
              @click="handleNextWeek"
              :disabled="isNextWeekDisabled"
              class="flex items-center gap-1 transition-all hover:gap-2"
            >
              <span class="sr-only sm:not-sr-only sm:inline">Próxima</span>
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>

          <!-- Data picker em desktop -->
          <div class="hidden sm:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" class="gap-1">
                  <Calendar class="h-4 w-4" />
                  <span>Escolher semana</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  :selected="currentWeek"
                  @update:model-value="selectWeek"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DayCarousel :days="weekDays" @day-click="handleDayClick" :is-disabled="isAfterEndDate" />
      </TabsContent>

      <TabsContent value="expenses" class="mt-4">
        <ExpensesSection :expenses="appData.expenses" @add-expense="handleAddExpense" />
      </TabsContent>

      <TabsContent value="goals" class="mt-4">
        <GoalsSection
          :goals="appData.goals"
          :current-balance="currentBalance"
          @update-goals="handleUpdateGoals"
        />
      </TabsContent>
    </Tabs>

    <DayModal
      v-if="isModalOpen && selectedDay"
      :date="selectedDay"
      :is-open="isModalOpen"
      @update:is-open="isModalOpen = $event"
      @save="handleAddSale"
    />

    <InitialCapitalModal
      @close="handleCloseInitialCapitalModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isAfter, isBefore, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import DayCarousel from '@/components/DayCarousel.vue';
import DayModal from '@/components/DayModal.vue';
import Dashboard from '@/components/Dashboard.vue';
import InitialCapitalModal from '@/components/InitialCapitalModal.vue';
import ExpensesSection from '@/components/ExpensesSection.vue';
import GoalsSection from '@/components/GoalsSection.vue';
import { useCapitalStore } from '@/stores/capital';
import { useVendaStore } from '@/stores/vendas';
import { useMediaQuery } from '@/composables/useMediaQuery';

interface Goal {
  id: string;
  name: string;
  value: number;
  description: string;
}

interface Expense {
  id: string;
  date: Date;
  description: string;
  amount: number;
  notes?: string;
}

interface Sale {
  date: string;
  isTroteDay: boolean;
  items: Array<{
    id: string;
    name: string;
    count: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
}

interface AppData {
  initialCapital: number;
  totalRaised: number;
  totalSpent: number;
  goals: Goal[];
  expenses: Expense[];
  sales: Sale[];
}

export default defineComponent({
  name: 'HomeView',
  components: {
    Button, ChevronLeft, ChevronRight, Plus, Calendar,
    Tabs, TabsContent, TabsList, TabsTrigger,
    Popover, PopoverContent, PopoverTrigger, CalendarComponent,
    DayCarousel, DayModal, Dashboard, InitialCapitalModal, ExpensesSection, GoalsSection
  },
  setup() {
    // Stores
    const capitalStore = useCapitalStore();
    const vendaStore = useVendaStore();

    // Estados da aplicação
    const currentWeek = ref(new Date());
    const selectedDay = ref<Date | null>(null);
    const isModalOpen = ref(false);
    const appData = ref<AppData>({
      initialCapital: 0,
      totalRaised: 0,
      totalSpent: 0,
      goals: [{ id: "1", name: "Meta Principal", value: 15000, description: "Meta para a formatura" }],
      expenses: [],
      sales: [],
    });

    // Data limite para eventos (29 de agosto de 2025)
    const endDate = new Date(2025, 7, 29);

    // Verificar tamanho da tela para decidir se é mobile
    const isMobile = useMediaQuery('(max-width: 640px)');

    // Função para selecionar uma semana a partir de uma data específica
    const selectWeek = (date: Date) => {
      currentWeek.value = date;
      const newWeekStart = startOfWeek(date, { weekStartsOn: 1 }); // Segunda como início
      weekStart.value = newWeekStart;
    };

    // Computed properties
    const weekStart = computed(() => {
      return startOfWeek(currentWeek.value, { weekStartsOn: 0 });
    });

    const weekDays = computed(() => {
      return Array.from({ length: 7 }).map((_, i) => addDays(weekStart.value, i));
    });

    const isNextWeekDisabled = computed(() => {
      return isAfter(startOfWeek(addWeeks(currentWeek.value, 1)), endDate);
    });

    const currentBalance = computed(() => {
      return appData.value.initialCapital + appData.value.totalRaised - appData.value.totalSpent;
    });

    // Métodos
    const formatDate = (date: Date, formatStr: string): string => {
      return format(date, formatStr, { locale: ptBR });
    };

    const handlePreviousWeek = () => {
      currentWeek.value = subWeeks(currentWeek.value, 1);
    };

    const handleNextWeek = () => {
      const nextWeek = addWeeks(currentWeek.value, 1);
      if (isBefore(startOfWeek(nextWeek), endDate)) {
        currentWeek.value = nextWeek;
      }
    };

    const isAfterEndDate = (day: Date) => {
      return isAfter(day, endDate);
    };

    const handleDayClick = (day: Date) => {
      selectedDay.value = day;
      isModalOpen.value = true;
    };

    const handleQuickAddSale = () => {
      selectedDay.value = new Date();
      isModalOpen.value = true;
    };

    const handleAddExpense = (expense: Expense) => {
      appData.value.expenses.push(expense);
      appData.value.totalSpent += expense.amount;
    };

    const handleAddSale = (sale: any) => {
      // Verifique se sale tem a propriedade totalAmount
      if (!sale || typeof sale.totalAmount === 'undefined') {
        console.warn('Dados de venda inválidos:', sale);
        return;
      }

      // Cópia defensiva para evitar modificar computed diretamente
      const updatedSales = [...appData.value.sales, sale];

      // Atualize appData como um objeto inteiro
      appData.value = {
        ...appData.value,
        sales: updatedSales,
        totalRaised: appData.value.totalRaised + sale.totalAmount
      };

      // Recarregue os dados para garantir consistência
      loadSalesData();
    };

    const handleUpdateGoals = (goals: Goal[]) => {
      appData.value.goals = goals;
    };

    const handleCloseInitialCapitalModal = () => {
      loadCapitalData();
    };

    const loadCapitalData = async () => {
      try {
        const capitalStatus = await capitalStore.getCapitalStatus();

        if (capitalStatus) {
          appData.value.initialCapital = capitalStatus.initialAmount
            ? Number(capitalStatus.initialAmount)
            : 0;
        }
      } catch (error) {
        console.error('Erro ao carregar dados de capital:', error);
      }
    };

    const loadSalesData = async () => {
      try {
        const vendas = await vendaStore.getVendas();

        // Calcular o valor total das vendas
        let totalRaised = 0;

        vendas.forEach(venda => {
          totalRaised += venda.totalPrice ? Number(venda.totalPrice) : 0;
        });

        appData.value.totalRaised = totalRaised;
      } catch (error) {
        console.error('Erro ao carregar dados de vendas:', error);
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      // Carregar dados iniciais
      loadCapitalData();
      loadSalesData();
    });

    // Cleanup
    watch(
      () => capitalStore.currentAmount,
      (newValue) => {
        if (newValue) {
          appData.value.initialCapital = Number(newValue);
        }
      }
    );

    return {
      currentWeek,
      selectedDay,
      isModalOpen,
      appData,
      isMobile,
      weekStart,
      weekDays,
      isNextWeekDisabled,
      currentBalance,
      formatDate,
      handlePreviousWeek,
      handleNextWeek,
      isAfterEndDate,
      handleDayClick,
      handleQuickAddSale,
      handleAddExpense,
      handleAddSale,
      handleUpdateGoals,
      handleCloseInitialCapitalModal,
      addDays,
      selectWeek
    };
  }
});
</script>

<style scoped>
/* Transições de página e animações */
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.tab-enter-from,
.tab-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Aumenta tamanho de toque em dispositivos móveis */
@media (max-width: 640px) {
  :deep(.card) {
    padding: 1rem;
  }

  :deep(button) {
    min-height: 2.5rem;
  }

  :deep(input), :deep(select) {
    min-height: 2.75rem;
  }
}
</style>
