import { defineStore } from 'pinia';
import { ref } from 'vue';
const STORAGE_KEY = 'trote-days';
export const useTroteStore = defineStore('trote', () => {
    // Array de dias marcados como dias de trote
    const troteDays = ref([]);
    // Carregar dias de trote do localStorage quando o store é inicializado
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                troteDays.value = JSON.parse(savedData);
            }
            catch (e) {
                console.error('Erro ao carregar dias de trote do localStorage:', e);
            }
        }
    }
    // Salvar dias de trote no localStorage
    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(troteDays.value));
    }
    // Marcar um dia como dia de trote
    function setTroteDay(dateStr) {
        if (!isTroteDay(dateStr)) {
            troteDays.value.push(dateStr);
            saveToLocalStorage();
        }
    }
    // Remover um dia dos dias de trote
    function removeTroteDay(dateStr) {
        const index = troteDays.value.indexOf(dateStr);
        if (index !== -1) {
            troteDays.value.splice(index, 1);
            saveToLocalStorage();
        }
    }
    // Verificar se um dia é dia de trote
    function isTroteDay(dateStr) {
        return troteDays.value.includes(dateStr);
    }
    // Obter todos os dias de trote
    function getAllTroteDays() {
        return [...troteDays.value];
    }
    return {
        troteDays,
        loadFromLocalStorage,
        setTroteDay,
        removeTroteDay,
        isTroteDay,
        getAllTroteDays
    };
});
//# sourceMappingURL=trote.js.map