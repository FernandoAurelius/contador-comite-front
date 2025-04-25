<template>
  <section class="container mx-auto py-8 px-4">
    <div class="max-w-lg mx-auto">
      <h1 class="text-3xl font-bold text-center mb-6">Meta de Arrecadação</h1>
      <p class="text-gray-600 text-center mb-8">
        Acompanhe o progresso da nossa meta financeira para a formatura.
      </p>

      <PublicGoalProgress />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PublicGoalProgress from '@/components/PublicGoalProgress.vue';

export default defineComponent({
  name: 'PublicGoalView',
  components: {
    PublicGoalProgress
  }
});
</script>
