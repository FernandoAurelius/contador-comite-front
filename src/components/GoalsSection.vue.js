import { defineComponent, ref, computed } from 'vue';
import { Edit, Trash, Plus, DollarSign, Target } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
export default defineComponent({
    name: 'GoalsSection',
    components: {
        Edit,
        Trash,
        Plus,
        DollarSign,
        Target,
        Button,
        Input,
        Label,
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
        Textarea
    },
    props: {
        goals: {
            type: Array,
            default: () => []
        },
        currentBalance: {
            type: Number,
            required: true
        }
    },
    setup(props, { emit }) {
        const isNewGoalDialogOpen = ref(false);
        const isEditGoalDialogOpen = ref(false);
        const isDeleteConfirmDialogOpen = ref(false);
        const newGoal = ref({
            name: '',
            value: 0,
            description: ''
        });
        const editingGoal = ref({
            id: '',
            name: '',
            value: 0,
            description: ''
        });
        const goalToDelete = ref(null);
        const isGoalFormValid = computed(() => {
            return newGoal.value.name &&
                (typeof newGoal.value.value === 'number' ?
                    newGoal.value.value > 0 :
                    parseFloat(String(newGoal.value.value)) > 0);
        });
        const isEditFormValid = computed(() => {
            return editingGoal.value.name && editingGoal.value.value > 0;
        });
        const formatCurrency = (value) => {
            return value.toFixed(2).replace('.', ',');
        };
        const remainingAmount = (goal) => {
            return goal.value - props.currentBalance;
        };
        const addGoal = () => {
            const goalValue = typeof newGoal.value.value === 'string'
                ? parseFloat(newGoal.value.value)
                : newGoal.value.value;
            const goal = {
                id: Date.now().toString(),
                name: newGoal.value.name,
                value: goalValue,
                description: newGoal.value.description
            };
            const updatedGoals = [...props.goals, goal];
            emit('update-goals', updatedGoals);
            // Reset form
            newGoal.value = {
                name: '',
                value: 0,
                description: ''
            };
            isNewGoalDialogOpen.value = false;
        };
        const editGoal = (goal) => {
            editingGoal.value = { ...goal };
            isEditGoalDialogOpen.value = true;
        };
        const saveEditedGoal = () => {
            const updatedGoals = props.goals.map(goal => goal.id === editingGoal.value.id ? editingGoal.value : goal);
            emit('update-goals', updatedGoals);
            isEditGoalDialogOpen.value = false;
        };
        const confirmDeleteGoal = (goal) => {
            goalToDelete.value = goal;
            isDeleteConfirmDialogOpen.value = true;
        };
        const deleteGoal = () => {
            if (!goalToDelete.value)
                return;
            const updatedGoals = props.goals.filter(goal => goal.id !== goalToDelete.value?.id);
            emit('update-goals', updatedGoals);
            isDeleteConfirmDialogOpen.value = false;
        };
        return {
            isNewGoalDialogOpen,
            isEditGoalDialogOpen,
            isDeleteConfirmDialogOpen,
            newGoal,
            editingGoal,
            goalToDelete,
            isGoalFormValid,
            isEditFormValid,
            formatCurrency,
            remainingAmount,
            addGoal,
            editGoal,
            saveEditedGoal,
            confirmDeleteGoal,
            deleteGoal
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Edit,
    Trash,
    Plus,
    DollarSign,
    Target,
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Textarea
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col sm:flex-row justify-between gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-medium text-gray-700" },
});
const __VLS_0 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    open: (__VLS_ctx.isNewGoalDialogOpen),
}));
const __VLS_2 = __VLS_1({
    open: (__VLS_ctx.isNewGoalDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.DialogTrigger;
/** @type {[typeof __VLS_components.DialogTrigger, typeof __VLS_components.DialogTrigger, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    asChild: true,
}));
const __VLS_6 = __VLS_5({
    asChild: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "flex items-center gap-2" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "flex items-center gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "h-4 w-4" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_11;
var __VLS_7;
const __VLS_16 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
var __VLS_27;
const __VLS_28 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
var __VLS_31;
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 py-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_32 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    for: "goal-name",
}));
const __VLS_34 = __VLS_33({
    for: "goal-name",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
var __VLS_35;
const __VLS_36 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    id: "goal-name",
    modelValue: (__VLS_ctx.newGoal.name),
    placeholder: "Ex: Meta para formatura",
}));
const __VLS_38 = __VLS_37({
    id: "goal-name",
    modelValue: (__VLS_ctx.newGoal.name),
    placeholder: "Ex: Meta para formatura",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_40 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    for: "goal-value",
}));
const __VLS_42 = __VLS_41({
    for: "goal-value",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
const __VLS_44 = {}.DollarSign;
/** @type {[typeof __VLS_components.DollarSign, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}));
const __VLS_46 = __VLS_45({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    id: "goal-value",
    type: "number",
    modelValue: (__VLS_ctx.newGoal.value),
    placeholder: "0.00",
    ...{ class: "pl-10" },
    min: "0",
    step: "0.01",
}));
const __VLS_50 = __VLS_49({
    id: "goal-value",
    type: "number",
    modelValue: (__VLS_ctx.newGoal.value),
    placeholder: "0.00",
    ...{ class: "pl-10" },
    min: "0",
    step: "0.01",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_52 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    for: "goal-description",
}));
const __VLS_54 = __VLS_53({
    for: "goal-description",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
var __VLS_55;
const __VLS_56 = {}.Textarea;
/** @type {[typeof __VLS_components.Textarea, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    id: "goal-description",
    modelValue: (__VLS_ctx.newGoal.description),
    placeholder: "Detalhes sobre a meta...",
    rows: "3",
}));
const __VLS_58 = __VLS_57({
    id: "goal-description",
    modelValue: (__VLS_ctx.newGoal.description),
    placeholder: "Detalhes sobre a meta...",
    rows: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isNewGoalDialogOpen = false;
    }
};
__VLS_67.slots.default;
var __VLS_67;
const __VLS_72 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.isGoalFormValid),
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.isGoalFormValid),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClick: (__VLS_ctx.addGoal)
};
__VLS_75.slots.default;
var __VLS_75;
var __VLS_63;
var __VLS_19;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" },
});
for (const [goal] of __VLS_getVForSourceType((__VLS_ctx.goals))) {
    const __VLS_80 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        key: (goal.id),
        ...{ class: "overflow-hidden" },
    }));
    const __VLS_82 = __VLS_81({
        key: (goal.id),
        ...{ class: "overflow-hidden" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ class: "pb-3" },
    }));
    const __VLS_86 = __VLS_85({
        ...{ class: "pb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-start" },
    });
    const __VLS_88 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ class: "text-lg" },
    }));
    const __VLS_90 = __VLS_89({
        ...{ class: "text-lg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (goal.name);
    var __VLS_91;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex space-x-1" },
    });
    const __VLS_92 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
        ...{ class: "h-8 w-8" },
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
        ...{ class: "h-8 w-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editGoal(goal);
        }
    };
    __VLS_95.slots.default;
    const __VLS_100 = {}.Edit;
    /** @type {[typeof __VLS_components.Edit, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_102 = __VLS_101({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sr-only" },
    });
    var __VLS_95;
    const __VLS_104 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
        ...{ class: "h-8 w-8 text-red-500" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
        ...{ class: "h-8 w-8 text-red-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.confirmDeleteGoal(goal);
        }
    };
    __VLS_107.slots.default;
    const __VLS_112 = {}.Trash;
    /** @type {[typeof __VLS_components.Trash, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_114 = __VLS_113({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sr-only" },
    });
    var __VLS_107;
    const __VLS_116 = {}.CardDescription;
    /** @type {[typeof __VLS_components.CardDescription, typeof __VLS_components.CardDescription, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
    const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    (goal.description);
    var __VLS_119;
    var __VLS_87;
    const __VLS_120 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
    const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between text-sm mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (Math.min(Math.round((__VLS_ctx.currentBalance / goal.value) * 100), 100));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-full bg-gray-200 rounded-full h-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-blue-600 h-2 rounded-full" },
        ...{ style: (`width: ${Math.min((__VLS_ctx.currentBalance / goal.value) * 100, 100)}%`) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.currentBalance));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-right" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.formatCurrency(goal.value));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium" },
        ...{ class: (__VLS_ctx.remainingAmount(goal) <= 0 ? 'text-emerald-600' : 'text-orange-600') },
    });
    (__VLS_ctx.remainingAmount(goal) <= 0 ? 'Meta alcançada!' : `R$ ${__VLS_ctx.formatCurrency(__VLS_ctx.remainingAmount(goal))}`);
    var __VLS_123;
    var __VLS_83;
}
if (__VLS_ctx.goals.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-16 bg-gray-50 rounded-lg" },
    });
    const __VLS_124 = {}.Target;
    /** @type {[typeof __VLS_components.Target, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }));
    const __VLS_126 = __VLS_125({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-500 mb-4" },
    });
    const __VLS_128 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.goals.length === 0))
                return;
            __VLS_ctx.isNewGoalDialogOpen = true;
        }
    };
    __VLS_131.slots.default;
    const __VLS_136 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        ...{ class: "h-4 w-4 mr-2" },
    }));
    const __VLS_138 = __VLS_137({
        ...{ class: "h-4 w-4 mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    var __VLS_131;
}
const __VLS_140 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    open: (__VLS_ctx.isEditGoalDialogOpen),
}));
const __VLS_142 = __VLS_141({
    open: (__VLS_ctx.isEditGoalDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
var __VLS_155;
const __VLS_156 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
var __VLS_159;
var __VLS_151;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 py-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_160 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    for: "edit-goal-name",
}));
const __VLS_162 = __VLS_161({
    for: "edit-goal-name",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
var __VLS_163;
const __VLS_164 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    id: "edit-goal-name",
    modelValue: (__VLS_ctx.editingGoal.name),
    placeholder: "Ex: Meta para formatura",
}));
const __VLS_166 = __VLS_165({
    id: "edit-goal-name",
    modelValue: (__VLS_ctx.editingGoal.name),
    placeholder: "Ex: Meta para formatura",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_168 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    for: "edit-goal-value",
}));
const __VLS_170 = __VLS_169({
    for: "edit-goal-value",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
var __VLS_171;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
const __VLS_172 = {}.DollarSign;
/** @type {[typeof __VLS_components.DollarSign, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}));
const __VLS_174 = __VLS_173({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    id: "edit-goal-value",
    type: "number",
    modelValue: (__VLS_ctx.editingGoal.value),
    placeholder: "0.00",
    ...{ class: "pl-10" },
    min: "0",
    step: "0.01",
}));
const __VLS_178 = __VLS_177({
    id: "edit-goal-value",
    type: "number",
    modelValue: (__VLS_ctx.editingGoal.value),
    placeholder: "0.00",
    ...{ class: "pl-10" },
    min: "0",
    step: "0.01",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_180 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    for: "edit-goal-description",
}));
const __VLS_182 = __VLS_181({
    for: "edit-goal-description",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
var __VLS_183;
const __VLS_184 = {}.Textarea;
/** @type {[typeof __VLS_components.Textarea, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    id: "edit-goal-description",
    modelValue: (__VLS_ctx.editingGoal.description),
    placeholder: "Detalhes sobre a meta...",
    rows: "3",
}));
const __VLS_186 = __VLS_185({
    id: "edit-goal-description",
    modelValue: (__VLS_ctx.editingGoal.description),
    placeholder: "Detalhes sobre a meta...",
    rows: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
const __VLS_188 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({}));
const __VLS_190 = __VLS_189({}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_194 = __VLS_193({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
let __VLS_196;
let __VLS_197;
let __VLS_198;
const __VLS_199 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isEditGoalDialogOpen = false;
    }
};
__VLS_195.slots.default;
var __VLS_195;
const __VLS_200 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.isEditFormValid),
}));
const __VLS_202 = __VLS_201({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.isEditFormValid),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_204;
let __VLS_205;
let __VLS_206;
const __VLS_207 = {
    onClick: (__VLS_ctx.saveEditedGoal)
};
__VLS_203.slots.default;
var __VLS_203;
var __VLS_191;
var __VLS_147;
var __VLS_143;
const __VLS_208 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    open: (__VLS_ctx.isDeleteConfirmDialogOpen),
}));
const __VLS_210 = __VLS_209({
    open: (__VLS_ctx.isDeleteConfirmDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({}));
const __VLS_214 = __VLS_213({}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({}));
const __VLS_218 = __VLS_217({}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({}));
const __VLS_222 = __VLS_221({}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
var __VLS_223;
const __VLS_224 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
(__VLS_ctx.goalToDelete?.name);
var __VLS_227;
var __VLS_219;
const __VLS_228 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({}));
const __VLS_230 = __VLS_229({}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_234 = __VLS_233({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
let __VLS_236;
let __VLS_237;
let __VLS_238;
const __VLS_239 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isDeleteConfirmDialogOpen = false;
    }
};
__VLS_235.slots.default;
var __VLS_235;
const __VLS_240 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    ...{ 'onClick': {} },
    variant: "destructive",
}));
const __VLS_242 = __VLS_241({
    ...{ 'onClick': {} },
    variant: "destructive",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
let __VLS_244;
let __VLS_245;
let __VLS_246;
const __VLS_247 = {
    onClick: (__VLS_ctx.deleteGoal)
};
__VLS_243.slots.default;
var __VLS_243;
var __VLS_231;
var __VLS_215;
var __VLS_211;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-10']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-10']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=GoalsSection.vue.js.map