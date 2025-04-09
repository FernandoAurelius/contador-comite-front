import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import authService from '@/api/authService';

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
  {
    path: '/login',
    name: 'Login',
    component: () => LoginView,
    meta: {
      title: 'Autenticação - Contador Comitê'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => RegisterView,
    meta: {
      title: 'Registro - Contador Comitê'
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
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from,) => {
  const logged = await authService.userIsLogged();

  if (to.name !== "Login" && to.name !== "Register" && !logged) return { path: "/login" };

  document.title = to.meta.title as string || 'Contador Comitê';
  return true;
});

export default router;
