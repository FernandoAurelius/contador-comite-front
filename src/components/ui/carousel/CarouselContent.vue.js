import { cn } from '@/lib/utils';
import { useCarousel } from './useCarousel';
defineOptions({
    inheritAttrs: false,
});
const props = defineProps();
const { carouselRef, orientation } = useCarousel();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "carouselRef",
    'data-slot': "carousel-content",
    ...{ class: "overflow-hidden" },
});
/** @type {typeof __VLS_ctx.carouselRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: (__VLS_ctx.cn('flex', __VLS_ctx.orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', props.class)) },
});
var __VLS_0 = {};
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0;
[__VLS_dollars.$attrs,];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            carouselRef: carouselRef,
            orientation: orientation,
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
//# sourceMappingURL=CarouselContent.vue.js.map