import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import authService from '@/api/authService';
import VendasView from '@/views/VendasView.vue';
import RelatoriosView from '@/views/ReportsView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
// Registrando os componentes explicitamente para evitar problemas de carregamento
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Início - Contador Comitê'
        }
    },
    {
        path: '/vendas',
        name: 'vendas',
        component: VendasView,
        meta: {
            title: 'Gestão de Vendas - Contador Comitê'
        }
    },
    {
        path: '/relatorios',
        name: 'relatorios',
        component: RelatoriosView,
        meta: {
            title: 'Relatórios Financeiros - Contador Comitê'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            title: 'Autenticação - Contador Comitê'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: {
            title: 'Registro - Contador Comitê'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
        meta: {
            title: 'Página não encontrada - Contador Comitê'
        }
    },
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // Adicionando scrollBehavior para melhorar a UX
    scrollBehavior(to, from, savedPosition) {
        // Sempre role para o topo quando navegar para uma nova página
        if (savedPosition) {
            return savedPosition;
        }
        else {
            return { top: 0 };
        }
    }
});
router.beforeEach(async (to, from) => {
    try {
        const logged = await authService.userIsLogged();
        // Nomes das rotas em minúsculas para consistência
        if (to.name !== "login" && to.name !== "register" && !logged) {
            return { path: "/login" };
        }
        document.title = to.meta.title || 'Contador Comitê';
        return true;
    }
    catch (error) {
        console.error('Erro na navegação:', error);
        return { path: "/login" };
    }
});
export default router;
//# sourceMappingURL=index.js.map