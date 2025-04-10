import { cn } from '@/lib/utils';
import { reactiveOmit } from '@vueuse/core';
import { TabsRoot, useForwardPropsEmits } from 'reka-ui';
const props = defineProps();
const emits = defineEmits();
const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.TabsRoot;
/** @type {[typeof __VLS_components.TabsRoot, typeof __VLS_components.TabsRoot, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "tabs",
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('flex flex-col gap-2', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "tabs",
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('flex flex-col gap-2', props.class)) },
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
            TabsRoot: TabsRoot,
            forwarded: forwarded,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Tabs.vue.js.map