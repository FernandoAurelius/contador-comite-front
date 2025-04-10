import { defineComponent } from 'vue';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@iconify/vue';
import { useColorMode } from '@vueuse/core';
export default defineComponent({
    name: "ToggleMode",
    components: {
        Switch,
        Icon
    },
    data() {
        return {
            colorMode: useColorMode({ disableTransition: false })
        };
    },
    computed: {
        isDarkMode: {
            get() {
                return this.colorMode === "dark";
            },
            set(value) {
                this.colorMode = value ? "dark" : "light";
            }
        }
    },
    methods: {
        toggleTheme() {
            this.isDarkMode = !this.isDarkMode;
        }
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Switch,
    Icon
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center" },
});
const __VLS_0 = {}.Switch;
/** @type {[typeof __VLS_components.Switch, typeof __VLS_components.Switch, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.isDarkMode),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.isDarkMode),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { thumb: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_4 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        icon: (__VLS_ctx.isDarkMode ? 'radix-icons:moon' : 'radix-icons:sun'),
        ...{ class: "h-3 w-3 text-foreground" },
        ...{ class: ({ 'text-white': __VLS_ctx.isDarkMode }) },
    }));
    const __VLS_6 = __VLS_5({
        icon: (__VLS_ctx.isDarkMode ? 'radix-icons:moon' : 'radix-icons:sun'),
        ...{ class: "h-3 w-3 text-foreground" },
        ...{ class: ({ 'text-white': __VLS_ctx.isDarkMode }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=ToggleMode.vue.js.map