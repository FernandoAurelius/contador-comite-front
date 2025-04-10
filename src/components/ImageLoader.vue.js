import { defineComponent } from 'vue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
export default defineComponent({
    name: "ImageLoader",
    data() {
        return {
            images: [],
            plugins: [Autoplay({ delay: 3500 })],
            currentIndex: 0
        };
    },
    created() {
        this.images = [
            "asilo2.jpg",
            "asilo3.jpg",
            "genero1.jpg"
        ];
    },
    methods: {
        getImagePath(image) {
            return `/${image}`;
        },
        goToSlide(index) {
            this.currentIndex = index;
            // Implemente a navegação do carrossel aqui quando necessário
        }
    },
    components: {
        Carousel,
        CarouselNext,
        CarouselPrevious,
        CarouselContent,
        CarouselItem
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Carousel,
    CarouselNext,
    CarouselPrevious,
    CarouselContent,
    CarouselItem
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "w-full h-1/3 md:w-1/2 rounded-b-xl md:rounded-b-none md:rounded-r-xl flex items-center justify-center overflow-hidden" },
});
const __VLS_0 = {}.Carousel;
/** @type {[typeof __VLS_components.Carousel, typeof __VLS_components.Carousel, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    plugins: (__VLS_ctx.plugins),
    ...{ class: "w-full h-full" },
}));
const __VLS_2 = __VLS_1({
    plugins: (__VLS_ctx.plugins),
    ...{ class: "w-full h-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.CarouselContent;
/** @type {[typeof __VLS_components.CarouselContent, typeof __VLS_components.CarouselContent, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "h-full" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "h-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
for (const [image, index] of __VLS_getVForSourceType((__VLS_ctx.images))) {
    const __VLS_8 = {}.CarouselItem;
    /** @type {[typeof __VLS_components.CarouselItem, typeof __VLS_components.CarouselItem, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        key: (index),
        src: (__VLS_ctx.images.at(index)),
        ...{ class: "h-full !pt-0 object-fill" },
    }));
    const __VLS_10 = __VLS_9({
        key: (index),
        src: (__VLS_ctx.images.at(index)),
        ...{ class: "h-full !pt-0 object-fill" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-center w-full h-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
        src: (__VLS_ctx.getImagePath(image)),
        ...{ class: "object-cover w-full h-full" },
        alt: "Imagem institucional",
        loading: "lazy",
    });
    var __VLS_11;
}
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute bottom-2 left-0 right-0 flex justify-center gap-1.5" },
});
for (const [_, index] of __VLS_getVForSourceType((__VLS_ctx.images))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.goToSlide(index);
            } },
        key: (index),
        ...{ class: "w-2 h-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors" },
        ...{ class: ({ 'bg-white': __VLS_ctx.currentIndex === index }) },
    });
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-1/3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-b-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-b-none']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-r-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['object-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white/70']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white/90']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=ImageLoader.vue.js.map