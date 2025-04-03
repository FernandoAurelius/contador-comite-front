<script lang="ts">
import { defineComponent } from 'vue';
import LoginView from '@/views/LoginView.vue';

export default defineComponent({
  name: "App",
  components: { LoginView }
});
</script>

<template>
  <main class="flex w-full h-screen justify-center items-center">
    <LoginView :class="['flex', 'w-100', 'h-100', 'justify-center', 'items-center']" />
  </main>
</template>
