import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-vue-next';
import { CalendarNext, useForwardProps } from 'reka-ui';
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
const __VLS_0 = {}.CalendarNext;
/** @type {[typeof __VLS_components.CalendarNext, typeof __VLS_components.CalendarNext, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "calendar-next-button",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.buttonVariants({ variant: 'outline' }), 'absolute right-1', 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100', props.class)) },
    ...(__VLS_ctx.forwardedProps),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "calendar-next-button",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.buttonVariants({ variant: 'outline' }), 'absolute right-1', 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100', props.class)) },
    ...(__VLS_ctx.forwardedProps),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
var __VLS_5 = {};
const __VLS_7 = {}.ChevronRight;
/** @type {[typeof __VLS_components.ChevronRight, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ class: "size-4" },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "size-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['size-4']} */ ;
// @ts-ignore
var __VLS_6 = __VLS_5;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            buttonVariants: buttonVariants,
            ChevronRight: ChevronRight,
            CalendarNext: CalendarNext,
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
//# sourceMappingURL=CalendarNextButton.vue.js.map