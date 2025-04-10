import { buttonVariants } from '@/components/ui/button';
import { BulletLegend } from '@unovis/ts';
import { VisBulletLegend } from '@unovis/vue';
import { nextTick, onMounted, ref } from 'vue';
const props = withDefaults(defineProps(), {
    items: () => [],
});
const emits = defineEmits();
const elRef = ref();
function keepStyling() {
    const selector = `.${BulletLegend.selectors.item}`;
    nextTick(() => {
        const elements = elRef.value?.querySelectorAll(selector);
        const classes = buttonVariants({ variant: 'ghost', size: 'sm' }).split(' ');
        elements?.forEach(el => el.classList.add(...classes, '!inline-flex', '!mr-2'));
    });
}
onMounted(() => {
    keepStyling();
});
function onLegendItemClick(d, i) {
    emits('legendItemClick', d, i);
    const isBulletActive = !props.items[i].inactive;
    const isFilterApplied = props.items.some(i => i.inactive);
    if (isFilterApplied && isBulletActive) {
        // reset filter
        emits('update:items', props.items.map(item => ({ ...item, inactive: false })));
    }
    else {
        // apply selection, set other item as inactive
        emits('update:items', props.items.map(item => item.name === d.name ? ({ ...d, inactive: false }) : { ...item, inactive: true }));
    }
    keepStyling();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    items: () => [],
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "elRef",
    ...{ class: "w-max" },
    ...{ style: ({
            '--vis-legend-bullet-size': '16px',
        }) },
});
/** @type {typeof __VLS_ctx.elRef} */ ;
const __VLS_0 = {}.VisBulletLegend;
/** @type {[typeof __VLS_components.VisBulletLegend, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    items: (__VLS_ctx.items),
    onLegendItemClick: (__VLS_ctx.onLegendItemClick),
}));
const __VLS_2 = __VLS_1({
    items: (__VLS_ctx.items),
    onLegendItemClick: (__VLS_ctx.onLegendItemClick),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['w-max']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VisBulletLegend: VisBulletLegend,
            elRef: elRef,
            onLegendItemClick: onLegendItemClick,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ChartLegend.vue.js.map