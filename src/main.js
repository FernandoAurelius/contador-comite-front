import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { useTroteStore } from './stores/trote';
const app = createApp(App);
app.use(createPinia());
app.use(router);
// Inicialização do store de trote - carregando os dados do localStorage
const troteStore = useTroteStore();
// Verificamos se a função existe antes de chamá-la
// Isso evita erros se o store não tiver sido inicializado corretamente
if (typeof troteStore.loadFromLocalStorage === 'function') {
    troteStore.loadFromLocalStorage();
}
app.mount('#app');
//# sourceMappingURL=main.js.map