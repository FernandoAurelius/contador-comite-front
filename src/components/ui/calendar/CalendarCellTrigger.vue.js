import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { CalendarCellTrigger, useForwardProps } from 'reka-ui';
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
const __VLS_0 = {}.CalendarCellTrigger;
/** @type {[typeof __VLS_components.CalendarCellTrigger, typeof __VLS_components.CalendarCellTrigger, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "calendar-cell-trigger",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.buttonVariants({ variant: 'ghost' }), 'size-8 p-0 font-normal aria-selected:opacity-100 cursor-default', '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground', 
        // Selected
        'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground', 
        // Disabled
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50', 
        // Unavailable
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through', 
        // Outside months
        'data-[outside-view]:text-muted-foreground', props.class)) },
    ...(__VLS_ctx.forwardedProps),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "calendar-cell-trigger",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.buttonVariants({ variant: 'ghost' }), 'size-8 p-0 font-normal aria-selected:opacity-100 cursor-default', '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground', 
        // Selected
        'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground', 
        // Disabled
        'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50', 
        // Unavailable
        'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through', 
        // Outside months
        'data-[outside-view]:text-muted-foreground', props.class)) },
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
            CalendarCellTrigger: CalendarCellTrigger,
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
//# sourceMappingURL=CalendarCellTrigger.vue.js.map