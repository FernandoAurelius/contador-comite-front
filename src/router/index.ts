import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import authService from '@/api/authService';
import RegisterView from '@/views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(""),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
  ],
});

router.beforeEach(async (to, from) => {
  const logged = await authService.userIsLogged();

  if (!logged && to.name !== "Login" && to.name !== "Register") return { path: "/login" }
  else return true;
});

export default router;
