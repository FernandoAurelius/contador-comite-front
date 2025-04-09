<template>
  <div class="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
    <h1 class="text-9xl font-bold text-gray-200">404</h1>
    <h2 class="text-2xl font-medium mb-4">Página não encontrada</h2>
    <p class="text-gray-500 mb-6 max-w-md">
      A página que você está procurando não existe ou foi movida para outro endereço.
    </p>
    <Button @click="$router.push('/')">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Voltar para o Dashboard
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

export default defineComponent({
  name: 'NotFoundView',
  components: {
    ArrowLeft,
    Button
  }
});
</script>
