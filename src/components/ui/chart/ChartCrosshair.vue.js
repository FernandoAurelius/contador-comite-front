import { omit } from '@unovis/ts';
import { VisCrosshair, VisTooltip } from '@unovis/vue';
import { createApp } from 'vue';
import { ChartTooltip } from '.';
const props = withDefaults(defineProps(), {
    colors: () => [],
});
// Use weakmap to store reference to each datapoint for Tooltip
const wm = new WeakMap();
function template(d) {
    if (wm.has(d)) {
        return wm.get(d);
    }
    else {
        const componentDiv = document.createElement('div');
        const omittedData = Object.entries(omit(d, [props.index])).map(([key, value]) => {
            const legendReference = props.items.find(i => i.name === key);
            return { ...legendReference, value };
        });
        const TooltipComponent = props.customTooltip ?? ChartTooltip;
        createApp(TooltipComponent, { title: d[props.index].toString(), data: omittedData }).mount(componentDiv);
        wm.set(d, componentDiv.innerHTML);
        return componentDiv.innerHTML;
    }
}
function color(d, i) {
    return props.colors[i] ?? 'transparent';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    colors: () => [],
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VisTooltip;
/** @type {[typeof __VLS_components.VisTooltip, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    horizontalShift: (20),
    verticalShift: (20),
}));
const __VLS_2 = __VLS_1({
    horizontalShift: (20),
    verticalShift: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.VisCrosshair;
/** @type {[typeof __VLS_components.VisCrosshair, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    template: (__VLS_ctx.template),
    color: (__VLS_ctx.color),
}));
const __VLS_6 = __VLS_5({
    template: (__VLS_ctx.template),
    color: (__VLS_ctx.color),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VisCrosshair: VisCrosshair,
            VisTooltip: VisTooltip,
            template: template,
            color: color,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ChartCrosshair.vue.js.map