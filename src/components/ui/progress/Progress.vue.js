import { cn } from '@/lib/utils';
import { ProgressIndicator, ProgressRoot, } from 'reka-ui';
import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    modelValue: 0,
});
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    modelValue: 0,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ProgressRoot;
/** @type {[typeof __VLS_components.ProgressRoot, typeof __VLS_components.ProgressRoot, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "progress",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "progress",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ProgressIndicator;
/** @type {[typeof __VLS_components.ProgressIndicator, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    dataSlot: "progress-indicator",
    ...{ class: "bg-primary h-full w-full flex-1 transition-all" },
    ...{ style: (`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`) },
}));
const __VLS_7 = __VLS_6({
    dataSlot: "progress-indicator",
    ...{ class: "bg-primary h-full w-full flex-1 transition-all" },
    ...{ style: (`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`) },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            ProgressIndicator: ProgressIndicator,
            ProgressRoot: ProgressRoot,
            delegatedProps: delegatedProps,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Progress.vue.js.map