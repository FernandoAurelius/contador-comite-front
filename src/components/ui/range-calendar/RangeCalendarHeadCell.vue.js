import { cn } from '@/lib/utils';
import { RangeCalendarHeadCell, useForwardProps } from 'reka-ui';
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
const __VLS_0 = {}.RangeCalendarHeadCell;
/** @type {[typeof __VLS_components.RangeCalendarHeadCell, typeof __VLS_components.RangeCalendarHeadCell, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "range-calendar-head-cell",
    ...{ class: (__VLS_ctx.cn('w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground', props.class)) },
    ...(__VLS_ctx.forwardedProps),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "range-calendar-head-cell",
    ...{ class: (__VLS_ctx.cn('w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground', props.class)) },
    ...(__VLS_ctx.forwardedProps),
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
            RangeCalendarHeadCell: RangeCalendarHeadCell,
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
//# sourceMappingURL=RangeCalendarHeadCell.vue.js.map