import { cn } from '@/lib/utils';
import { CalendarHeading, useForwardProps } from 'reka-ui';
import { computed } from 'vue';
const props = defineProps();
const __VLS_slots = defineSlots();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.CalendarHeading;
/** @type {[typeof __VLS_components.CalendarHeading, typeof __VLS_components.CalendarHeading, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "calendar-heading",
    ...{ class: (__VLS_ctx.cn('text-sm font-medium', props.class)) },
    ...(__VLS_ctx.forwardedProps),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "calendar-heading",
    ...{ class: (__VLS_ctx.cn('text-sm font-medium', props.class)) },
    ...(__VLS_ctx.forwardedProps),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
{
    const { default: __VLS_thisSlot } = __VLS_3.slots;
    const [{ headingValue }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalSlot(__VLS_slots['default'])({
        headingValue: headingValue,
    });
    (headingValue);
    __VLS_3.slots['' /* empty slot name completion */];
}
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            CalendarHeading: CalendarHeading,
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
//# sourceMappingURL=CalendarHeading.vue.js.map