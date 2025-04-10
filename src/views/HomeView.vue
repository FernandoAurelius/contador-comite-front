<template>
  <div class="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
    <Dashboard ref="dashboard" />

    <Tabs default-value="calendar" class="mt-6 sm:mt-8">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="calendar">Calendário</TabsTrigger>
        <TabsTrigger value="expenses">Despesas</TabsTrigger>
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
        <ExpensesSection
          :expenses="despesas"
          @add-expense="handleAddExpense"
          @expense-updated="refreshDashboard"
          @expense-deleted="refreshDashboard"
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
import useVendaStore from '@/stores/vendas';
import { useMediaQuery } from '@/composables/useMediaQuery';
import { mapActions, mapState } from 'pinia';
import { useDespesaStore } from '@/stores/despesas';
import Venda from '@/types/Venda';
import Despesa from '@/types/Despesa';
import { useMetaStore } from '@/stores/meta';
import { toast } from 'vue-sonner';

export default defineComponent({
  name: 'HomeView',
  components: {
    Button, ChevronLeft, ChevronRight, Plus, Calendar,
    Tabs, TabsContent, TabsList, TabsTrigger,
    Popover, PopoverContent, PopoverTrigger, CalendarComponent,
    DayCarousel, DayModal, Dashboard, InitialCapitalModal, ExpensesSection, GoalsSection
  },
  data() {
    return {
      // Estados da aplicação
      currentWeek: new Date(),
      selectedDay: new Date(),
      isModalOpen: false,
      // Data limite para eventos (29 de agosto de 2025)
      endDate: new Date(2025, 7, 29),
    };
  },
  computed: {
    ...mapState(useCapitalStore, ['capital']),
    ...mapState(useDespesaStore, ['despesas']),
    ...mapState(useVendaStore, ['vendas']),
    isMobile() {
      return useMediaQuery('(max-width: 640px)');
    },
    weekStart() {
      return startOfWeek(this.currentWeek, { weekStartsOn: 0 });
    },
    weekDays() {
      return Array.from({ length: 7 }).map((_, i) => addDays(this.weekStart, i));
    },
    isNextWeekDisabled() {
      return isAfter(startOfWeek(addWeeks(this.currentWeek, 1)), this.endDate);
    },
    currentBalance() {
      return this.capital?.currentAmount - this.despesas.reduce((ac, d) => ac + d.totalCost, 0);
    }
  },
  methods: {
    formatDate(date: Date, formatStr: string) {
      return format(date, formatStr, { locale: ptBR });
    },
    selectWeek(date: Date) {
      this.currentWeek = date;
      const newWeekStart = startOfWeek(date, { weekStartsOn: 1 }); // Segunda como início
    },
    handlePreviousWeek() {
      this.currentWeek = subWeeks(this.currentWeek, 1);
    },
    handleNextWeek() {
      const nextWeek = addWeeks(this.currentWeek, 1);
      if (isBefore(startOfWeek(nextWeek), this.endDate)) {
        this.currentWeek = nextWeek;
      }
    },
    isAfterEndDate(day: Date) {
      return isAfter(day, this.endDate);
    },
    handleDayClick(day: Date) {
      this.selectedDay = day;
      this.isModalOpen = true;
    },
    handleQuickAddSale() {
      this.selectedDay = new Date();
      this.isModalOpen = true;
    },
    async handleAddExpense(expense: Despesa) {
      console.log('Despesa recebida:', expense);
      const store = useDespesaStore();
      try {
        await store.addDespesa(expense);
        this.refreshDashboard();
      } catch (error) {
        console.error("Erro ao adicionar despesa", error);
      }
    },
    async handleAddSale(sale: Venda) {
      const vendaStore = useVendaStore();
      try {
        await vendaStore.getVendas();

        toast('Venda salva com sucesso!');
      } catch (error) {
        toast('Erro ao salvar venda', {
          description: `${error}`
        });
      }
    },
    handleCloseInitialCapitalModal() {
      const capitalStore = useCapitalStore();
      capitalStore.getCapital();
    },
    refreshDashboard() {
      const capitalStore = useCapitalStore();
      const despesaStore = useDespesaStore();
      const metaStore = useMetaStore();

      // Recarregar todos os dados necessários
      Promise.all([
        capitalStore.getCapital(),
        despesaStore.getDespesas(),
        metaStore.getMeta()
      ]);
    },
    addDays: addDays
  },
  mounted() {
    const capitalStore = useCapitalStore();
    const vendaStore = useVendaStore();
    const despesaStore = useDespesaStore();
    const metaStore = useMetaStore();

    capitalStore.getCapital();
    vendaStore.getVendas();
    despesaStore.getDespesas();
    metaStore.getMeta();
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
