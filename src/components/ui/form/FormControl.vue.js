import { Slot } from 'reka-ui';
import { useFormField } from './useFormField';
const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Slot;
/** @type {[typeof __VLS_components.Slot, typeof __VLS_components.Slot, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    id: (__VLS_ctx.formItemId),
    dataSlot: "form-control",
    'aria-describedby': (!__VLS_ctx.error ? `${__VLS_ctx.formDescriptionId}` : `${__VLS_ctx.formDescriptionId} ${__VLS_ctx.formMessageId}`),
    'aria-invalid': (!!__VLS_ctx.error),
}));
const __VLS_2 = __VLS_1({
    id: (__VLS_ctx.formItemId),
    dataSlot: "form-control",
    'aria-describedby': (!__VLS_ctx.error ? `${__VLS_ctx.formDescriptionId}` : `${__VLS_ctx.formDescriptionId} ${__VLS_ctx.formMessageId}`),
    'aria-invalid': (!!__VLS_ctx.error),
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
            Slot: Slot,
            error: error,
            formItemId: formItemId,
            formDescriptionId: formDescriptionId,
            formMessageId: formMessageId,
        };
    },
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FormControl.vue.js.map