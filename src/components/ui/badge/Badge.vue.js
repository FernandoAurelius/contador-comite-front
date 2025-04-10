import { cn } from '@/lib/utils';
import { Primitive } from 'reka-ui';
import { computed } from 'vue';
import { badgeVariants } from '.';
const props = defineProps();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Primitive;
/** @type {[typeof __VLS_components.Primitive, typeof __VLS_components.Primitive, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "badge",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.badgeVariants({ variant: __VLS_ctx.variant }), props.class)) },
    ...(__VLS_ctx.delegatedProps),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "badge",
    ...{ class: (__VLS_ctx.cn(__VLS_ctx.badgeVariants({ variant: __VLS_ctx.variant }), props.class)) },
    ...(__VLS_ctx.delegatedProps),
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
            Primitive: Primitive,
            badgeVariants: badgeVariants,
            delegatedProps: delegatedProps,
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
//# sourceMappingURL=Badge.vue.js.map