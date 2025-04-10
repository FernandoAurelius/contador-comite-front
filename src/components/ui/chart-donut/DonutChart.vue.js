import { buttonVariants } from '@/components/ui/button';
import { BulletLegend } from '@unovis/ts';
import { nextTick, onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { PieChart } from 'lucide-vue-next';
const props = withDefaults(defineProps(), {
    items: () => [],
    data: () => [],
    categories: () => [],
    formatter: (value) => value.toString(),
    categoryPercs: false,
    legend: true,
    showLabels: true
});
const emits = defineEmits();
const elRef = ref();
const svgRef = ref();
const containerRef = ref();
const resizeObserver = ref(null);
// Cores para o gráfico de donut
const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
// Calcular o total para percentuais
const total = computed(() => {
    return props.data.reduce((sum, d) => sum + d.value, 0);
});
// Dados filtrados para o gráfico
const pieData = computed(() => {
    return props.data
        .filter(item => item.value > 0)
        .map((item, index) => ({
        name: item.name || item.category,
        value: item.value,
        color: COLORS[index % COLORS.length]
    }));
});
// Ajustamos os cálculos para garantir que o donut fique bem centralizado
const svgSize = ref({ width: 300, height: 300 });
const centerX = computed(() => svgSize.value.width / 2);
const centerY = computed(() => svgSize.value.height / 2);
// Reduzimos o raio para dar mais espaço para as legendas
const radius = computed(() => Math.min(centerX.value, centerY.value) * 0.65);
const innerRadius = computed(() => radius.value * 0.55); // Ajustando proporção do buraco do donut
// Função para calcular a posição dos arcos do donut
function calculateArc(startAngle, endAngle, innerR, outerR) {
    const start = polarToCartesian(centerX.value, centerY.value, outerR, endAngle);
    const end = polarToCartesian(centerX.value, centerY.value, outerR, startAngle);
    const innerStart = polarToCartesian(centerX.value, centerY.value, innerR, endAngle);
    const innerEnd = polarToCartesian(centerX.value, centerY.value, innerR, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y,
        "A", outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
    ].join(" ");
}
// Função para converter de coordenadas polares para cartesianas
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
// Gerar os arcos do donut com seus ângulos correspondentes
const arcs = computed(() => {
    if (pieData.value.length === 0)
        return [];
    let currentAngle = 0;
    return pieData.value.map(item => {
        const percentage = item.value / total.value;
        const angle = percentage * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        // Calcular posição para o rótulo
        const midAngle = currentAngle + angle / 2;
        const labelRadius = (radius.value + innerRadius.value) / 2;
        const labelPos = polarToCartesian(centerX.value, centerY.value, labelRadius, midAngle);
        // Ajustar âncora de texto conforme posição
        const textAnchor = midAngle > 90 && midAngle < 270 ? "end" : "start";
        currentAngle += angle;
        return {
            path: calculateArc(startAngle, endAngle, innerRadius.value, radius.value),
            color: item.color,
            name: item.name,
            value: item.value,
            percentage,
            labelPos,
            textAnchor,
            midAngle
        };
    });
});
// Formatar o texto dos rótulos
function getLabelText(arc) {
    if (props.categoryPercs) {
        return `${(arc.percentage * 100).toFixed(1)}%`;
    }
    return arc.name;
}
// Função para manter o estilo das legendas
function keepStyling() {
    const selector = `.${BulletLegend.selectors.item}`;
    nextTick(() => {
        const elements = elRef.value?.querySelectorAll(selector);
        const classes = buttonVariants({ variant: 'ghost', size: 'sm' }).split(' ');
        elements?.forEach(el => el.classList.add(...classes, '!inline-flex', '!mr-2'));
    });
}
// Função para ajustar o tamanho do SVG quando o container mudar de tamanho
function resizeChart() {
    if (!containerRef.value)
        return;
    const rect = containerRef.value.getBoundingClientRect();
    // Definindo um tamanho máximo para evitar distorções em telas muito grandes
    const maxSize = Math.min(rect.width, rect.height, 500);
    svgSize.value = {
        width: rect.width,
        height: Math.min(rect.height, maxSize)
    };
}
// Configurar o ResizeObserver para redimensionar o gráfico quando o container mudar
function setupResizeObserver() {
    if (!containerRef.value)
        return;
    resizeObserver.value = new ResizeObserver(resizeChart);
    resizeObserver.value.observe(containerRef.value);
}
// Evento de clique na legenda
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
// Adicionando informações para legendas
const legendItems = computed(() => {
    return pieData.value.map((item, index) => ({
        name: item.name,
        color: COLORS[index % COLORS.length],
        value: item.value,
        percentage: (item.value / total.value) * 100
    }));
});
// Ciclo de vida do componente
onMounted(() => {
    keepStyling();
    resizeChart();
    setupResizeObserver();
});
watch(() => props.data, () => {
    nextTick(keepStyling);
}, { deep: true });
onUnmounted(() => {
    if (resizeObserver.value) {
        resizeObserver.value.disconnect();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    items: () => [],
    data: () => [],
    categories: () => [],
    formatter: (value) => value.toString(),
    categoryPercs: false,
    legend: true,
    showLabels: true
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col h-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "containerRef",
    ...{ class: "flex-grow relative" },
});
/** @type {typeof __VLS_ctx.containerRef} */ ;
if (__VLS_ctx.pieData.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-full w-full flex items-center justify-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    const __VLS_0 = {}.PieChart;
    /** @type {[typeof __VLS_components.PieChart, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "h-12 w-12 mx-auto mb-2 opacity-20 text-gray-400" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "h-12 w-12 mx-auto mb-2 opacity-20 text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col h-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 flex justify-center items-center min-h-[160px]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ref: "svgRef",
        width: (__VLS_ctx.svgSize.width),
        height: (__VLS_ctx.svgSize.height),
        ...{ class: "max-w-full max-h-full" },
    });
    /** @type {typeof __VLS_ctx.svgRef} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.g, __VLS_intrinsicElements.g)({});
    for (const [arc, index] of __VLS_getVForSourceType((__VLS_ctx.arcs))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            key: (`arc-${index}`),
            d: (arc.path),
            fill: (arc.color),
            stroke: "white",
            'stroke-width': "1",
            ...{ class: "transition-opacity duration-300 hover:opacity-80" },
        });
    }
    if (props.showLabels) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.g, __VLS_intrinsicElements.g)({});
        for (const [arc, index] of __VLS_getVForSourceType((__VLS_ctx.arcs))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.text, __VLS_intrinsicElements.text)({
                key: (`label-${index}`),
                x: (arc.labelPos.x),
                y: (arc.labelPos.y),
                'text-anchor': (arc.textAnchor),
                fill: "white",
                'font-size': "11px",
                'font-weight': "bold",
                'dominant-baseline': "middle",
                ...{ style: {} },
            });
            __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (arc.percentage > 0.05) }, null, null);
            (__VLS_ctx.getLabelText(arc));
        }
    }
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[160px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-80']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PieChart: PieChart,
            svgRef: svgRef,
            containerRef: containerRef,
            pieData: pieData,
            svgSize: svgSize,
            arcs: arcs,
            getLabelText: getLabelText,
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
//# sourceMappingURL=DonutChart.vue.js.map