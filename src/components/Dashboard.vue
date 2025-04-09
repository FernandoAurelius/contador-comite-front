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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
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

        <!-- Card 3: total gasto -->
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

      <div class="px-6 pb-6">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center mb-2">
              <Target class="h-5 w-5 text-purple-600 mr-2" />
              <h3 class="font-medium">Progresso para Meta</h3>
            </div>

            <div class="mb-2">
              <Progress :model-value="progressPercentage" class="h-2" />
            </div>

            <div class="flex justify-between text-sm">
              <div>
                <span class="text-gray-500">Meta:</span> R$ {{ meta.goalValue?.toFixed(2) }}
              </div>
              <div>
                <span class="text-gray-500">Falta:</span> R$ {{ remainingToGoal.toFixed(2) }}
              </div>
              <div>
                <span class="text-gray-500">Progresso:</span> {{ progressPercentage.toFixed(2) }}%
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
import Despesa from '@/types/Despesa';
import { useDespesaStore } from '@/stores/despesas';
import { useMetaStore } from '@/stores/meta';
import { mapState } from 'pinia';

export default defineComponent({
  name: "Dashboard",
  data() {
    return {
      totalSpent: 0 as number,
      progressPercentage: 0 as number,
      remainingToGoal: 0 as number,
    }
  },
  computed: {
    ...mapState(useCapitalStore, ['capital']),
    ...mapState(useDespesaStore, ['despesas']),
    ...mapState(useMetaStore, ['meta'])
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
    },
    getProgressPercentage() {
      return (this.meta.currentValue / this.meta.goalValue) * 100;
    },
    getRemainingToGoal() {
      return this.meta.goalValue - this.meta.currentValue;
    }
  },
  async created() {
    const capitalStore = useCapitalStore();
    const despesaStore = useDespesaStore();
    const metaStore = useMetaStore();

    try {
      await capitalStore.getCapital();
      await despesaStore.getDespesas();
      await metaStore.getMeta();
      this.totalSpent = this.getTotalSpent();
      this.progressPercentage = this.getProgressPercentage();
      this.remainingToGoal = this.getRemainingToGoal();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
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
