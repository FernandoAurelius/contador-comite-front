<script lang="ts">
import { defineComponent } from 'vue';
import ToggleMode from './components/ToggleMode.vue';

export default defineComponent({
  name: "App",
  components: {
    ToggleMode
  }
});
</script>

<template>
  <ToggleMode class="self-center mt-5" />
  <main class="flex flex-col w-full h-screen justify-center items-center">
    <router-view />
  </main>
</template>
