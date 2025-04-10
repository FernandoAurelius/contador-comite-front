import { defineComponent } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Calendar, X, Plus, FileBarChart, Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DayModal from '@/components/DayModal.vue';
import FinancialItem from '@/components/FinancialItem.vue';
import useVendaStore from '@/stores/vendas';
export default defineComponent({
    name: 'VendasView',
    components: {
        Search, Calendar, X, Plus, FileBarChart, Loader2,
        Button, Input,
        Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
        Popover, PopoverContent, PopoverTrigger,
        CalendarComponent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
        DayModal, FinancialItem
    },
    data() {
        return {
            vendas: [],
            loading: false,
            selectedDate: null,
            isDayModalOpen: false,
            isDeleteDialogOpen: false,
            vendaToDelete: null,
            filters: {
                search: '',
                itemType: 'todos', // Valor inicial válido, não vazio
                dateRange: false,
                dateStart: null,
                dateEnd: null
            }
        };
    },
    computed: {
        filteredVendas() {
            return this.vendas.filter(venda => {
                const searchLower = this.filters.search.toLowerCase();
                const matchesSearch = this.getItemTypeName(venda.itemType).toLowerCase().includes(searchLower) ||
                    (venda.notes && venda.notes.toLowerCase().includes(searchLower));
                const matchesItemType = this.filters.itemType === 'todos' || venda.itemType === this.filters.itemType;
                const matchesDateRange = !this.filters.dateRange ||
                    (new Date(venda.date) >= this.filters.dateStart &&
                        new Date(venda.date) <= this.filters.dateEnd);
                return matchesSearch && matchesItemType && matchesDateRange;
            });
        },
        totalVendas() {
            return this.filteredVendas.reduce((total, venda) => total + venda.totalPrice, 0);
        },
        hasFilters() {
            return this.filters.search || this.filters.itemType !== 'todos' || this.filters.dateRange;
        }
    },
    methods: {
        async loadVendas() {
            this.loading = true;
            try {
                const vendaStore = useVendaStore();
                this.vendas = await vendaStore.getVendas();
            }
            catch (error) {
                console.error('Erro ao carregar vendas:', error);
            }
            finally {
                this.loading = false;
            }
        },
        formatDate(date) {
            return format(date, 'dd/MM/yyyy', { locale: ptBR });
        },
        formatCurrency(value) {
            return value.toFixed(2).replace('.', ',');
        },
        getItemTypeName(itemType) {
            const types = {
                'REFRI_COPO': 'Refri (copo)',
                'REFRI_GARRAFA': 'Refri (garrafa)',
                'PICOLE': 'Picolé',
                'CARTELA_BINGO': 'Cartela de Bingo',
                'CORREIO_ELEGANTE': 'Correio Elegante',
                'OUTROS': 'Outros'
            };
            return types[itemType] || itemType;
        },
        clearFilters() {
            this.filters = {
                search: '',
                itemType: 'todos', // Usando o valor não-vazio
                dateRange: false,
                dateStart: null,
                dateEnd: null
            };
        },
        onDateRangeChange(range) {
            this.filters.dateStart = range.from;
            this.filters.dateEnd = range.to || range.from;
            this.filters.dateRange = true;
        },
        openAddVendaModal() {
            this.selectedDate = new Date();
            this.isDayModalOpen = true;
        },
        editVenda(venda) {
            // Para editar, poderia adaptar o DayModal para receber uma venda existente
            console.log('Editar venda:', venda);
        },
        confirmDeleteVenda(venda) {
            this.vendaToDelete = venda;
            this.isDeleteDialogOpen = true;
        },
        async deleteVenda() {
            if (!this.vendaToDelete)
                return;
            try {
                const vendaStore = useVendaStore();
                await vendaStore.deleteVenda(this.vendaToDelete.id);
                await this.loadVendas(); // Recarregar após deletar
            }
            catch (error) {
                console.error('Erro ao excluir venda:', error);
            }
            finally {
                this.isDeleteDialogOpen = false;
                this.vendaToDelete = null;
            }
        }
    },
    // Usar beforeMount em vez de mounted para garantir que os dados sejam carregados antes do template ser renderizado
    beforeMount() {
        this.loadVendas();
    },
    beforeUnmount() {
        // Limpar referências para evitar vazamentos de memória
        this.selectedDate = null;
        this.vendaToDelete = null;
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Search, Calendar, X, Plus, FileBarChart, Loader2,
    Button, Input,
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    Popover, PopoverContent, PopoverTrigger,
    CalendarComponent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    DayModal, FinancialItem
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container py-4 sm:py-6 md:py-8 mx-auto" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid gap-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl sm:text-3xl font-bold mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-500 text-sm sm:text-base" },
});
const __VLS_0 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openAddVendaModal)
};
__VLS_3.slots.default;
const __VLS_8 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "h-4 w-4 mr-2" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "h-4 w-4 mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 sm:grid-cols-2 md:flex gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex-1 relative max-w-sm" },
});
const __VLS_12 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.filters.search),
    placeholder: "Buscar vendas...",
    ...{ class: "pl-10" },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.filters.search),
    placeholder: "Buscar vendas...",
    ...{ class: "pl-10" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-[12rem]" },
});
const __VLS_20 = {}.Select;
/** @type {[typeof __VLS_components.Select, typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.filters.itemType),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.filters.itemType),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.SelectTrigger;
/** @type {[typeof __VLS_components.SelectTrigger, typeof __VLS_components.SelectTrigger, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.SelectValue;
/** @type {[typeof __VLS_components.SelectValue, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    placeholder: "Tipo de item",
}));
const __VLS_30 = __VLS_29({
    placeholder: "Tipo de item",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_27;
const __VLS_32 = {}.SelectContent;
/** @type {[typeof __VLS_components.SelectContent, typeof __VLS_components.SelectContent, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.SelectItem;
/** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    value: "todos",
}));
const __VLS_38 = __VLS_37({
    value: "todos",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
var __VLS_39;
const __VLS_40 = {}.SelectItem;
/** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    value: "REFRI_COPO",
}));
const __VLS_42 = __VLS_41({
    value: "REFRI_COPO",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
var __VLS_43;
const __VLS_44 = {}.SelectItem;
/** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    value: "REFRI_GARRAFA",
}));
const __VLS_46 = __VLS_45({
    value: "REFRI_GARRAFA",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
var __VLS_47;
const __VLS_48 = {}.SelectItem;
/** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    value: "PICOLE",
}));
const __VLS_50 = __VLS_49({
    value: "PICOLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
var __VLS_51;
const __VLS_52 = {}.SelectItem;
/** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    value: "CARTELA_BINGO",
}));
const __VLS_54 = __VLS_53({
    value: "CARTELA_BINGO",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
var __VLS_55;
const __VLS_56 = {}.SelectItem;
/** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    value: "CORREIO_ELEGANTE",
}));
const __VLS_58 = __VLS_57({
    value: "CORREIO_ELEGANTE",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
const __VLS_60 = {}.SelectItem;
/** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    value: "OUTROS",
}));
const __VLS_62 = __VLS_61({
    value: "OUTROS",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
var __VLS_63;
var __VLS_35;
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "max-w-[12rem]" },
});
const __VLS_64 = {}.Popover;
/** @type {[typeof __VLS_components.Popover, typeof __VLS_components.Popover, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.PopoverTrigger;
/** @type {[typeof __VLS_components.PopoverTrigger, typeof __VLS_components.PopoverTrigger, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    asChild: true,
}));
const __VLS_70 = __VLS_69({
    asChild: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    variant: "outline",
    ...{ class: "w-full justify-start text-left" },
}));
const __VLS_74 = __VLS_73({
    variant: "outline",
    ...{ class: "w-full justify-start text-left" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.Calendar;
/** @type {[typeof __VLS_components.Calendar, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ class: "mr-2 h-4 w-4" },
}));
const __VLS_78 = __VLS_77({
    ...{ class: "mr-2 h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
(__VLS_ctx.filters.dateRange ? `${__VLS_ctx.formatDate(__VLS_ctx.filters.dateStart)} - ${__VLS_ctx.formatDate(__VLS_ctx.filters.dateEnd)}` : 'Período');
var __VLS_75;
var __VLS_71;
const __VLS_80 = {}.PopoverContent;
/** @type {[typeof __VLS_components.PopoverContent, typeof __VLS_components.PopoverContent, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    ...{ class: "w-auto p-0" },
    align: "start",
}));
const __VLS_82 = __VLS_81({
    ...{ class: "w-auto p-0" },
    align: "start",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.Calendar;
/** @type {[typeof __VLS_components.Calendar, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    ...{ 'onUpdate:range': {} },
    ...{ class: "p-3" },
    mode: "range",
    selectedFrom: (__VLS_ctx.filters.dateStart),
    selectedTo: (__VLS_ctx.filters.dateEnd),
}));
const __VLS_86 = __VLS_85({
    ...{ 'onUpdate:range': {} },
    ...{ class: "p-3" },
    mode: "range",
    selectedFrom: (__VLS_ctx.filters.dateStart),
    selectedTo: (__VLS_ctx.filters.dateEnd),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
let __VLS_88;
let __VLS_89;
let __VLS_90;
const __VLS_91 = {
    'onUpdate:range': (__VLS_ctx.onDateRangeChange)
};
var __VLS_87;
var __VLS_83;
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_92 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_94 = __VLS_93({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onClick: (__VLS_ctx.clearFilters)
};
__VLS_95.slots.default;
const __VLS_100 = {}.X;
/** @type {[typeof __VLS_components.X, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ class: "h-4 w-4 mr-2" },
}));
const __VLS_102 = __VLS_101({
    ...{ class: "h-4 w-4 mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
var __VLS_95;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-10" },
    });
    const __VLS_104 = {}.Loader2;
    /** @type {[typeof __VLS_components.Loader2, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ class: "h-8 w-8 animate-spin text-gray-400" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ class: "h-8 w-8 animate-spin text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
}
else if (__VLS_ctx.filteredVendas.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12 bg-gray-50 rounded-lg" },
    });
    const __VLS_108 = {}.FileBarChart;
    /** @type {[typeof __VLS_components.FileBarChart, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }));
    const __VLS_110 = __VLS_109({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-500 mb-4" },
    });
    (__VLS_ctx.hasFilters ? 'Nenhuma venda corresponde aos filtros aplicados.' : 'Adicione sua primeira venda para começar.');
    if (__VLS_ctx.hasFilters) {
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
            onClick: (__VLS_ctx.clearFilters)
        };
        __VLS_115.slots.default;
        var __VLS_115;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
    });
    for (const [venda] of __VLS_getVForSourceType((__VLS_ctx.filteredVendas))) {
        const __VLS_120 = {}.FinancialItem;
        /** @type {[typeof __VLS_components.FinancialItem, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            key: (venda.id),
            item: (venda),
            type: "sale",
        }));
        const __VLS_122 = __VLS_121({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            key: (venda.id),
            item: (venda),
            type: "sale",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        let __VLS_124;
        let __VLS_125;
        let __VLS_126;
        const __VLS_127 = {
            onEdit: (__VLS_ctx.editVenda)
        };
        const __VLS_128 = {
            onDelete: (__VLS_ctx.confirmDeleteVenda)
        };
        var __VLS_123;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-6 bg-gray-50 p-4 rounded-lg" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-bold" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.totalVendas));
}
const __VLS_129 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    open: (__VLS_ctx.isDeleteDialogOpen),
}));
const __VLS_131 = __VLS_130({
    open: (__VLS_ctx.isDeleteDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
const __VLS_133 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({}));
const __VLS_135 = __VLS_134({}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
const __VLS_137 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({}));
const __VLS_139 = __VLS_138({}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({}));
const __VLS_143 = __VLS_142({}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
var __VLS_144;
const __VLS_145 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({}));
const __VLS_147 = __VLS_146({}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
var __VLS_148;
var __VLS_140;
const __VLS_149 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({}));
const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_155 = __VLS_154({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
let __VLS_157;
let __VLS_158;
let __VLS_159;
const __VLS_160 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isDeleteDialogOpen = false;
    }
};
__VLS_156.slots.default;
var __VLS_156;
const __VLS_161 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    ...{ 'onClick': {} },
    variant: "destructive",
}));
const __VLS_163 = __VLS_162({
    ...{ 'onClick': {} },
    variant: "destructive",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
let __VLS_165;
let __VLS_166;
let __VLS_167;
const __VLS_168 = {
    onClick: (__VLS_ctx.deleteVenda)
};
__VLS_164.slots.default;
var __VLS_164;
var __VLS_152;
var __VLS_136;
var __VLS_132;
if (__VLS_ctx.selectedDate) {
    const __VLS_169 = {}.DayModal;
    /** @type {[typeof __VLS_components.DayModal, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        ...{ 'onUpdate:isOpen': {} },
        ...{ 'onSave': {} },
        date: (__VLS_ctx.selectedDate),
        isOpen: (__VLS_ctx.isDayModalOpen),
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onUpdate:isOpen': {} },
        ...{ 'onSave': {} },
        date: (__VLS_ctx.selectedDate),
        isOpen: (__VLS_ctx.isDayModalOpen),
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_173;
    let __VLS_174;
    let __VLS_175;
    const __VLS_176 = {
        'onUpdate:isOpen': (...[$event]) => {
            if (!(__VLS_ctx.selectedDate))
                return;
            __VLS_ctx.isDayModalOpen = $event;
        }
    };
    const __VLS_177 = {
        onSave: (__VLS_ctx.loadVendas)
    };
    var __VLS_172;
}
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-10']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[12rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[12rem]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=VendasView.vue.js.map