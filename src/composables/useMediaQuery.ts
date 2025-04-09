import { ref, onMounted, onUnmounted } from 'vue';

export function useMediaQuery(query: string) {
  const matches = ref(false);
  let mediaQuery: MediaQueryList | null = null;

  const updateMatches = (event: MediaQueryListEvent) => {
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
