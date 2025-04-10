import { cn } from '@/lib/utils';
import { useCarousel } from './useCarousel';
const props = defineProps();
const { orientation } = useCarousel();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    'data-slot': "carousel-item",
    role: "group",
    'aria-roledescription': "slide",
    ...{ class: (__VLS_ctx.cn('min-w-0 shrink-0 grow-0 basis-full', __VLS_ctx.orientation === 'horizontal' ? 'pl-4' : 'pt-4', props.class)) },
});
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
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
//# sourceMappingURL=CarouselItem.vue.js.map