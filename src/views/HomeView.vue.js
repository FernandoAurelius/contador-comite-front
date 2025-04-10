import { defineComponent } from 'vue';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import DayCarousel from '@/components/DayCarousel.vue';
import DayModal from '@/components/DayModal.vue';
import Dashboard from '@/components/Dashboard.vue';
import InitialCapitalModal from '@/components/InitialCapitalModal.vue';
import ExpensesSection from '@/components/ExpensesSection.vue';
import GoalsSection from '@/components/GoalsSection.vue';
import { useCapitalStore } from '@/stores/capital';
import useVendaStore from '@/stores/vendas';
import { useMediaQuery } from '@/composables/useMediaQuery';
import { mapState } from 'pinia';
import { useDespesaStore } from '@/stores/despesas';
import { useMetaStore } from '@/stores/meta';
import { toast } from 'vue-sonner';
export default defineComponent({
    name: 'HomeView',
    components: {
        Button, ChevronLeft, ChevronRight, Plus, Calendar,
        Tabs, TabsContent, TabsList, TabsTrigger,
        Popover, PopoverContent, PopoverTrigger, CalendarComponent,
        DayCarousel, DayModal, Dashboard, InitialCapitalModal, ExpensesSection, GoalsSection
    },
    data() {
        return {
            // Estados da aplicação
            currentWeek: new Date(),
            selectedDay: new Date(),
            isModalOpen: false,
            // Data limite para eventos (29 de agosto de 2025)
            endDate: new Date(2025, 7, 29),
        };
    },
    computed: {
        ...mapState(useCapitalStore, ['capital']),
        ...mapState(useDespesaStore, ['despesas']),
        ...mapState(useVendaStore, ['vendas']),
        isMobile() {
            return useMediaQuery('(max-width: 640px)');
        },
        weekStart() {
            return startOfWeek(this.currentWeek, { weekStartsOn: 0 });
        },
        weekDays() {
            return Array.from({ length: 7 }).map((_, i) => addDays(this.weekStart, i));
        },
        isNextWeekDisabled() {
            return isAfter(startOfWeek(addWeeks(this.currentWeek, 1)), this.endDate);
        },
        currentBalance() {
            return this.capital?.currentAmount - this.despesas.reduce((ac, d) => ac + d.totalCost, 0);
        }
    },
    methods: {
        formatDate(date, formatStr) {
            return format(date, formatStr, { locale: ptBR });
        },
        selectWeek(date) {
            const jsDate = new Date(date.year, date.month - 1, date.day);
            this.currentWeek = jsDate;
            const newWeekStart = startOfWeek(jsDate, { weekStartsOn: 1 }); // Segunda como início
        },
        handlePreviousWeek() {
            this.currentWeek = subWeeks(this.currentWeek, 1);
        },
        handleNextWeek() {
            const nextWeek = addWeeks(this.currentWeek, 1);
            if (isBefore(startOfWeek(nextWeek), this.endDate)) {
                this.currentWeek = nextWeek;
            }
        },
        isAfterEndDate(day) {
            return isAfter(day, this.endDate);
        },
        handleDayClick(day) {
            this.selectedDay = day;
            this.isModalOpen = true;
        },
        handleQuickAddSale() {
            this.selectedDay = new Date();
            this.isModalOpen = true;
        },
        async handleAddExpense(expense) {
            console.log('Despesa recebida:', expense);
            const store = useDespesaStore();
            try {
                await store.addDespesa(expense);
                this.refreshDashboard();
            }
            catch (error) {
                console.error("Erro ao adicionar despesa", error);
            }
        },
        async handleAddSale(sale) {
            const vendaStore = useVendaStore();
            try {
                await vendaStore.getVendas();
                toast('Venda salva com sucesso!');
            }
            catch (error) {
                toast('Erro ao salvar venda', {
                    description: `${error}`
                });
            }
        },
        handleCloseInitialCapitalModal() {
            const capitalStore = useCapitalStore();
            capitalStore.getCapital();
        },
        refreshDashboard() {
            const capitalStore = useCapitalStore();
            const despesaStore = useDespesaStore();
            const metaStore = useMetaStore();
            // Recarregar todos os dados necessários
            Promise.all([
                capitalStore.getCapital(),
                despesaStore.getDespesas(),
                metaStore.getMeta()
            ]);
        },
        addDays: addDays
    },
    mounted() {
        const capitalStore = useCapitalStore();
        const vendaStore = useVendaStore();
        const despesaStore = useDespesaStore();
        const metaStore = useMetaStore();
        capitalStore.getCapital();
        vendaStore.getVendas();
        despesaStore.getDespesas();
        metaStore.getMeta();
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Button, ChevronLeft, ChevronRight, Plus, Calendar,
    Tabs, TabsContent, TabsList, TabsTrigger,
    Popover, PopoverContent, PopoverTrigger, CalendarComponent,
    DayCarousel, DayModal, Dashboard, InitialCapitalModal, ExpensesSection, GoalsSection
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container mx-auto px-4 py-4 sm:py-8 max-w-6xl" },
});
const __VLS_0 = {}.Dashboard;
/** @type {[typeof __VLS_components.Dashboard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ref: "dashboard",
}));
const __VLS_2 = __VLS_1({
    ref: "dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {typeof __VLS_ctx.dashboard} */ ;
var __VLS_4 = {};
var __VLS_3;
const __VLS_6 = {}.Tabs;
/** @type {[typeof __VLS_components.Tabs, typeof __VLS_components.Tabs, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    defaultValue: "calendar",
    ...{ class: "mt-6 sm:mt-8" },
}));
const __VLS_8 = __VLS_7({
    defaultValue: "calendar",
    ...{ class: "mt-6 sm:mt-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
const __VLS_10 = {}.TabsList;
/** @type {[typeof __VLS_components.TabsList, typeof __VLS_components.TabsList, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    ...{ class: "grid w-full grid-cols-2" },
}));
const __VLS_12 = __VLS_11({
    ...{ class: "grid w-full grid-cols-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
const __VLS_14 = {}.TabsTrigger;
/** @type {[typeof __VLS_components.TabsTrigger, typeof __VLS_components.TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    value: "calendar",
}));
const __VLS_16 = __VLS_15({
    value: "calendar",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
var __VLS_17;
const __VLS_18 = {}.TabsTrigger;
/** @type {[typeof __VLS_components.TabsTrigger, typeof __VLS_components.TabsTrigger, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    value: "expenses",
}));
const __VLS_20 = __VLS_19({
    value: "expenses",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
var __VLS_21;
var __VLS_13;
const __VLS_22 = {}.TabsContent;
/** @type {[typeof __VLS_components.TabsContent, typeof __VLS_components.TabsContent, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    value: "calendar",
    ...{ class: "mt-4" },
}));
const __VLS_24 = __VLS_23({
    value: "calendar",
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-full sm:w-auto flex justify-between sm:justify-start gap-2" },
});
const __VLS_26 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: "flex items-center gap-1 transition-all hover:gap-2" },
}));
const __VLS_28 = __VLS_27({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: "flex items-center gap-1 transition-all hover:gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_30;
let __VLS_31;
let __VLS_32;
const __VLS_33 = {
    onClick: (__VLS_ctx.handlePreviousWeek)
};
__VLS_29.slots.default;
const __VLS_34 = {}.ChevronLeft;
/** @type {[typeof __VLS_components.ChevronLeft, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    ...{ class: "h-4 w-4" },
}));
const __VLS_36 = __VLS_35({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only sm:not-sr-only sm:inline" },
});
var __VLS_29;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-base sm:text-xl font-medium text-gray-700 text-center" },
});
(__VLS_ctx.formatDate(__VLS_ctx.weekStart, "dd 'de' MMM"));
(__VLS_ctx.formatDate(__VLS_ctx.addDays(__VLS_ctx.weekStart, 6), "dd 'de' MMM"));
const __VLS_38 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    ...{ 'onClick': {} },
    variant: "outline",
    disabled: (__VLS_ctx.isNextWeekDisabled),
    ...{ class: "flex items-center gap-1 transition-all hover:gap-2" },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClick': {} },
    variant: "outline",
    disabled: (__VLS_ctx.isNextWeekDisabled),
    ...{ class: "flex items-center gap-1 transition-all hover:gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_42;
let __VLS_43;
let __VLS_44;
const __VLS_45 = {
    onClick: (__VLS_ctx.handleNextWeek)
};
__VLS_41.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only sm:not-sr-only sm:inline" },
});
const __VLS_46 = {}.ChevronRight;
/** @type {[typeof __VLS_components.ChevronRight, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    ...{ class: "h-4 w-4" },
}));
const __VLS_48 = __VLS_47({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
var __VLS_41;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hidden sm:block" },
});
const __VLS_50 = {}.Popover;
/** @type {[typeof __VLS_components.Popover, typeof __VLS_components.Popover, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({}));
const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
const __VLS_54 = {}.PopoverTrigger;
/** @type {[typeof __VLS_components.PopoverTrigger, typeof __VLS_components.PopoverTrigger, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    asChild: true,
}));
const __VLS_56 = __VLS_55({
    asChild: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    variant: "outline",
    ...{ class: "gap-1" },
}));
const __VLS_60 = __VLS_59({
    variant: "outline",
    ...{ class: "gap-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_61.slots.default;
const __VLS_62 = {}.Calendar;
/** @type {[typeof __VLS_components.Calendar, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    ...{ class: "h-4 w-4" },
}));
const __VLS_64 = __VLS_63({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_61;
var __VLS_57;
const __VLS_66 = {}.PopoverContent;
/** @type {[typeof __VLS_components.PopoverContent, typeof __VLS_components.PopoverContent, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    ...{ class: "w-auto p-0" },
    align: "end",
}));
const __VLS_68 = __VLS_67({
    ...{ class: "w-auto p-0" },
    align: "end",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.CalendarComponent;
/** @type {[typeof __VLS_components.CalendarComponent, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    ...{ 'onUpdate:modelValue': {} },
    mode: "single",
    selected: (__VLS_ctx.currentWeek),
}));
const __VLS_72 = __VLS_71({
    ...{ 'onUpdate:modelValue': {} },
    mode: "single",
    selected: (__VLS_ctx.currentWeek),
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_74;
let __VLS_75;
let __VLS_76;
const __VLS_77 = {
    'onUpdate:modelValue': (__VLS_ctx.selectWeek)
};
var __VLS_73;
var __VLS_69;
var __VLS_53;
const __VLS_78 = {}.DayCarousel;
/** @type {[typeof __VLS_components.DayCarousel, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    ...{ 'onDayClick': {} },
    days: (__VLS_ctx.weekDays),
    isDisabled: (__VLS_ctx.isAfterEndDate),
}));
const __VLS_80 = __VLS_79({
    ...{ 'onDayClick': {} },
    days: (__VLS_ctx.weekDays),
    isDisabled: (__VLS_ctx.isAfterEndDate),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
let __VLS_82;
let __VLS_83;
let __VLS_84;
const __VLS_85 = {
    onDayClick: (__VLS_ctx.handleDayClick)
};
var __VLS_81;
var __VLS_25;
const __VLS_86 = {}.TabsContent;
/** @type {[typeof __VLS_components.TabsContent, typeof __VLS_components.TabsContent, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    value: "expenses",
    ...{ class: "mt-4" },
}));
const __VLS_88 = __VLS_87({
    value: "expenses",
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.ExpensesSection;
/** @type {[typeof __VLS_components.ExpensesSection, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    ...{ 'onAddExpense': {} },
    ...{ 'onExpenseUpdated': {} },
    ...{ 'onExpenseDeleted': {} },
    expenses: (__VLS_ctx.despesas),
}));
const __VLS_92 = __VLS_91({
    ...{ 'onAddExpense': {} },
    ...{ 'onExpenseUpdated': {} },
    ...{ 'onExpenseDeleted': {} },
    expenses: (__VLS_ctx.despesas),
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
let __VLS_94;
let __VLS_95;
let __VLS_96;
const __VLS_97 = {
    onAddExpense: (__VLS_ctx.handleAddExpense)
};
const __VLS_98 = {
    onExpenseUpdated: (__VLS_ctx.refreshDashboard)
};
const __VLS_99 = {
    onExpenseDeleted: (__VLS_ctx.refreshDashboard)
};
var __VLS_93;
var __VLS_89;
var __VLS_9;
if (__VLS_ctx.isModalOpen && __VLS_ctx.selectedDay) {
    const __VLS_100 = {}.DayModal;
    /** @type {[typeof __VLS_components.DayModal, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onUpdate:isOpen': {} },
        ...{ 'onSave': {} },
        date: (__VLS_ctx.selectedDay),
        isOpen: (__VLS_ctx.isModalOpen),
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onUpdate:isOpen': {} },
        ...{ 'onSave': {} },
        date: (__VLS_ctx.selectedDay),
        isOpen: (__VLS_ctx.isModalOpen),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        'onUpdate:isOpen': (...[$event]) => {
            if (!(__VLS_ctx.isModalOpen && __VLS_ctx.selectedDay))
                return;
            __VLS_ctx.isModalOpen = $event;
        }
    };
    const __VLS_108 = {
        onSave: (__VLS_ctx.handleAddSale)
    };
    var __VLS_103;
}
const __VLS_109 = {}.InitialCapitalModal;
/** @type {[typeof __VLS_components.InitialCapitalModal, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    ...{ 'onClose': {} },
}));
const __VLS_111 = __VLS_110({
    ...{ 'onClose': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
let __VLS_113;
let __VLS_114;
let __VLS_115;
const __VLS_116 = {
    onClose: (__VLS_ctx.handleCloseInitialCapitalModal)
};
var __VLS_112;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:not-sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:not-sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:block']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=HomeView.vue.js.map