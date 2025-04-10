import { cn } from '@/lib/utils';
import { AlertDialogContent, AlertDialogOverlay, AlertDialogPortal, useForwardPropsEmits, } from 'reka-ui';
import { computed } from 'vue';
const props = defineProps();
const emits = defineEmits();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.AlertDialogPortal;
/** @type {[typeof __VLS_components.AlertDialogPortal, typeof __VLS_components.AlertDialogPortal, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.AlertDialogOverlay;
/** @type {[typeof __VLS_components.AlertDialogOverlay, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    dataSlot: "alert-dialog-overlay",
    ...{ class: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" },
}));
const __VLS_7 = __VLS_6({
    dataSlot: "alert-dialog-overlay",
    ...{ class: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_9 = {}.AlertDialogContent;
/** @type {[typeof __VLS_components.AlertDialogContent, typeof __VLS_components.AlertDialogContent, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    dataSlot: "alert-dialog-content",
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg', props.class)) },
}));
const __VLS_11 = __VLS_10({
    dataSlot: "alert-dialog-content",
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
var __VLS_13 = {};
var __VLS_12;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['data-[state=open]:animate-in']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=closed]:animate-out']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=closed]:fade-out-0']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=open]:fade-in-0']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/80']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            AlertDialogContent: AlertDialogContent,
            AlertDialogOverlay: AlertDialogOverlay,
            AlertDialogPortal: AlertDialogPortal,
            forwarded: forwarded,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AlertDialogContent.vue.js.map