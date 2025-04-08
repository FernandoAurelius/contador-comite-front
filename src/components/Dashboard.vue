<template>
  <Transition
    name="dashboard-fade"
    appear
    @before-enter="beforeEnter"
    @enter="enter"
  >
    <!-- Container do Dashboard -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Parte de cima / header do card principal -->
       <div class="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <h1 class="text-2xl font-bold mb-1">Comitê de Formatura - CEMIC 2025</h1>
        <p class="opacity-90">Controle de receitas e despesas</p>
       </div>

       <!-- Cards de visualização de dados principais -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">

          <!-- Card 1: capital atual -->
          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Capital Atual</p>
                    <p class="text-2xl font-bold">R$ {{ currentCapital }}</p>
                  </div>
                  <div class="h-12 w-12 rounded-full /bg-emerald-100 flex items-center justify-center">
                    <DollarSign class="h-6 w-6 text-emeral-600" />
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
import { defineComponent, Transition } from 'vue';;

export default defineComponent({
  name: "Dashboard",
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
  methods: {
    beforeEnter(el: HTMLElement) {
      el.style.opacity = "0";
      el.style.transform = "translateY(-20px)";
    },
    enter(el: HTMLElement, done: () => void) {
      setTimeout(() => {
        el.style.transition = "all 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 0);

      el.addEventListener("transitionend", done);
    }
  }
});
</script>
