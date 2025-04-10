import { omit } from '@unovis/ts';
import { VisTooltip } from '@unovis/vue';
import { createApp } from 'vue';
import { ChartTooltip } from '.';
const props = defineProps();
// Use weakmap to store reference to each datapoint for Tooltip
const wm = new WeakMap();
function template(d, i, elements) {
    const valueFormatter = props.valueFormatter ?? ((tick) => `${tick}`);
    if (props.index in d) {
        if (wm.has(d)) {
            return wm.get(d);
        }
        else {
            const componentDiv = document.createElement('div');
            const omittedData = Object.entries(omit(d, [props.index])).map(([key, value]) => {
                const legendReference = props.items?.find(i => i.name === key);
                return { ...legendReference, value: valueFormatter(value) };
            });
            const TooltipComponent = props.customTooltip ?? ChartTooltip;
            createApp(TooltipComponent, { title: d[props.index], data: omittedData }).mount(componentDiv);
            wm.set(d, componentDiv.innerHTML);
            return componentDiv.innerHTML;
        }
    }
    else {
        const data = d.data;
        if (wm.has(data)) {
            return wm.get(data);
        }
        else {
            const style = getComputedStyle(elements[i]);
            const omittedData = [{ name: data.name, value: valueFormatter(data[props.index]), color: style.fill }];
            const componentDiv = document.createElement('div');
            const TooltipComponent = props.customTooltip ?? ChartTooltip;
            createApp(TooltipComponent, { title: d[props.index], data: omittedData }).mount(componentDiv);
            wm.set(d, componentDiv.innerHTML);
            return componentDiv.innerHTML;
        }
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.VisTooltip;
/** @type {[typeof __VLS_components.VisTooltip, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    horizontalShift: (20),
    verticalShift: (20),
    triggers: ({
        [__VLS_ctx.selector]: __VLS_ctx.template,
    }),
}));
const __VLS_2 = __VLS_1({
    horizontalShift: (20),
    verticalShift: (20),
    triggers: ({
        [__VLS_ctx.selector]: __VLS_ctx.template,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VisTooltip: VisTooltip,
            template: template,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ChartSingleTooltip.vue.js.map