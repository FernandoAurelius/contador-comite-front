import { cn } from '@/lib/utils';
import { PopoverContent, PopoverPortal, useForwardPropsEmits, } from 'reka-ui';
import { computed } from 'vue';
defineOptions({
    inheritAttrs: false,
});
const props = withDefaults(defineProps(), {
    align: 'center',
    sideOffset: 4,
});
const emits = defineEmits();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    align: 'center',
    sideOffset: 4,
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.PopoverPortal;
/** @type {[typeof __VLS_components.PopoverPortal, typeof __VLS_components.PopoverPortal, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.PopoverContent;
/** @type {[typeof __VLS_components.PopoverContent, typeof __VLS_components.PopoverContent, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    dataSlot: "popover-content",
    ...({ ...__VLS_ctx.forwarded, ...__VLS_ctx.$attrs }),
    ...{ class: (__VLS_ctx.cn('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md origin-(--reka-popover-content-transform-origin) outline-hidden', props.class)) },
}));
const __VLS_7 = __VLS_6({
    dataSlot: "popover-content",
    ...({ ...__VLS_ctx.forwarded, ...__VLS_ctx.$attrs }),
    ...{ class: (__VLS_ctx.cn('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md origin-(--reka-popover-content-transform-origin) outline-hidden', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
var __VLS_9 = {};
var __VLS_8;
var __VLS_3;
// @ts-ignore
var __VLS_10 = __VLS_9;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            PopoverContent: PopoverContent,
            PopoverPortal: PopoverPortal,
            forwarded: forwarded,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PopoverContent.vue.js.map