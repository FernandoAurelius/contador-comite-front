import { cn } from '@/lib/utils';
import { ErrorMessage } from 'vee-validate';
import { toValue } from 'vue';
import { useFormField } from './useFormField';
const props = defineProps();
const { name, formMessageId } = useFormField();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ErrorMessage;
/** @type {[typeof __VLS_components.ErrorMessage, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    id: (__VLS_ctx.formMessageId),
    dataSlot: "form-message",
    as: "p",
    name: (__VLS_ctx.toValue(__VLS_ctx.name)),
    ...{ class: (__VLS_ctx.cn('text-destructive-foreground text-sm', props.class)) },
}));
const __VLS_2 = __VLS_1({
    id: (__VLS_ctx.formMessageId),
    dataSlot: "form-message",
    as: "p",
    name: (__VLS_ctx.toValue(__VLS_ctx.name)),
    ...{ class: (__VLS_ctx.cn('text-destructive-foreground text-sm', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            ErrorMessage: ErrorMessage,
            toValue: toValue,
            name: name,
            formMessageId: formMessageId,
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
//# sourceMappingURL=FormMessage.vue.js.map