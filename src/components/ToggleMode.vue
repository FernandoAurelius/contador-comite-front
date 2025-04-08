<template>

  <!-- Centralizando o conteúdo do botão com flexbox -->
  <div class="flex items-center">
    <!-- Usando o componente Switch do shadcn que está ligado à propriedade isDarkMode via v-model -->
    <Switch v-model="isDarkMode">

      <!-- v-slot especial pra personalizar o thumb (bolinha) do switch -->
      <template #thumb>

        <!-- Ícone :icon dinâmico com base no estado de modo escuro -->
        <Icon
          :icon="isDarkMode ? 'radix-icons:moon' : 'radix-icons:sun'"
          class="h-3 w-3 text-foreground"
          :class="{ 'text-white': isDarkMode }"
        />
      </template>
    </Switch>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@iconify/vue';
import { useColorMode } from '@vueuse/core';

export default defineComponent({
  name: "ToggleMode",

  components: {
    Switch,
    Icon
  },

  data() {
    return {
      colorMode: useColorMode({ disableTransition: false })
    }
  },

  computed: {
    isDarkMode: {
      get() {
        return this.colorMode === "dark";
      },
      set(value: boolean) {
        this.colorMode = value ? "dark" : "light";
      }
    }
  },

  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
    }
  }
});
</script>
