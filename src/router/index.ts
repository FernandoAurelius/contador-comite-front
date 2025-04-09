import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Início - Contador Comitê'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      title: 'Dashboard - Contador Comitê'
    }
  },
  {
    path: '/vendas',
    name: 'vendas',
    component: () => import('../views/VendasView.vue'),
    meta: {
      title: 'Gestão de Vendas - Contador Comitê'
    }
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: () => import('../views/RelatoriosView.vue'),
    meta: {
      title: 'Relatórios Financeiros - Contador Comitê'
    }
  },
  // Rota de fallback para 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: 'Página não encontrada - Contador Comitê'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Configurar títulos dinâmicos
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'Contador Comitê';
  next();
});

export default router;
