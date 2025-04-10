import { cn } from '@/lib/utils';
import { CalendarRoot, useForwardPropsEmits } from 'reka-ui';
import { computed } from 'vue';
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNextButton, CalendarPrevButton } from '.';
const props = defineProps();
const emits = defineEmits();
const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.CalendarRoot;
/** @type {[typeof __VLS_components.CalendarRoot, typeof __VLS_components.CalendarRoot, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    dataSlot: "calendar",
    ...{ class: (__VLS_ctx.cn('p-3', props.class)) },
    ...(__VLS_ctx.forwarded),
}));
const __VLS_2 = __VLS_1({
    dataSlot: "calendar",
    ...{ class: (__VLS_ctx.cn('p-3', props.class)) },
    ...(__VLS_ctx.forwarded),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
{
    const { default: __VLS_thisSlot } = __VLS_3.slots;
    const [{ grid, weekDays }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_5 = {}.CalendarHeader;
    /** @type {[typeof __VLS_components.CalendarHeader, typeof __VLS_components.CalendarHeader, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    const __VLS_9 = {}.CalendarHeading;
    /** @type {[typeof __VLS_components.CalendarHeading, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-1" },
    });
    const __VLS_13 = {}.CalendarPrevButton;
    /** @type {[typeof __VLS_components.CalendarPrevButton, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_17 = {}.CalendarNextButton;
    /** @type {[typeof __VLS_components.CalendarNextButton, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    var __VLS_8;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0" },
    });
    for (const [month] of __VLS_getVForSourceType((grid))) {
        const __VLS_21 = {}.CalendarGrid;
        /** @type {[typeof __VLS_components.CalendarGrid, typeof __VLS_components.CalendarGrid, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            key: (month.value.toString()),
        }));
        const __VLS_23 = __VLS_22({
            key: (month.value.toString()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        __VLS_24.slots.default;
        const __VLS_25 = {}.CalendarGridHead;
        /** @type {[typeof __VLS_components.CalendarGridHead, typeof __VLS_components.CalendarGridHead, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
        const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
        __VLS_28.slots.default;
        const __VLS_29 = {}.CalendarGridRow;
        /** @type {[typeof __VLS_components.CalendarGridRow, typeof __VLS_components.CalendarGridRow, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
        const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
        __VLS_32.slots.default;
        for (const [day] of __VLS_getVForSourceType((weekDays))) {
            const __VLS_33 = {}.CalendarHeadCell;
            /** @type {[typeof __VLS_components.CalendarHeadCell, typeof __VLS_components.CalendarHeadCell, ]} */ ;
            // @ts-ignore
            const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
                key: (day),
            }));
            const __VLS_35 = __VLS_34({
                key: (day),
            }, ...__VLS_functionalComponentArgsRest(__VLS_34));
            __VLS_36.slots.default;
            (day);
            var __VLS_36;
        }
        var __VLS_32;
        var __VLS_28;
        const __VLS_37 = {}.CalendarGridBody;
        /** @type {[typeof __VLS_components.CalendarGridBody, typeof __VLS_components.CalendarGridBody, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
        const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
        __VLS_40.slots.default;
        for (const [weekDates, index] of __VLS_getVForSourceType((month.rows))) {
            const __VLS_41 = {}.CalendarGridRow;
            /** @type {[typeof __VLS_components.CalendarGridRow, typeof __VLS_components.CalendarGridRow, ]} */ ;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                key: (`weekDate-${index}`),
                ...{ class: "mt-2 w-full" },
            }));
            const __VLS_43 = __VLS_42({
                key: (`weekDate-${index}`),
                ...{ class: "mt-2 w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
            __VLS_44.slots.default;
            for (const [weekDate] of __VLS_getVForSourceType((weekDates))) {
                const __VLS_45 = {}.CalendarCell;
                /** @type {[typeof __VLS_components.CalendarCell, typeof __VLS_components.CalendarCell, ]} */ ;
                // @ts-ignore
                const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
                    key: (weekDate.toString()),
                    date: (weekDate),
                }));
                const __VLS_47 = __VLS_46({
                    key: (weekDate.toString()),
                    date: (weekDate),
                }, ...__VLS_functionalComponentArgsRest(__VLS_46));
                __VLS_48.slots.default;
                const __VLS_49 = {}.CalendarCellTrigger;
                /** @type {[typeof __VLS_components.CalendarCellTrigger, ]} */ ;
                // @ts-ignore
                const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
                    day: (weekDate),
                    month: (month.value),
                }));
                const __VLS_51 = __VLS_50({
                    day: (weekDate),
                    month: (month.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_50));
                var __VLS_48;
            }
            var __VLS_44;
        }
        var __VLS_40;
        var __VLS_24;
    }
    __VLS_3.slots['' /* empty slot name completion */];
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cn: cn,
            CalendarRoot: CalendarRoot,
            CalendarCell: CalendarCell,
            CalendarCellTrigger: CalendarCellTrigger,
            CalendarGrid: CalendarGrid,
            CalendarGridBody: CalendarGridBody,
            CalendarGridHead: CalendarGridHead,
            CalendarGridRow: CalendarGridRow,
            CalendarHeadCell: CalendarHeadCell,
            CalendarHeader: CalendarHeader,
            CalendarHeading: CalendarHeading,
            CalendarNextButton: CalendarNextButton,
            CalendarPrevButton: CalendarPrevButton,
            forwarded: forwarded,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Calendar.vue.js.map