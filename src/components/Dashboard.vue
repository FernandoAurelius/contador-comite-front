<template>
  <Transition name="dashboard-fade" appear @before-enter="beforeEnter" @enter="enter">
    <!-- Container do Dashboard -->
    <div class="bg-background rounded-xl shadow-md overflow-hidden border-2">
      <!-- Parte de cima / header do card principal -->
      <div class="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-violet-600 dark:to-indigo-900 text-white">
        <h1 class="text-2xl font-bold mb-1">Comitê de Formatura - CEMIC 2025</h1>
        <p class="opacity-90">Controle de receitas e despesas</p>
      </div>

      <!-- Cards de visualização de dados principais -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">

        <!-- Card 1: capital atual -->
        <Card>
          <CardContent class="pt-1">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-sm bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-300 dark:to-teal-400 text-transparent mb-2 font-bold">
                   Capital Atual</p>
                <p class="text-2xl font-bold">R$ {{ capital.currentAmount?.toFixed(2) }}</p>
              </div>
              <div class="h-12 w-12 ml-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign class="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Card 2: total arrecadado -->
        <Card>
          <CardContent class="pt-1">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-sm bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-300 dark:to-teal-400 text-transparent mb-2 font-bold">
                  Total Arrecadado</p>
                <p class="text-2xl font-bold">R$ {{ capital.totalAmount?.toFixed(2) }}</p>
              </div>
              <div class="h-12 w-12 ml-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <ArrowUp class="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-1">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-sm bg-clip-text bg-gradient-to-r from-rose-600 to-red-700 text-transparent dark:from-rose-300 dark:to-red-400 mb-2 font-bold">
                  Total gasto</p>
                <p class="text-2xl font-bold">R$ {{ totalSpent.toFixed(2) }}</p>
              </div>
              <div class="h-12 w-12 ml-5 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowDown class="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { ArrowDown, ArrowUp, DollarSign, Target } from 'lucide-vue-next';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { defineComponent, Transition } from 'vue';
import { useCapitalStore } from '@/stores/capital';
import Capital from '@/types/Capital';
import Despesa from '@/types/Despesa';
import { useDespesaStore } from '@/stores/despesas';

export default defineComponent({
  name: "Dashboard",
  data() {
    return {
      capital: {} as Capital,
      despesas: [] as Despesa[],
      totalSpent: 0 as number
    }
  },
  methods: {
    beforeEnter(el: Element) {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateY(-20px)";
    },
    enter(el: Element, done: () => void) {
      const htmlEl = el as HTMLElement;
      setTimeout(() => {
        htmlEl.style.transition = "all 0.5s ease";
        htmlEl.style.opacity = "1";
        htmlEl.style.transform = "translateY(0)";
      }, 0);

      el.addEventListener("transitionend", done);
    },
    getTotalSpent() {
      return this.despesas.reduce((accumulator: number, d: Despesa) => accumulator + d.totalCost, 0);
    }
  },
  async created() {
    const capitalStore = useCapitalStore();
    const despesaStore = useDespesaStore();

    this.capital = await capitalStore.getCapital();
    this.despesas = await despesaStore.getDespesas();
    this.totalSpent = this.getTotalSpent();
  },
  components: {
    Card,
    CardContent,
    Progress,
    ArrowDown,
    ArrowUp,
    DollarSign,
    Target,
    Transition
  },
});
</script>
