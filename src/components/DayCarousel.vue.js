import { defineComponent, computed, ref, watch, nextTick } from 'vue';
import { format, isToday, isSameDay, addDays, isWeekend, startOfWeek } from 'date-fns';
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
            type: Array,
            required: true
        },
        isDisabled: {
            type: Function,
            default: null
        }
    },
    emits: ['day-click'],
    setup(props, { emit }) {
        const troteStore = useTroteStore();
        const currentDay = ref(new Date());
        const currentWeekNumber = ref(0);
        const maxPastWeeks = ref(12); // Número de semanas no passado
        const maxFutureWeeks = ref(12); // Número de semanas no futuro
        // Função para verificar se uma data é um dia de trote
        const isTroteDay = (date) => {
            const dateStr = formatDateStr(date);
            return troteStore.isTroteDay(dateStr);
        };
        // Função para formatar a data para o formato usado no store de trote
        const formatDateStr = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        // Obtém todas as semanas disponíveis (passadas e futuras)
        const allWeeks = computed(() => {
            const weeks = [];
            const today = new Date();
            // Gerar semanas passadas
            for (let i = maxPastWeeks.value; i > 0; i--) {
                const weekStartDate = addDays(today, -7 * i);
                const weekDays = [];
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
            // Semana atual
            const currentWeekDays = [];
            // Primeiro dia da semana atual (domingo)
            const currentWeekStart = startOfWeek(today);
            for (let j = 0; j < 7; j++) {
                const day = addDays(currentWeekStart, j);
                if (!isWeekend(day)) {
                    currentWeekDays.push(day);
                }
            }
            if (currentWeekDays.length > 0) {
                weeks.push(currentWeekDays);
            }
            // Gerar semanas futuras
            for (let i = 1; i <= maxFutureWeeks.value; i++) {
                const weekStartDate = addDays(today, 7 * i);
                const weekStartDay = startOfWeek(weekStartDate);
                const weekDays = [];
                // Para cada semana, adicionar apenas os dias úteis (seg-sex)
                for (let j = 0; j < 7; j++) {
                    const day = addDays(weekStartDay, j);
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
        // Inicializa currentWeekNumber para apontar para a semana atual (meio do array)
        const initialWeekIndex = computed(() => {
            return maxPastWeeks.value;
        });
        // Inicializa currentWeekNumber
        currentWeekNumber.value = initialWeekIndex.value;
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
            }
            else if (props.days.length > 0) {
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
                nextTick(() => {
                    const previousWeekDays = allWeeks.value[currentWeekNumber.value];
                    if (previousWeekDays && previousWeekDays.length > 0) {
                        // Tentamos encontrar um dia da semana equivalente ao atual
                        const dayOfWeek = currentDay.value.getDay();
                        let newDay = previousWeekDays.find(day => day.getDay() === dayOfWeek);
                        // Se não encontramos, pegamos a segunda-feira (ou o primeiro dia disponível)
                        if (!newDay) {
                            newDay = previousWeekDays.find(day => day.getDay() === 1) || previousWeekDays[0];
                        }
                        currentDay.value = newDay;
                    }
                });
            }
        };
        // Ir para próxima semana
        const handleNext = () => {
            if (currentWeekNumber.value < allWeeks.value.length - 1) {
                currentWeekNumber.value++;
                nextTick(() => {
                    const nextWeekDays = allWeeks.value[currentWeekNumber.value];
                    if (nextWeekDays && nextWeekDays.length > 0) {
                        // Tentamos encontrar um dia da semana equivalente ao atual
                        const dayOfWeek = currentDay.value.getDay();
                        let newDay = nextWeekDays.find(day => day.getDay() === dayOfWeek);
                        // Se não encontramos, pegamos a segunda-feira (ou o primeiro dia disponível)
                        if (!newDay) {
                            newDay = nextWeekDays.find(day => day.getDay() === 1) || nextWeekDays[0];
                        }
                        currentDay.value = newDay;
                    }
                });
            }
        };
        // Selecionar um dia específico
        const selectDay = (day) => {
            // Se for fim de semana, não permitir selecionar
            if (isWeekend(day))
                return;
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
        const onDayClick = (day) => {
            emit('day-click', day);
        };
        // Verificar se o dia está desativado
        const isDayDisabled = (day) => {
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
            formatDate: (date, formatStr) => {
                return format(date, formatStr, { locale: ptBR });
            }
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    ChevronLeft,
    ChevronRight,
    CalendarIcon,
    Button,
    DayCard,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Calendar
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['no-scrollbar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center bg-gray-100 rounded-lg p-2" },
});
const __VLS_0 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (__VLS_ctx.isFirstWeek),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (__VLS_ctx.isFirstWeek),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handlePrevious)
};
__VLS_3.slots.default;
const __VLS_8 = {}.ChevronLeft;
/** @type {[typeof __VLS_components.ChevronLeft, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "h-4 w-4" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only" },
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative flex-1 overflow-x-auto py-1 no-scrollbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-center gap-1 min-w-max" },
});
for (const [day] of __VLS_getVForSourceType((__VLS_ctx.visibleWeekDays))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectDay(day);
            } },
        key: (__VLS_ctx.formatDate(day, 'yyyy-MM-dd')),
        ...{ class: "px-3 py-1 rounded-full text-xs font-medium transition-colors" },
        ...{ class: ([
                __VLS_ctx.isSameDay(day, __VLS_ctx.currentDay) ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200',
                __VLS_ctx.isToday(day) && !__VLS_ctx.isSameDay(day, __VLS_ctx.currentDay) && 'ring-1 ring-emerald-500'
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hidden sm:inline mr-1" },
    });
    (__VLS_ctx.formatDate(day, 'EEE'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatDate(day, 'dd'));
}
const __VLS_12 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (__VLS_ctx.isLastWeek),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "h-8 w-8" },
    disabled: (__VLS_ctx.isLastWeek),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onClick: (__VLS_ctx.handleNext)
};
__VLS_15.slots.default;
const __VLS_20 = {}.ChevronRight;
/** @type {[typeof __VLS_components.ChevronRight, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "h-4 w-4" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only" },
});
var __VLS_15;
const __VLS_24 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    name: "day-transition",
    mode: "out-in",
    tag: "div",
}));
const __VLS_26 = __VLS_25({
    name: "day-transition",
    mode: "out-in",
    tag: "div",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    key: (__VLS_ctx.formatDate(__VLS_ctx.currentDay, 'yyyy-MM-dd')),
    ...{ class: "w-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center mb-2 font-medium text-gray-700" },
});
(__VLS_ctx.formatDate(__VLS_ctx.currentDay, "EEEE, dd 'de' MMMM"));
const __VLS_28 = {}.DayCard;
/** @type {[typeof __VLS_components.DayCard, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
    date: (__VLS_ctx.currentDay),
    isDisabled: (__VLS_ctx.isDayDisabled(__VLS_ctx.currentDay)),
    isTroteDay: (__VLS_ctx.isTroteDay(__VLS_ctx.currentDay)),
    isLarge: true,
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
    date: (__VLS_ctx.currentDay),
    isDisabled: (__VLS_ctx.isDayDisabled(__VLS_ctx.currentDay)),
    isTroteDay: (__VLS_ctx.isTroteDay(__VLS_ctx.currentDay)),
    isLarge: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (...[$event]) => {
        __VLS_ctx.onDayClick(__VLS_ctx.currentDay);
    }
};
var __VLS_31;
var __VLS_27;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['no-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-max']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=DayCarousel.vue.js.map