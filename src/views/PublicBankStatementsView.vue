<template>
  <section class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">Extratos Bancários</h1>
      <p class="text-gray-600 text-center mb-8">
        Acompanhe a transparência financeira do nosso comitê e a evolução da arrecadação.
      </p>

      <PublicBankStatements />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PublicBankStatements from '@/components/PublicBankStatements.vue';

export default defineComponent({
  name: 'PublicBankStatementsView',
  components: {
    PublicBankStatements
  }
});
</script>
