import { cn } from '@/lib/utils';
import { ChartCrosshair, ChartLegend, defaultColors } from '@/components/ui/chart/';
import { Axis, GroupedBar, StackedBar } from '@unovis/ts';
import { VisAxis, VisGroupedBar, VisStackedBar, VisXYContainer } from '@unovis/vue';
import { useMounted } from '@vueuse/core';
import { computed, ref } from 'vue';
export default ((__VLS_props, __VLS_ctx, __VLS_expose, __VLS_setup = (async () => {
    const props = withDefaults(defineProps(), {
        type: 'grouped',
        margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
        filterOpacity: 0.2,
        roundedCorners: 0,
        showXAxis: true,
        showYAxis: true,
        showTooltip: true,
        showLegend: true,
        showGridLine: true,
    });
    const emits = defineEmits();
    const index = computed(() => props.index);
    const colors = computed(() => props.colors?.length ? props.colors : defaultColors(props.categories.length));
    const legendItems = ref(props.categories.map((category, i) => ({
        name: category,
        color: colors.value[i],
        inactive: false,
    })));
    const isMounted = useMounted();
    function handleLegendItemClick(d, i) {
        emits('legendItemClick', d, i);
    }
    const VisBarComponent = computed(() => props.type === 'grouped' ? VisGroupedBar : VisStackedBar);
    const selectorsBar = computed(() => props.type === 'grouped' ? GroupedBar.selectors.bar : StackedBar.selectors.bar);
    debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
    const __VLS_withDefaultsArg = (function (t) { return t; })({
        type: 'grouped',
        margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
        filterOpacity: 0.2,
        roundedCorners: 0,
        showXAxis: true,
        showYAxis: true,
        showTooltip: true,
        showLegend: true,
        showGridLine: true,
    });
    const __VLS_fnComponent = (await import('vue')).defineComponent({
        __typeEmits: {},
    });
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: (__VLS_ctx.cn('w-full h-[400px] flex flex-col items-end', __VLS_ctx.$attrs.class ?? '')) },
    });
    if (__VLS_ctx.showLegend) {
        const __VLS_0 = {}.ChartLegend;
        /** @type {[typeof __VLS_components.ChartLegend, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onLegendItemClick': {} },
            items: (__VLS_ctx.legendItems),
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onLegendItemClick': {} },
            items: (__VLS_ctx.legendItems),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_4;
        let __VLS_5;
        let __VLS_6;
        const __VLS_7 = {
            onLegendItemClick: (__VLS_ctx.handleLegendItemClick)
        };
        var __VLS_3;
    }
    const __VLS_8 = {}.VisXYContainer;
    /** @type {[typeof __VLS_components.VisXYContainer, typeof __VLS_components.VisXYContainer, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        data: (__VLS_ctx.data),
        ...{ style: ({ height: __VLS_ctx.isMounted ? '100%' : 'auto' }) },
        margin: (__VLS_ctx.margin),
    }));
    const __VLS_10 = __VLS_9({
        data: (__VLS_ctx.data),
        ...{ style: ({ height: __VLS_ctx.isMounted ? '100%' : 'auto' }) },
        margin: (__VLS_ctx.margin),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    if (__VLS_ctx.showTooltip) {
        const __VLS_12 = {}.ChartCrosshair;
        /** @type {[typeof __VLS_components.ChartCrosshair, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            colors: (__VLS_ctx.colors),
            items: (__VLS_ctx.legendItems),
            customTooltip: (__VLS_ctx.customTooltip),
            index: (__VLS_ctx.index),
        }));
        const __VLS_14 = __VLS_13({
            colors: (__VLS_ctx.colors),
            items: (__VLS_ctx.legendItems),
            customTooltip: (__VLS_ctx.customTooltip),
            index: (__VLS_ctx.index),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    }
    const __VLS_16 = {}.VisBarComponent;
    /** @type {[typeof __VLS_components.VisBarComponent, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        x: ((d, i) => i),
        y: (__VLS_ctx.categories.map(category => (d) => d[category])),
        color: (__VLS_ctx.colors),
        roundedCorners: (__VLS_ctx.roundedCorners),
        barPadding: (0.05),
        attributes: ({
            [__VLS_ctx.selectorsBar]: {
                opacity: (d, i) => {
                    const pos = i % __VLS_ctx.categories.length;
                    return __VLS_ctx.legendItems[pos]?.inactive ? __VLS_ctx.filterOpacity : 1;
                },
            },
        }),
    }));
    const __VLS_18 = __VLS_17({
        x: ((d, i) => i),
        y: (__VLS_ctx.categories.map(category => (d) => d[category])),
        color: (__VLS_ctx.colors),
        roundedCorners: (__VLS_ctx.roundedCorners),
        barPadding: (0.05),
        attributes: ({
            [__VLS_ctx.selectorsBar]: {
                opacity: (d, i) => {
                    const pos = i % __VLS_ctx.categories.length;
                    return __VLS_ctx.legendItems[pos]?.inactive ? __VLS_ctx.filterOpacity : 1;
                },
            },
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    if (__VLS_ctx.showXAxis) {
        const __VLS_20 = {}.VisAxis;
        /** @type {[typeof __VLS_components.VisAxis, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            type: "x",
            tickFormat: (__VLS_ctx.xFormatter ?? ((v) => __VLS_ctx.data[v]?.[__VLS_ctx.index])),
            gridLine: (false),
            tickLine: (false),
            tickTextColor: "hsl(var(--vis-text-color))",
        }));
        const __VLS_22 = __VLS_21({
            type: "x",
            tickFormat: (__VLS_ctx.xFormatter ?? ((v) => __VLS_ctx.data[v]?.[__VLS_ctx.index])),
            gridLine: (false),
            tickLine: (false),
            tickTextColor: "hsl(var(--vis-text-color))",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
    if (__VLS_ctx.showYAxis) {
        const __VLS_24 = {}.VisAxis;
        /** @type {[typeof __VLS_components.VisAxis, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            type: "y",
            tickLine: (false),
            tickFormat: (__VLS_ctx.yFormatter),
            domainLine: (false),
            gridLine: (__VLS_ctx.showGridLine),
            attributes: ({
                [__VLS_ctx.Axis.selectors.grid]: {
                    class: 'text-muted',
                },
            }),
            tickTextColor: "hsl(var(--vis-text-color))",
        }));
        const __VLS_26 = __VLS_25({
            type: "y",
            tickLine: (false),
            tickFormat: (__VLS_ctx.yFormatter),
            domainLine: (false),
            gridLine: (__VLS_ctx.showGridLine),
            attributes: ({
                [__VLS_ctx.Axis.selectors.grid]: {
                    class: 'text-muted',
                },
            }),
            tickTextColor: "hsl(var(--vis-text-color))",
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    }
    var __VLS_28 = {};
    var __VLS_11;
    // @ts-ignore
    var __VLS_29 = __VLS_28;
    var __VLS_dollars;
    const __VLS_self = (await import('vue')).defineComponent({
        setup() {
            return {
                cn: cn,
                ChartCrosshair: ChartCrosshair,
                ChartLegend: ChartLegend,
                Axis: Axis,
                VisAxis: VisAxis,
                VisXYContainer: VisXYContainer,
                index: index,
                colors: colors,
                legendItems: legendItems,
                isMounted: isMounted,
                handleLegendItemClick: handleLegendItemClick,
                VisBarComponent: VisBarComponent,
                selectorsBar: selectorsBar,
            };
        },
        __typeEmits: {},
        __typeProps: {},
        props: {},
    });
    return {};
})()) => ({})); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BarChart.vue.js.map