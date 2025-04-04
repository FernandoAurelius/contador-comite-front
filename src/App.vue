<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "App"
});
</script>

<template>
  <main class="flex w-full h-screen justify-center items-center">
    <router-view />
  </main>
</template>
