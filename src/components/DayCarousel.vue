<template>
  <div class="space-y-4">
    <!-- Day selector pills -->
    <div class="flex justify-between items-center bg-gray-100 rounded-lg p-2">
      <Button variant="ghost" size="icon" class="h-8 w-8" @click="handlePrevious" :disabled="isFirstWeek">
        <ChevronLeft class="h-4 w-4" />
        <span class="sr-only">Semana anterior</span>
      </Button>

      <div class="relative flex-1 overflow-x-auto py-1 no-scrollbar">
        <div class="flex justify-center gap-1 min-w-max">
          <button
            v-for="day in visibleWeekDays"
            :key="formatDate(day, 'yyyy-MM-dd')"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            :class="[
              isSameDay(day, currentDay) ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200',
              isToday(day) && !isSameDay(day, currentDay) && 'ring-1 ring-emerald-500'
            ]"
            @click="selectDay(day)"
          >
            <span class="hidden sm:inline mr-1">{{ formatDate(day, 'EEE') }}</span>
            <span>{{ formatDate(day, 'dd') }}</span>
          </button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        @click="handleNext"
        :disabled="isLastWeek"
      >
        <ChevronRight class="h-4 w-4" />
        <span class="sr-only">Próxima semana</span>
      </Button>
    </div>

    <!-- Current day card -->
    <transition-group
      name="day-transition"
      mode="out-in"
      tag="div"
    >
      <div
        :key="formatDate(currentDay, 'yyyy-MM-dd')"
        class="w-full"
      >
        <div class="text-center mb-2 font-medium text-gray-700">
          {{ formatDate(currentDay, "EEEE, dd 'de' MMMM") }}
        </div>
        <DayCard
          :date="currentDay"
          @click="onDayClick(currentDay)"
          :is-disabled="isDayDisabled(currentDay)"
          :is-trote-day="isTroteDay(currentDay)"
          is-large
        />
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue';
import { format, isToday, isSameDay, addDays, subDays, isWeekend, startOfWeek, endOfWeek, addWeeks, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import DayCard from '@/components/DayCard.vue';
import { useTroteStore } from '@/stores/trote';

export default defineComponent({
  name: 'DayCarousel',
  components: {
    ChevronLeft,
    ChevronRight,
    CalendarIcon,
    Button,
    DayCard,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Calendar
  },
  props: {
    days: {
      type: Array as PropType<Date[]>,
      required: true
    },
    isDisabled: {
      type: Function as PropType<(day: Date) => boolean>,
      default: null
    }
  },
  emits: ['day-click'],
  setup(props, { emit }) {
    const troteStore = useTroteStore();
    const currentDay = ref(new Date());
    const currentWeekNumber = ref(0);
    const maxWeeks = ref(12); // Aproximadamente 3 meses (12 semanas)

    // Função para verificar se uma data é um dia de trote
    const isTroteDay = (date: Date): boolean => {
      const dateStr = formatDateStr(date);
      return troteStore.isTroteDay(dateStr);
    };

    // Função para formatar a data para o formato usado no store de trote
    const formatDateStr = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Obtém todas as semanas disponíveis (apenas com dias úteis)
    const allWeeks = computed(() => {
      const weeks: Date[][] = [];
      const today = new Date();

      // Gerar semanas para os próximos 3 meses
      for (let i = 0; i < maxWeeks.value; i++) {
        const weekStartDate = addWeeks(today, i);
        const weekDays: Date[] = [];

        // Para cada semana, adicionar apenas os dias úteis (seg-sex)
        for (let j = 0; j < 7; j++) {
          const day = addDays(weekStartDate, j);
          if (!isWeekend(day)) {
            weekDays.push(day);
          }
        }

        if (weekDays.length > 0) {
          weeks.push(weekDays);
        }
      }

      return weeks;
    });

    // Dias visíveis da semana atual
    const visibleWeekDays = computed(() => {
      return allWeeks.value[currentWeekNumber.value] || [];
    });

    // Data de início da semana atual
    const currentWeekStartDate = computed(() => {
      if (visibleWeekDays.value.length > 0) {
        return visibleWeekDays.value[0];
      }
      return new Date();
    });

    // Data do final da semana atual
    const currentWeekEndDate = computed(() => {
      if (visibleWeekDays.value.length > 0) {
        return visibleWeekDays.value[visibleWeekDays.value.length - 1];
      }
      return new Date();
    });

    // Verificar se estamos na primeira semana
    const isFirstWeek = computed(() => {
      return currentWeekNumber.value === 0;
    });

    // Verificar se estamos na última semana
    const isLastWeek = computed(() => {
      return currentWeekNumber.value === allWeeks.value.length - 1;
    });

    // Função para inicializar o dia atual baseado nos dias disponíveis
    const initializeCurrentDay = () => {
      const today = new Date();

      // Se hoje for fim de semana, avançar para segunda-feira
      let targetDate = today;
      if (isWeekend(today)) {
        // Avançar para a próxima segunda
        const daysUntilMonday = today.getDay() === 0 ? 1 : 8 - today.getDay();
        targetDate = addDays(today, daysUntilMonday);
      }

      // Encontrar o dia correspondente nos dias disponíveis
      const foundDay = props.days.find(day => isSameDay(day, targetDate));
      if (foundDay) {
        currentDay.value = foundDay;
      } else if (props.days.length > 0) {
        // Se não encontrar, usar o primeiro dia disponível
        currentDay.value = props.days[0];
      }

      // Encontrar em qual semana está esse dia
      for (let i = 0; i < allWeeks.value.length; i++) {
        const weekDays = allWeeks.value[i];
        if (weekDays.some(day => isSameDay(day, currentDay.value))) {
          currentWeekNumber.value = i;
          break;
        }
      }
    };

    // Inicialização: encontrar a semana atual ou a primeira com dia útil
    watch(() => props.days, () => {
      if (props.days && props.days.length > 0) {
        initializeCurrentDay();
      }
    }, { immediate: true });

    // Ir para semana anterior
    const handlePrevious = () => {
      if (currentWeekNumber.value > 0) {
        currentWeekNumber.value--;

        // Em vez de tentar encontrar diretamente, vamos usar nextTick para garantir que o Vue atualize visibleWeekDays
        // Garantimos que primeiro o Vue atualize o valor computado visibleWeekDays
        const previousWeekDays = allWeeks.value[currentWeekNumber.value] || [];
        if (previousWeekDays.length > 0) {
          // Selecionar o mesmo dia da semana ou o primeiro dia útil
          const dayOfWeek = currentDay.value.getDay();
          const newDay = previousWeekDays.find(day => day.getDay() === dayOfWeek) || previousWeekDays[0];
          currentDay.value = newDay;
        }
      }
    };

    // Ir para próxima semana
    const handleNext = () => {
      if (currentWeekNumber.value < allWeeks.value.length - 1) {
        currentWeekNumber.value++;

        // Similar ao handlePrevious, trabalhamos diretamente com o array da nova semana
        const nextWeekDays = allWeeks.value[currentWeekNumber.value] || [];
        if (nextWeekDays.length > 0) {
          // Selecionar o mesmo dia da semana ou o primeiro dia útil
          const dayOfWeek = currentDay.value.getDay();
          const newDay = nextWeekDays.find(day => day.getDay() === dayOfWeek) || nextWeekDays[0];
          currentDay.value = newDay;
        }
      }
    };

    // Selecionar um dia específico
    const selectDay = (day: Date) => {
      // Se for fim de semana, não permitir selecionar
      if (isWeekend(day)) return;

      currentDay.value = day;

      // Ajustar semana se necessário
      for (let i = 0; i < allWeeks.value.length; i++) {
        if (allWeeks.value[i].some(d => isSameDay(d, day))) {
          currentWeekNumber.value = i;
          break;
        }
      }
    };

    // Emitir evento de clique no dia
    const onDayClick = (day: Date) => {
      emit('day-click', day);
    };

    // Verificar se o dia está desativado
    const isDayDisabled = (day: Date): boolean => {
      return props.isDisabled ? props.isDisabled(day) : false;
    };

    return {
      currentDay,
      visibleWeekDays,
      currentWeekStartDate,
      currentWeekEndDate,
      isFirstWeek,
      isLastWeek,
      handlePrevious,
      handleNext,
      selectDay,
      onDayClick,
      isDayDisabled,
      isToday,
      isSameDay,
      isWeekend,
      isTroteDay,
      formatDate: (date: Date, formatStr: string): string => {
        return format(date, formatStr, { locale: ptBR });
      }
    };
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Transições para a animação do card do dia */
.day-transition-enter-active,
.day-transition-leave-active {
  transition: all 0.3s ease;
}

.day-transition-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.day-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
