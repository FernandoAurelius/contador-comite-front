import { cn } from '@/lib/utils';
import { SwitchRoot, SwitchThumb, useForwardPropsEmits, } from 'reka-ui';
import { computed } from 'vue';
const props = defineProps();
const emits = defineEmits();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.SwitchRoot;
/** @type {[typeof __VLS_components.SwitchRoot, typeof __VLS_components.SwitchRoot, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "switch",
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "switch",
    ...(__VLS_ctx.forwarded),
    ...{ class: (__VLS_ctx.cn('peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.SwitchThumb;
/** @type {[typeof __VLS_components.SwitchThumb, typeof __VLS_components.SwitchThumb, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    dataSlot: "switch-thumb",
    ...{ class: (__VLS_ctx.cn('bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none flex items-center justify-center size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0')) },
}));
const __VLS_7 = __VLS_6({
    dataSlot: "switch-thumb",
    ...{ class: (__VLS_ctx.cn('bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none flex items-center justify-center size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0')) },
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
            SwitchRoot: SwitchRoot,
            SwitchThumb: SwitchThumb,
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
//# sourceMappingURL=Switch.vue.js.map