import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useFormField } from './useFormField';
const props = defineProps();
const { error, formItemId } = useFormField();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "form-label",
    dataError: (!!__VLS_ctx.error),
    ...{ class: (__VLS_ctx.cn('data-[error=true]:text-destructive-foreground', props.class)) },
    for: (__VLS_ctx.formItemId),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "form-label",
    dataError: (!!__VLS_ctx.error),
    ...{ class: (__VLS_ctx.cn('data-[error=true]:text-destructive-foreground', props.class)) },
    for: (__VLS_ctx.formItemId),
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
            Label: Label,
            error: error,
            formItemId: formItemId,
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
//# sourceMappingURL=FormLabel.vue.js.map