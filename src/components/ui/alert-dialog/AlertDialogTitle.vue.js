import { cn } from '@/lib/utils';
import { AlertDialogTitle } from 'reka-ui';
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
const __VLS_0 = {}.AlertDialogTitle;
/** @type {[typeof __VLS_components.AlertDialogTitle, typeof __VLS_components.AlertDialogTitle, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "alert-dialog-title",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('text-lg font-semibold', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "alert-dialog-title",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('text-lg font-semibold', props.class)) },
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
            AlertDialogTitle: AlertDialogTitle,
            delegatedProps: delegatedProps,
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
//# sourceMappingURL=AlertDialogTitle.vue.js.map