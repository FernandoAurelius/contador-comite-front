import { defineComponent } from 'vue';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Coffee, Droplet, IceCream } from 'lucide-vue-next';
import useVendaStore from '@/stores/vendas';
export default defineComponent({
    name: "DayCard",
    components: {
        Coffee,
        Droplet,
        IceCream
    },
    props: {
        date: {
            type: Object,
            required: true
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        isTroteDay: {
            type: Boolean,
            default: false
        },
        isLarge: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            sales: [],
            hasSales: false,
            sodaCups: 0,
            sodaBottles: 0,
            popsicles: 0,
            scale: 1,
            isHovering: false,
            isTapping: false
        };
    },
    computed: {
        animationStyle() {
            // Só aplicamos escala se não estiver desabilitado
            if (this.isDisabled)
                return {};
            return {
                transform: `scale(${this.scale})`,
                transition: 'transform 0.2s ease'
            };
        }
    },
    created() {
        this.fetchSalesData();
    },
    methods: {
        isToday,
        formatDate(date, formatStr) {
            return format(date, formatStr, { locale: ptBR });
        },
        onClick() {
            this.$emit('click', this.date);
        },
        startHover() {
            if (!this.isDisabled) {
                this.isHovering = true;
                this.scale = 1.03;
            }
        },
        endHover() {
            this.isHovering = false;
            if (!this.isTapping) {
                this.scale = 1;
            }
        },
        startTap() {
            if (!this.isDisabled) {
                this.isTapping = true;
                this.scale = 0.98;
            }
        },
        endTap() {
            this.isTapping = false;
            if (this.isHovering) {
                this.scale = 1.03;
            }
            else {
                this.scale = 1;
            }
        },
        async fetchSalesData() {
            const vendaStore = useVendaStore();
            if (this.date && this.date instanceof Date) {
                try {
                    // Formatamos a data no formato esperado pelo backend (dd-MM-yyyy)
                    const day = this.date.getDate().toString().padStart(2, '0');
                    const month = (this.date.getMonth() + 1).toString().padStart(2, '0');
                    const year = this.date.getFullYear();
                    const dateStr = `${year}-${month}-${day}`;
                    this.sales = await vendaStore.getVendaByDate(dateStr);
                    this.hasSales = this.sales && this.sales.length > 0;
                    // Contar os diferentes tipos de vendas
                    this.sodaCups = this.countItemType('REFRI_COPO');
                    this.sodaBottles = this.countItemType('REFRI_GARRAFA');
                    this.popsicles = this.countItemType('PICOLE');
                }
                catch (error) {
                    console.error('Erro ao buscar vendas:', error);
                    this.hasSales = false;
                    // Definir valores padrão para não causar mais erros
                    this.sodaCups = 0;
                    this.sodaBottles = 0;
                    this.popsicles = 0;
                }
            }
            else {
                console.warn('Data inválida fornecida ao componente DayCard');
                this.hasSales = false;
            }
        },
        countItemType(type) {
            if (!this.sales || !Array.isArray(this.sales))
                return 0;
            return this.sales
                .filter(sale => sale && sale.itemType === type)
                .reduce((sum, sale) => sum + (sale.quantity || 0), 0);
        }
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Coffee,
    Droplet,
    IceCream
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    name: "card-hover",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    name: "card-hover",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onMouseenter: (__VLS_ctx.startHover)
};
const __VLS_8 = {
    onMouseleave: (__VLS_ctx.endHover)
};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            !__VLS_ctx.isDisabled ? __VLS_ctx.onClick() : undefined;
        } },
    ...{ onMousedown: (__VLS_ctx.startTap) },
    ...{ onMouseup: (__VLS_ctx.endTap) },
    ...{ onMouseleave: (__VLS_ctx.endTap) },
    ...{ class: "bg-white rounded-lg shadow-sm border p-2 sm:p-3 h-20 sm:h-24 md:h-28 lg:h-32 cursor-pointer transition-colors text-xs sm:text-sm" },
    ...{ class: ([
            __VLS_ctx.isToday(__VLS_ctx.date) && 'border-emerald-500 border-2',
            __VLS_ctx.isDisabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            __VLS_ctx.hasSales && 'bg-emerald-50'
        ]) },
    ...{ style: (__VLS_ctx.animationStyle) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col h-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center mb-1 sm:mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm font-medium" },
    ...{ class: ({ 'text-emerald-600': __VLS_ctx.isToday(__VLS_ctx.date) }) },
});
(__VLS_ctx.formatDate(__VLS_ctx.date, 'dd'));
if (__VLS_ctx.isTroteDay) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[0.65rem] sm:text-xs" },
    });
}
if (__VLS_ctx.hasSales) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col gap-0.5 sm:gap-1 mt-auto overflow-hidden" },
    });
    if (__VLS_ctx.sodaCups > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center text-xs text-gray-600 truncate" },
        });
        const __VLS_9 = {}.Droplet;
        /** @type {[typeof __VLS_components.Droplet, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
            ...{ class: "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" },
        }));
        const __VLS_11 = __VLS_10({
            ...{ class: "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-[0.65rem] sm:text-xs truncate" },
        });
        (__VLS_ctx.sodaCups);
    }
    if (__VLS_ctx.sodaBottles > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center text-xs text-gray-600 truncate" },
        });
        const __VLS_13 = {}.Coffee;
        /** @type {[typeof __VLS_components.Coffee, ]} */ ;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
            ...{ class: "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" },
        }));
        const __VLS_15 = __VLS_14({
            ...{ class: "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-[0.65rem] sm:text-xs truncate" },
        });
        (__VLS_ctx.sodaBottles);
    }
    if (__VLS_ctx.popsicles > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center text-xs text-gray-600 truncate" },
        });
        const __VLS_17 = {}.IceCream;
        /** @type {[typeof __VLS_components.IceCream, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            ...{ class: "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" },
        }));
        const __VLS_19 = __VLS_18({
            ...{ class: "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-[0.65rem] sm:text-xs truncate" },
        });
        (__VLS_ctx.popsicles);
    }
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-20']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-28']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[0.65rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=DayCard.vue.js.map