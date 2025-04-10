import { defineComponent } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm.vue';
import ImageLoader from '@/components/ImageLoader.vue';
import Button from '@/components/ui/button/Button.vue';
export default defineComponent({
    name: "LoginView",
    components: {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
        LoginForm,
        ImageLoader,
        Button
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    LoginForm,
    ImageLoader,
    Button
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "flex justify-center items-start w-full h-screen p-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "w-full h-19/20 md:h-5/6 max-w-md md:max-w-none md:w-4/5 lg:w-3/4 xl:w-2/3 flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden" },
});
const __VLS_0 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-full h-2/3 md:h-full md:flex md:flex-col md:justify-center md:w-1/2 md:rounded-r-none rounded-b-none md:border-r-0 flex flex-col" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-full h-2/3 md:h-full md:flex md:flex-col md:justify-center md:w-1/2 md:rounded-r-none rounded-b-none md:border-r-0 flex flex-col" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.CardHeader;
/** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "flex flex-col justify-center items-center pt-8 md:pt-6" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "flex flex-col justify-center items-center pt-8 md:pt-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.CardTitle;
/** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "text-2xl md:text-3xl" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "text-2xl md:text-3xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
const __VLS_12 = {}.CardDescription;
/** @type {[typeof __VLS_components.CardDescription, typeof __VLS_components.CardDescription, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "text-sm md:text-md" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "text-sm md:text-md" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
var __VLS_7;
const __VLS_16 = {}.CardContent;
/** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "flex flex-col justify-center items-center p-6" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "flex flex-col justify-center items-center p-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.LoginForm;
/** @type {[typeof __VLS_components.LoginForm, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col items-center gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-xs md:text-sm self-center justify-self-center" },
});
const __VLS_24 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: "hover-lift" },
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    variant: "outline",
    ...{ class: "hover-lift" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$router.push('/register');
    }
};
__VLS_27.slots.default;
var __VLS_27;
var __VLS_3;
const __VLS_32 = {}.ImageLoader;
/** @type {[typeof __VLS_components.ImageLoader, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ class: "w-full md:w-1/2 md:h-full md:rounded-l-none" },
}));
const __VLS_34 = __VLS_33({
    ...{ class: "w-full md:w-1/2 md:h-full md:rounded-l-none" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-19/20']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-5/6']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['md:max-w-none']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-4/5']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:w-3/4']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:w-2/3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2/3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-r-none']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-b-none']} */ ;
/** @type {__VLS_StyleScopedClasses['md:border-r-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-md']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['self-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-self-center']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-lift']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-l-none']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=LoginView.vue.js.map