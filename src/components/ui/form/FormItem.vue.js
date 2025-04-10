import { cn } from '@/lib/utils';
import { useId } from 'reka-ui';
import { provide } from 'vue';
import { FORM_ITEM_INJECTION_KEY } from './injectionKeys';
const props = defineProps();
const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    'data-slot': "form-item",
    ...{ class: (__VLS_ctx.cn('grid gap-2', props.class)) },
});
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
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
//# sourceMappingURL=FormItem.vue.js.map