<template>
  <Sonner />

  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <header class="bg-white border-b sticky top-0 z-30">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <BarChart2 class="h-6 w-6 text-emerald-600" />
            <span class="font-bold text-lg">Comitê</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link
            v-if="logged"
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
            :class="$route.path === item.path ? 'text-emerald-600' : 'text-gray-700'"
          >
            {{ item.title }}
          </router-link>
        </nav>

        <!-- Mobile menu button -->
        <Button
          variant="ghost"
          size="icon"
          class="md:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t">
        <div class="container mx-auto px-4 py-2 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="$route.path === item.path ? 'bg-gray-100 text-emerald-600' : 'text-gray-700'"
            @click="isMobileMenuOpen = false"
          >
            {{ item.title }}
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="pb-20 md:pb-10"> <!-- Aumentado padding-bottom para mobile para acomodar o menu inferior -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white py-6 hidden md:block">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>© {{ new Date().getFullYear() }} CEMIC - @FernandoAurelius</p>
      </div>
    </footer>

    <!-- Mobile bottom navigation -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
      <div class="flex justify-around py-2">
        <router-link
          v-for="item in mobileNavItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center px-3 py-1"
          :class="$route.path === item.path ? 'text-emerald-600' : 'text-gray-700'"
        >
          <component :is="item.icon" class="h-5 w-5" />
          <span class="text-xs mt-1">{{ item.title }}</span>
        </router-link>
      </div>
    </div>

    <!-- Mobile Add button -->
    <div class="fixed bottom-16 right-4 md:hidden">
      <Button
        size="lg"
        class="rounded-full h-14 w-14 shadow-lg"
        @click="openAddModal"
      >
        <Plus class="h-6 w-6" />
        <span class="sr-only">Adicionar venda</span>
      </Button>
    </div>

    <!-- Add Modal -->
    <DayModal
      v-if="isDayModalOpen"
      :date="selectedDay"
      :is-open="isDayModalOpen"
      @update:is-open="closeDayModal"
      @save="handleSave"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { BarChart2, Home, BarChart, FileText, Settings, Menu, X, Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import DayModal from '@/components/DayModal.vue';
import Sonner from './components/ui/sonner/Sonner.vue';
import { useAuthStore } from './stores/auth';
import { mapState } from 'pinia';

export default defineComponent({
  name: 'App',
  components: {
    BarChart2, Home, BarChart, FileText, Settings, Menu, X, Plus, Button, DayModal, Sonner
  },
  data() {
    return {
      isMobileMenuOpen: false,
      isDayModalOpen: false,
      selectedDay: new Date(),
      navItems: [
        { title: 'Início', path: '/' },
        { title: 'Vendas', path: '/vendas' },
        { title: 'Relatórios', path: '/relatorios' }
      ],
      mobileNavItems: [
        { title: 'Início', path: '/', icon: Home },
        { title: 'Dashboard', path: '/dashboard', icon: BarChart },
        { title: 'Relatórios', path: '/relatorios', icon: FileText },
        { title: 'Vendas', path: '/vendas', icon: Settings }
      ]
    };
  },
  methods: {
    openAddModal() {
      this.selectedDay = new Date();
      this.isDayModalOpen = true;
    },
    closeDayModal(value: boolean) {
      this.isDayModalOpen = value;
    },
    handleSave() {
      this.isDayModalOpen = false;
    },
    setFavicon() {
      // Criamos um favicon dinâmico baseado no ícone BarChart2
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Estilo similar ao BarChart2 da biblioteca Lucide
        ctx.fillStyle = '#10b981'; // cor emerald-600

        // Desenhando as barras do gráfico (similar ao BarChart2)
        // Primeira barra
        ctx.fillRect(6, 22, 4, 6);
        // Segunda barra
        ctx.fillRect(14, 16, 4, 12);
        // Terceira barra
        ctx.fillRect(22, 8, 4, 20);

        // Convertendo para URL de dados e definindo como favicon
        const dataUrl = canvas.toDataURL('image/png');

        let link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = dataUrl;
        document.head.appendChild(link);
      }
    }
  },
  computed: {
    ...mapState(useAuthStore, ["logged"]),
  },
  mounted() {
    this.setFavicon();
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Melhorias para dispositivos móveis */
@media (max-width: 768px) {
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  input, button, select, textarea {
    font-size: 16px; /* Previne zoom em iOS */
  }
}
</style>
