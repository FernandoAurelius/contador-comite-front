import { cn } from '@/lib/utils';
import { DialogTitle, useForwardProps } from 'reka-ui';
import { computed } from 'vue';
const props = defineProps();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "dialog-title",
    ...(__VLS_ctx.forwardedProps),
    ...{ class: (__VLS_ctx.cn('text-lg leading-none font-semibold', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "dialog-title",
    ...(__VLS_ctx.forwardedProps),
    ...{ class: (__VLS_ctx.cn('text-lg leading-none font-semibold', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
var __VLS_5 = {};
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            DialogTitle: DialogTitle,
            forwardedProps: forwardedProps,
        };
    },
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DialogTitle.vue.js.map