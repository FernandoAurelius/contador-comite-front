import { ref, onMounted, onUnmounted } from 'vue';
export function useMediaQuery(query) {
    const matches = ref(false);
    let mediaQuery = null;
    const updateMatches = (event) => {
        matches.value = event.matches;
    };
    onMounted(() => {
        if (typeof window !== 'undefined') {
            mediaQuery = window.matchMedia(query);
            matches.value = mediaQuery.matches;
            mediaQuery.addEventListener('change', updateMatches);
        }
    });
    onUnmounted(() => {
        if (mediaQuery) {
            mediaQuery.removeEventListener('change', updateMatches);
        }
    });
    return matches;
}
//# sourceMappingURL=useMediaQuery.js.map