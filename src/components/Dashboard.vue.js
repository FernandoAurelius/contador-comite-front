import { ArrowDown, ArrowUp, DollarSign, Target } from 'lucide-vue-next';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { defineComponent, Transition } from 'vue';
import { useCapitalStore } from '@/stores/capital';
import { useDespesaStore } from '@/stores/despesas';
import { useMetaStore } from '@/stores/meta';
import { mapState } from 'pinia';
export default defineComponent({
    name: "Dashboard",
    components: {
        Card,
        CardContent,
        Progress,
        ArrowDown,
        ArrowUp,
        DollarSign,
        Target,
        Transition
    },
    computed: {
        ...mapState(useCapitalStore, ['capital']),
        ...mapState(useDespesaStore, ['despesas']),
        ...mapState(useMetaStore, ['meta']),
        // Computed properties para reatividade automática
        totalSpent() {
            return this.despesas.reduce((accumulator, d) => accumulator + d.totalCost, 0);
        },
        progressPercentage() {
            if (!this.meta?.goalValue || !this.meta?.currentValue)
                return 0;
            return (this.meta.currentValue / this.meta.goalValue) * 100;
        },
        remainingToGoal() {
            if (!this.meta?.goalValue || !this.meta?.currentValue)
                return 0;
            return this.meta.goalValue - this.meta.currentValue;
        }
    },
    methods: {
        beforeEnter(el) {
            const htmlEl = el;
            htmlEl.style.opacity = "0";
            htmlEl.style.transform = "translateY(-20px)";
        },
        enter(el, done) {
            const htmlEl = el;
            setTimeout(() => {
                htmlEl.style.transition = "all 0.5s ease";
                htmlEl.style.opacity = "1";
                htmlEl.style.transform = "translateY(0)";
            }, 0);
            el.addEventListener("transitionend", done);
        },
        formatCurrency(value) {
            if (value === undefined || value === null)
                return "0,00";
            return value.toFixed(2).replace('.', ',');
        },
        formatPercentage(value) {
            return value.toFixed(2);
        }
    },
    async created() {
        const capitalStore = useCapitalStore();
        const despesaStore = useDespesaStore();
        const metaStore = useMetaStore();
        try {
            await Promise.all([
                capitalStore.getCapital(),
                despesaStore.getDespesas(),
                metaStore.getMeta()
            ]);
        }
        catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    },
    // Watchers para atualização automática
    watch: {
        'despesas': {
            handler() {
                // Os valores computados serão recalculados automaticamente
                console.log('Despesas atualizadas, recalculando valores...');
            },
            deep: true
        }
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Card,
    CardContent,
    Progress,
    ArrowDown,
    ArrowUp,
    DollarSign,
    Target,
    Transition
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onBeforeEnter': {} },
    ...{ 'onEnter': {} },
    name: "dashboard-fade",
    appear: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onBeforeEnter': {} },
    ...{ 'onEnter': {} },
    name: "dashboard-fade",
    appear: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onBeforeEnter: (__VLS_ctx.beforeEnter)
};
const __VLS_8 = {
    onEnter: (__VLS_ctx.enter)
};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-background rounded-xl shadow-md overflow-hidden border-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-violet-600 dark:to-indigo-900 text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "opacity-90" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6" },
});
const __VLS_9 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.CardContent;
/** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "pt-1" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "pt-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-300 dark:to-teal-400 text-transparent mb-2 font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-2xl font-bold" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.capital?.currentAmount));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-12 w-12 ml-5 rounded-full bg-emerald-100 flex items-center justify-center" },
});
const __VLS_17 = {}.DollarSign;
/** @type {[typeof __VLS_components.DollarSign, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "h-6 w-6 text-emerald-600" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "h-6 w-6 text-emerald-600" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_16;
var __VLS_12;
const __VLS_21 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.CardContent;
/** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    ...{ class: "pt-1" },
}));
const __VLS_27 = __VLS_26({
    ...{ class: "pt-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-300 dark:to-teal-400 text-transparent mb-2 font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-2xl font-bold" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.capital?.totalAmount));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-12 w-12 ml-5 rounded-full bg-emerald-100 flex items-center justify-center" },
});
const __VLS_29 = {}.ArrowUp;
/** @type {[typeof __VLS_components.ArrowUp, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ class: "h-6 w-6 text-green-600" },
}));
const __VLS_31 = __VLS_30({
    ...{ class: "h-6 w-6 text-green-600" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_28;
var __VLS_24;
const __VLS_33 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.CardContent;
/** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    ...{ class: "pt-1" },
}));
const __VLS_39 = __VLS_38({
    ...{ class: "pt-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm bg-clip-text bg-gradient-to-r from-rose-600 to-red-700 text-transparent dark:from-rose-300 dark:to-red-400 mb-2 font-bold" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-2xl font-bold" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.totalSpent));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-12 w-12 ml-5 rounded-full bg-red-100 flex items-center justify-center" },
});
const __VLS_41 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ class: "h-6 w-6 text-red-600" },
}));
const __VLS_43 = __VLS_42({
    ...{ class: "h-6 w-6 text-red-600" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
var __VLS_40;
var __VLS_36;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-6 pb-6" },
});
const __VLS_45 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.CardContent;
/** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ class: "pt-6" },
}));
const __VLS_51 = __VLS_50({
    ...{ class: "pt-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center mb-2" },
});
const __VLS_53 = {}.Target;
/** @type {[typeof __VLS_components.Target, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    ...{ class: "h-5 w-5 text-purple-600 mr-2" },
}));
const __VLS_55 = __VLS_54({
    ...{ class: "h-5 w-5 text-purple-600 mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-medium" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-2" },
});
const __VLS_57 = {}.Progress;
/** @type {[typeof __VLS_components.Progress, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    modelValue: (__VLS_ctx.progressPercentage),
    ...{ class: "h-2" },
}));
const __VLS_59 = __VLS_58({
    modelValue: (__VLS_ctx.progressPercentage),
    ...{ class: "h-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-gray-500" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.meta?.goalValue));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-gray-500" },
});
(__VLS_ctx.formatCurrency(__VLS_ctx.remainingToGoal));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-gray-500" },
});
(__VLS_ctx.formatPercentage(__VLS_ctx.progressPercentage));
var __VLS_52;
var __VLS_48;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-emerald-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:from-violet-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:to-indigo-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-emerald-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:from-emerald-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:to-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-600']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-emerald-500']} */ ;
/** @type {__VLS_StyleScopedClasses['to-teal-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:from-emerald-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:to-teal-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-emerald-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-clip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-r']} */ ;
/** @type {__VLS_StyleScopedClasses['from-rose-600']} */ ;
/** @type {__VLS_StyleScopedClasses['to-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:from-rose-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:to-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=Dashboard.vue.js.map