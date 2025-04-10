import { defineComponent, ref, onMounted } from 'vue';
import { X, DollarSign, Loader2, AlertCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useCapitalStore } from '@/stores/capital';
export default defineComponent({
    name: 'InitialCapitalModal',
    components: {
        X, DollarSign, Loader2, AlertCircle,
        Button, Input, Label, Alert, AlertTitle, AlertDescription
    },
    emits: ['close'],
    setup(_, { emit }) {
        const isOpen = ref(false);
        const initialAmount = ref('');
        const loading = ref(false);
        const error = ref(null);
        const capitalStore = useCapitalStore();
        // Verificar se o capital inicial já foi definido
        onMounted(async () => {
            try {
                const capitalStatus = await capitalStore.getCapital();
                // Só mostra o modal se o capital inicial não tiver sido definido
                if (!capitalStatus.initialSetted) {
                    isOpen.value = true;
                }
            }
            catch (err) {
                console.error('Erro ao verificar status do capital:', err);
            }
        });
        const saveInitialAmount = async () => {
            if (!initialAmount.value || parseFloat(initialAmount.value) < 0) {
                error.value = 'Por favor, insira um valor válido.';
                return;
            }
            loading.value = true;
            error.value = null;
            try {
                await capitalStore.setInitialCapital(parseFloat(initialAmount.value));
                closeModal();
            }
            catch (err) {
                console.error('Erro ao salvar valor inicial:', err);
                error.value = 'Ocorreu um erro ao salvar o valor. Tente novamente.';
            }
            finally {
                loading.value = false;
            }
        };
        const closeModal = () => {
            isOpen.value = false;
            emit('close');
        };
        return {
            isOpen,
            initialAmount,
            loading,
            error,
            saveInitialAmount,
            closeModal
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    X, DollarSign, Loader2, AlertCircle,
    Button, Input, Label, Alert, AlertTitle, AlertDescription
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    name: "modal-fade",
}));
const __VLS_6 = __VLS_5({
    name: "modal-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.closeModal) },
        ...{ class: "fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: () => { } },
        ...{ class: "bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-4 sm:p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg sm:text-xl font-bold" },
    });
    const __VLS_8 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.closeModal)
    };
    __VLS_11.slots.default;
    const __VLS_16 = {}.X;
    /** @type {[typeof __VLS_components.X, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ class: "h-5 w-5" },
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "h-5 w-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sr-only" },
    });
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm sm:text-base" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2" },
    });
    const __VLS_20 = {}.Label;
    /** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        for: "initial-amount",
    }));
    const __VLS_22 = __VLS_21({
        for: "initial-amount",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative" },
    });
    const __VLS_24 = {}.DollarSign;
    /** @type {[typeof __VLS_components.DollarSign, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_28 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        id: "initial-amount",
        type: "number",
        modelValue: (__VLS_ctx.initialAmount),
        placeholder: "0.00",
        ...{ class: "pl-10" },
        min: "0",
        step: "0.01",
    }));
    const __VLS_30 = __VLS_29({
        id: "initial-amount",
        type: "number",
        modelValue: (__VLS_ctx.initialAmount),
        placeholder: "0.00",
        ...{ class: "pl-10" },
        min: "0",
        step: "0.01",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    if (__VLS_ctx.error) {
        const __VLS_32 = {}.Alert;
        /** @type {[typeof __VLS_components.Alert, typeof __VLS_components.Alert, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            variant: "destructive",
        }));
        const __VLS_34 = __VLS_33({
            variant: "destructive",
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        const __VLS_36 = {}.AlertCircle;
        /** @type {[typeof __VLS_components.AlertCircle, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            ...{ class: "h-4 w-4" },
        }));
        const __VLS_38 = __VLS_37({
            ...{ class: "h-4 w-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        const __VLS_40 = {}.AlertTitle;
        /** @type {[typeof __VLS_components.AlertTitle, typeof __VLS_components.AlertTitle, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
        const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        var __VLS_43;
        const __VLS_44 = {}.AlertDescription;
        /** @type {[typeof __VLS_components.AlertDescription, typeof __VLS_components.AlertDescription, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
        const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
        __VLS_47.slots.default;
        (__VLS_ctx.error);
        var __VLS_47;
        var __VLS_35;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-end" },
    });
    const __VLS_48 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (__VLS_ctx.saveInitialAmount)
    };
    __VLS_51.slots.default;
    if (__VLS_ctx.loading) {
        const __VLS_56 = {}.Loader2;
        /** @type {[typeof __VLS_components.Loader2, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            ...{ class: "mr-2 h-4 w-4 animate-spin" },
        }));
        const __VLS_58 = __VLS_57({
            ...{ class: "mr-2 h-4 w-4 animate-spin" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    }
    var __VLS_51;
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=InitialCapitalModal.vue.js.map