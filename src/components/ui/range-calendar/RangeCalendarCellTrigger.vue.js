import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { RangeCalendarCellTrigger, useForwardProps } from 'reka-ui';
import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    as: 'button',
});
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    as: 'button',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.RangeCalendarCellTrigger;
/** @type {[typeof __VLS_components.RangeCalendarCellTrigger, typeof __VLS_components.RangeCalendarCellTrigger, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "range-calendar-trigger",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0 font-normal data-[selected]:opacity-100', '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground', 
        // Selection Start
        'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground', 
        // Selection End
        'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground', 
        // Outside months
        'data-[outside-view]:text-muted-foreground', 
        // Disabled
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50', 
        // Unavailable
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through', props.class)) },
    ...(__VLS_ctx.forwardedProps),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "range-calendar-trigger",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0 font-normal data-[selected]:opacity-100', '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground', 
        // Selection Start
        'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground', 
        // Selection End
        'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground', 
        // Outside months
        'data-[outside-view]:text-muted-foreground', 
        // Disabled
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50', 
        // Unavailable
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through', props.class)) },
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
            buttonVariants: buttonVariants,
            RangeCalendarCellTrigger: RangeCalendarCellTrigger,
            forwardedProps: forwardedProps,
        };
    },
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RangeCalendarCellTrigger.vue.js.map