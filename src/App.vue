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
  <main class="flex flex-col w-full h-screen justify-center items-center">
    <ToggleMode class="self-center mt-10" />
    <router-view />
  </main>
</template>
