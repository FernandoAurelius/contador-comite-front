import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-vue-next';
import { useCarousel } from './useCarousel';
const props = withDefaults(defineProps(), {
    variant: 'outline',
    size: 'icon',
});
const { orientation, canScrollPrev, scrollPrev } = useCarousel();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    variant: 'outline',
    size: 'icon',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    dataSlot: "carousel-previous",
    disabled: (!__VLS_ctx.canScrollPrev),
    ...{ class: (__VLS_ctx.cn('absolute size-8 rounded-full', __VLS_ctx.orientation === 'horizontal'
            ? 'top-1/2 -left-12 -translate-y-1/2'
            : '-top-12 left-1/2 -translate-x-1/2 rotate-90', props.class)) },
    variant: (__VLS_ctx.variant),
    size: (__VLS_ctx.size),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    dataSlot: "carousel-previous",
    disabled: (!__VLS_ctx.canScrollPrev),
    ...{ class: (__VLS_ctx.cn('absolute size-8 rounded-full', __VLS_ctx.orientation === 'horizontal'
            ? 'top-1/2 -left-12 -translate-y-1/2'
            : '-top-12 left-1/2 -translate-x-1/2 rotate-90', props.class)) },
    variant: (__VLS_ctx.variant),
    size: (__VLS_ctx.size),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.scrollPrev)
};
var __VLS_8 = {};
__VLS_3.slots.default;
var __VLS_9 = {};
const __VLS_11 = {}.ArrowLeft;
/** @type {[typeof __VLS_components.ArrowLeft, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only" },
});
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
// @ts-ignore
var __VLS_10 = __VLS_9;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            Button: Button,
            ArrowLeft: ArrowLeft,
            orientation: orientation,
            canScrollPrev: canScrollPrev,
            scrollPrev: scrollPrev,
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
//# sourceMappingURL=CarouselPrevious.vue.js.map