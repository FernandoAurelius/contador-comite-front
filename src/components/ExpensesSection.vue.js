import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Plus, DollarSign, FileText, Calendar } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useDespesaStore } from '@/stores/despesas';
import { mapActions } from 'pinia';
import FinancialItem from '@/components/FinancialItem.vue';
import { toast } from 'vue-sonner';
export default (await import('vue')).defineComponent({
    name: 'ExpensesSection',
    components: {
        Search,
        Plus,
        DollarSign,
        FileText,
        Calendar,
        Button,
        Input,
        Label,
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
        Textarea,
        Popover,
        PopoverContent,
        PopoverTrigger,
        CalendarComponent,
        FinancialItem
    },
    props: {
        expenses: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            searchTerm: '',
            isDialogOpen: false,
            isCalendarOpen: false,
            newExpense: {
                date: this.formatDateForBackend(new Date()),
                item: '',
                quantity: 1,
                unitCost: 0,
                totalCost: 0,
                notes: ''
            },
            selectedExpense: null,
            initialExpense: null, // Para armazenar o estado inicial do item em edição
            isEditing: false // Flag para identificar se está editando ou criando
        };
    },
    computed: {
        filteredExpenses() {
            const searchLower = this.searchTerm.toLowerCase();
            return this.expenses.filter(expense => (expense.item && expense.item.toLowerCase().includes(searchLower)) ||
                (expense.notes && expense.notes.toLowerCase().includes(searchLower)));
        },
        isFormValid() {
            return this.newExpense.item &&
                this.newExpense.date &&
                this.newExpense.quantity > 0 &&
                this.newExpense.unitCost > 0;
        },
        // Verificar se há alterações no formulário comparado ao estado inicial
        hasChanges() {
            if (!this.isEditing || !this.initialExpense)
                return true; // Se estiver criando, sempre pode salvar
            // Comparar valores do formulário com o valor inicial
            return this.newExpense.item !== this.initialExpense.item ||
                this.newExpense.quantity !== this.initialExpense.quantity ||
                this.newExpense.unitCost !== this.initialExpense.unitCost ||
                this.newExpense.notes !== this.initialExpense.notes ||
                this.newExpense.date !== this.initialExpense.date;
        }
    },
    methods: {
        ...mapActions(useDespesaStore, ['addDespesa', 'deleteDespesa', 'updateDespesa']),
        formatDate(date, formatStr) {
            return format(date, formatStr, { locale: ptBR });
        },
        formatDateForBackend(date) {
            return format(date, 'yyyy-MM-dd');
        },
        formatCurrency(value) {
            return value.toFixed(2).replace('.', ',');
        },
        onDateSelect(date) {
            // Converter DateValue para Date, depois para string no formato necessário
            const jsDate = new Date(date.year, date.month - 1, date.day);
            this.newExpense.date = this.formatDateForBackend(jsDate);
            this.isCalendarOpen = false;
        },
        async handleAddExpense() {
            // Se estiver editando e não houver mudanças, apenas fecha o modal
            if (this.isEditing && !this.hasChanges) {
                this.isDialogOpen = false;
                this.resetForm();
                return;
            }
            // Calcular custo total
            this.newExpense.totalCost = this.newExpense.quantity * this.newExpense.unitCost;
            try {
                const despesa = { ...this.newExpense };
                if (this.isEditing && this.selectedExpense) {
                    // Atualização de despesa existente
                    await this.updateDespesa(this.selectedExpense.id, despesa);
                    toast.success("Despesa atualizada com sucesso");
                }
                else {
                    // Nova despesa
                    await this.addDespesa(despesa);
                    toast.success("Despesa adicionada com sucesso");
                }
                // Importante: Primeiro fechar o modal, depois resetar o form
                this.isDialogOpen = false;
                this.resetForm();
                // Emitir evento para informar o componente pai
                this.$emit('add-expense');
                this.$emit('expense-updated');
            }
            catch (error) {
                console.error('Erro ao processar despesa:', error);
                toast.error("Erro ao salvar despesa");
            }
        },
        resetForm() {
            this.newExpense = {
                date: this.formatDateForBackend(new Date()),
                item: '',
                quantity: 1,
                unitCost: 0,
                totalCost: 0,
                notes: ''
            };
            this.selectedExpense = null;
            this.initialExpense = null;
            this.isEditing = false;
        },
        handleEditExpense(expense) {
            this.selectedExpense = expense;
            this.newExpense = { ...expense };
            this.initialExpense = { ...expense }; // Salvar estado inicial para comparação
            this.isEditing = true;
            this.isDialogOpen = true;
        },
        async handleDeleteExpense(expense) {
            if (confirm('Tem certeza que deseja excluir esta despesa?')) {
                try {
                    await this.deleteDespesa(expense.id);
                    toast.success("Despesa excluída com sucesso");
                    this.$emit('expense-deleted');
                }
                catch (error) {
                    console.error('Erro ao excluir despesa:', error);
                    toast.error("Erro ao excluir despesa");
                }
            }
        }
    }
});
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Search,
    Plus,
    DollarSign,
    FileText,
    Calendar,
    Button,
    Input,
    Label,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Textarea,
    Popover,
    PopoverContent,
    PopoverTrigger,
    CalendarComponent,
    FinancialItem
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col sm:flex-row justify-between gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative flex-1" },
});
const __VLS_0 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    placeholder: "Buscar despesas...",
    modelValue: (__VLS_ctx.searchTerm),
    ...{ class: "pl-10" },
}));
const __VLS_6 = __VLS_5({
    placeholder: "Buscar despesas...",
    modelValue: (__VLS_ctx.searchTerm),
    ...{ class: "pl-10" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    open: (__VLS_ctx.isDialogOpen),
}));
const __VLS_10 = __VLS_9({
    open: (__VLS_ctx.isDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.DialogTrigger;
/** @type {[typeof __VLS_components.DialogTrigger, typeof __VLS_components.DialogTrigger, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    asChild: true,
}));
const __VLS_14 = __VLS_13({
    asChild: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "flex items-center gap-2" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "flex items-center gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "h-4 w-4" },
}));
const __VLS_22 = __VLS_21({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_19;
var __VLS_15;
const __VLS_24 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
var __VLS_35;
const __VLS_36 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
var __VLS_39;
var __VLS_31;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-4 py-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_40 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    for: "expense-date",
}));
const __VLS_42 = __VLS_41({
    for: "expense-date",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
const __VLS_44 = {}.Popover;
/** @type {[typeof __VLS_components.Popover, typeof __VLS_components.Popover, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    open: (__VLS_ctx.isCalendarOpen),
}));
const __VLS_46 = __VLS_45({
    open: (__VLS_ctx.isCalendarOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.PopoverTrigger;
/** @type {[typeof __VLS_components.PopoverTrigger, typeof __VLS_components.PopoverTrigger, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    asChild: true,
}));
const __VLS_50 = __VLS_49({
    asChild: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    variant: "outline",
    ...{ class: "w-full justify-start text-left font-normal" },
}));
const __VLS_54 = __VLS_53({
    variant: "outline",
    ...{ class: "w-full justify-start text-left font-normal" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.Calendar;
/** @type {[typeof __VLS_components.Calendar, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "mr-2 h-4 w-4" },
}));
const __VLS_58 = __VLS_57({
    ...{ class: "mr-2 h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
(__VLS_ctx.newExpense.date
    ? __VLS_ctx.formatDate(new Date(__VLS_ctx.newExpense.date), "dd 'de' MMMM 'de' yyyy")
    : "Selecione uma data");
var __VLS_55;
var __VLS_51;
const __VLS_60 = {}.PopoverContent;
/** @type {[typeof __VLS_components.PopoverContent, typeof __VLS_components.PopoverContent, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ class: "w-auto p-0" },
}));
const __VLS_62 = __VLS_61({
    ...{ class: "w-auto p-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.CalendarComponent;
/** @type {[typeof __VLS_components.CalendarComponent, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onUpdate:modelValue': {} },
    mode: "single",
    selected: (__VLS_ctx.newExpense.date ? new Date(__VLS_ctx.newExpense.date) : new Date()),
    initialFocus: (true),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onUpdate:modelValue': {} },
    mode: "single",
    selected: (__VLS_ctx.newExpense.date ? new Date(__VLS_ctx.newExpense.date) : new Date()),
    initialFocus: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    'onUpdate:modelValue': (__VLS_ctx.onDateSelect)
};
var __VLS_67;
var __VLS_63;
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_72 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    for: "expense-description",
}));
const __VLS_74 = __VLS_73({
    for: "expense-description",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
var __VLS_75;
const __VLS_76 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    id: "expense-description",
    modelValue: (__VLS_ctx.newExpense.item),
    placeholder: "Ex: Material para decoração",
}));
const __VLS_78 = __VLS_77({
    id: "expense-description",
    modelValue: (__VLS_ctx.newExpense.item),
    placeholder: "Ex: Material para decoração",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_80 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    for: "expense-quantity",
}));
const __VLS_82 = __VLS_81({
    for: "expense-quantity",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
var __VLS_83;
const __VLS_84 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    id: "expense-quantity",
    type: "number",
    modelValue: (__VLS_ctx.newExpense.quantity),
    placeholder: "1",
    ...{ class: "pl-4" },
    min: "1",
    step: "1",
}));
const __VLS_86 = __VLS_85({
    id: "expense-quantity",
    type: "number",
    modelValue: (__VLS_ctx.newExpense.quantity),
    placeholder: "1",
    ...{ class: "pl-4" },
    min: "1",
    step: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_88 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    for: "expense-amount",
}));
const __VLS_90 = __VLS_89({
    for: "expense-amount",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
var __VLS_91;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
const __VLS_92 = {}.DollarSign;
/** @type {[typeof __VLS_components.DollarSign, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}));
const __VLS_94 = __VLS_93({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    id: "expense-amount",
    type: "number",
    modelValue: (__VLS_ctx.newExpense.unitCost),
    placeholder: "0.00",
    ...{ class: "pl-10" },
    min: "0",
    step: "0.01",
}));
const __VLS_98 = __VLS_97({
    id: "expense-amount",
    type: "number",
    modelValue: (__VLS_ctx.newExpense.unitCost),
    placeholder: "0.00",
    ...{ class: "pl-10" },
    min: "0",
    step: "0.01",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-2" },
});
const __VLS_100 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    for: "expense-notes",
}));
const __VLS_102 = __VLS_101({
    for: "expense-notes",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
var __VLS_103;
const __VLS_104 = {}.Textarea;
/** @type {[typeof __VLS_components.Textarea, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    id: "expense-notes",
    modelValue: (__VLS_ctx.newExpense.notes),
    placeholder: "Detalhes adicionais sobre a despesa...",
    rows: "3",
}));
const __VLS_106 = __VLS_105({
    id: "expense-notes",
    modelValue: (__VLS_ctx.newExpense.notes),
    placeholder: "Detalhes adicionais sobre a despesa...",
    rows: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_116;
let __VLS_117;
let __VLS_118;
const __VLS_119 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isDialogOpen = false;
    }
};
__VLS_115.slots.default;
var __VLS_115;
const __VLS_120 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.isFormValid || (__VLS_ctx.isEditing && !__VLS_ctx.hasChanges)),
}));
const __VLS_122 = __VLS_121({
    ...{ 'onClick': {} },
    disabled: (!__VLS_ctx.isFormValid || (__VLS_ctx.isEditing && !__VLS_ctx.hasChanges)),
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_124;
let __VLS_125;
let __VLS_126;
const __VLS_127 = {
    onClick: (__VLS_ctx.handleAddExpense)
};
__VLS_123.slots.default;
(__VLS_ctx.isEditing ? (__VLS_ctx.hasChanges ? 'Atualizar' : 'Fechar') : 'Adicionar');
var __VLS_123;
var __VLS_111;
var __VLS_27;
var __VLS_11;
if (__VLS_ctx.filteredExpenses.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
    });
    for (const [expense] of __VLS_getVForSourceType((__VLS_ctx.filteredExpenses))) {
        const __VLS_128 = {}.FinancialItem;
        /** @type {[typeof __VLS_components.FinancialItem, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            key: (expense.id),
            item: (expense),
            type: "expense",
        }));
        const __VLS_130 = __VLS_129({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            key: (expense.id),
            item: (expense),
            type: "expense",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        let __VLS_132;
        let __VLS_133;
        let __VLS_134;
        const __VLS_135 = {
            onEdit: (__VLS_ctx.handleEditExpense)
        };
        const __VLS_136 = {
            onDelete: (__VLS_ctx.handleDeleteExpense)
        };
        var __VLS_131;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12 bg-gray-50 rounded-lg" },
    });
    const __VLS_137 = {}.FileText;
    /** @type {[typeof __VLS_components.FileText, ]} */ ;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }));
    const __VLS_139 = __VLS_138({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-500 mb-4" },
    });
    (__VLS_ctx.searchTerm
        ? "Nenhuma despesa corresponde à sua busca."
        : "Adicione sua primeira despesa para começar a controlar os gastos.");
    if (__VLS_ctx.searchTerm) {
        const __VLS_141 = {}.Button;
        /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            ...{ 'onClick': {} },
            variant: "outline",
        }));
        const __VLS_143 = __VLS_142({
            ...{ 'onClick': {} },
            variant: "outline",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        let __VLS_145;
        let __VLS_146;
        let __VLS_147;
        const __VLS_148 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.filteredExpenses.length > 0))
                    return;
                if (!(__VLS_ctx.searchTerm))
                    return;
                __VLS_ctx.searchTerm = '';
            }
        };
        __VLS_144.slots.default;
        var __VLS_144;
    }
}
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-10']} */ ;
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
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
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
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=ExpensesSection.vue.js.map