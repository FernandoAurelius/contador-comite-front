<template>
  <section>
    <ToggleMode />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ToggleMode from '@/components/ui/ToggleMode.vue';

export default defineComponent({
  name: "LoginView",
  components: { ToggleMode }
});
</script>
