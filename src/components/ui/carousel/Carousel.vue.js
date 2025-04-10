import { cn } from '@/lib/utils';
import { useProvideCarousel } from './useCarousel';
const props = withDefaults(defineProps(), {
    orientation: 'horizontal',
});
const emits = defineEmits();
const { canScrollNext, canScrollPrev, carouselApi, carouselRef, orientation, scrollNext, scrollPrev } = useProvideCarousel(props, emits);
const __VLS_exposed = {
    canScrollNext,
    canScrollPrev,
    carouselApi,
    carouselRef,
    orientation,
    scrollNext,
    scrollPrev,
};
defineExpose(__VLS_exposed);
function onKeyDown(event) {
    const prevKey = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    if (event.key === prevKey) {
        event.preventDefault();
        scrollPrev();
        return;
    }
    if (event.key === nextKey) {
        event.preventDefault();
        scrollNext();
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    orientation: 'horizontal',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onKeydown: (__VLS_ctx.onKeyDown) },
    'data-slot': "carousel",
    ...{ class: (__VLS_ctx.cn('relative', props.class)) },
    role: "region",
    'aria-roledescription': "carousel",
    tabindex: "0",
});
var __VLS_0 = {
    canScrollNext: __VLS_ctx.canScrollNext,
    canScrollPrev: __VLS_ctx.canScrollPrev,
    carouselApi: __VLS_ctx.carouselApi,
    carouselRef: __VLS_ctx.carouselRef,
    orientation: __VLS_ctx.orientation,
    scrollNext: __VLS_ctx.scrollNext,
    scrollPrev: __VLS_ctx.scrollPrev,
};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            canScrollNext: canScrollNext,
            canScrollPrev: canScrollPrev,
            carouselApi: carouselApi,
            carouselRef: carouselRef,
            orientation: orientation,
            scrollNext: scrollNext,
            scrollPrev: scrollPrev,
            onKeyDown: onKeyDown,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Carousel.vue.js.map