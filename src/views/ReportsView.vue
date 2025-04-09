<template>
  <div class="container py-4 sm:py-6 md:py-8 mx-auto">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold mb-2">Relatórios Financeiros</h1>
      <p class="text-gray-500 text-sm sm:text-base mb-6">
        Gere e visualize relatórios detalhados das finanças do comitê
      </p>
    </div>

    <!-- Componente de relatório -->
    <ReportSection />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReportSection from '@/components/ReportSection.vue';

export default defineComponent({
  name: 'RelatoriosView',
  components: {
    ReportSection
  }
});
</script>
