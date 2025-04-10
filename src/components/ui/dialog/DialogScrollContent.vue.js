import { cn } from '@/lib/utils';
import { X } from 'lucide-vue-next';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits, } from 'reka-ui';
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
const __VLS_0 = {}.DialogPortal;
/** @type {[typeof __VLS_components.DialogPortal, typeof __VLS_components.DialogPortal, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.DialogOverlay;
/** @type {[typeof __VLS_components.DialogOverlay, typeof __VLS_components.DialogOverlay, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ 'onPointerDownOutside': {} },
    ...{ class: (__VLS_ctx.cn('relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full', props.class)) },
    ...(__VLS_ctx.forwarded),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onPointerDownOutside': {} },
    ...{ class: (__VLS_ctx.cn('relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full', props.class)) },
    ...(__VLS_ctx.forwarded),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onPointerDownOutside: ((event) => {
        const originalEvent = event.detail.originalEvent;
        const target = originalEvent.target;
        if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
            event.preventDefault();
        }
    })
};
__VLS_12.slots.default;
var __VLS_17 = {};
const __VLS_19 = {}.DialogClose;
/** @type {[typeof __VLS_components.DialogClose, typeof __VLS_components.DialogClose, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    ...{ class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" },
}));
const __VLS_21 = __VLS_20({
    ...{ class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.X;
/** @type {[typeof __VLS_components.X, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    ...{ class: "w-4 h-4" },
}));
const __VLS_25 = __VLS_24({
    ...{ class: "w-4 h-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only" },
});
var __VLS_22;
var __VLS_12;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['place-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/80']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=open]:animate-in']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=closed]:animate-out']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=closed]:fade-out-0']} */ ;
/** @type {__VLS_StyleScopedClasses['data-[state=open]:fade-in-0']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            X: X,
            DialogClose: DialogClose,
            DialogContent: DialogContent,
            DialogOverlay: DialogOverlay,
            DialogPortal: DialogPortal,
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
//# sourceMappingURL=DialogScrollContent.vue.js.map