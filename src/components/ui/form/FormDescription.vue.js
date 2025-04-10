import { cn } from '@/lib/utils';
import { useFormField } from './useFormField';
const props = defineProps();
const { formDescriptionId } = useFormField();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    id: (__VLS_ctx.formDescriptionId),
    'data-slot': "form-description",
    ...{ class: (__VLS_ctx.cn('text-muted-foreground text-sm', props.class)) },
});
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            formDescriptionId: formDescriptionId,
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
//# sourceMappingURL=FormDescription.vue.js.map