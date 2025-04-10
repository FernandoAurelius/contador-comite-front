import { cn } from '@/lib/utils';
import { SelectSeparator } from 'reka-ui';
import { computed } from 'vue';
const props = defineProps();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.SelectSeparator;
/** @type {[typeof __VLS_components.SelectSeparator, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "select-separator",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('bg-border pointer-events-none -mx-1 my-1 h-px', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "select-separator",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('bg-border pointer-events-none -mx-1 my-1 h-px', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            SelectSeparator: SelectSeparator,
            delegatedProps: delegatedProps,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SelectSeparator.vue.js.map