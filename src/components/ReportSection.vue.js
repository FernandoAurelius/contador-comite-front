import { defineComponent, ref, computed } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Calendar, CalendarClock, Loader2, AlertCircle, TrendingUp, TrendingDown, FileBarChart, FileText } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart } from '@/components/ui/chart-bar';
import { DonutChart } from '@/components/ui/chart-donut';
import { useReportStore } from '@/stores/report';
import { toast } from 'vue-sonner';
import FinancialItem from '@/components/FinancialItem.vue';
export default defineComponent({
    name: 'ReportSection',
    components: {
        Search, Calendar, CalendarClock, Loader2, AlertCircle,
        TrendingUp, TrendingDown, FileBarChart, FileText,
        Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription,
        Tabs, TabsContent, TabsList, TabsTrigger, Badge,
        Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
        BarChart, DonutChart, FinancialItem
    },
    setup() {
        const reportStore = useReportStore();
        const report = ref(null);
        const loading = ref(false);
        const error = ref(null);
        const searchTerm = ref('');
        const selectedPeriod = ref('diario');
        const isTroteMode = ref(false);
        const periodOptions = [
            { value: 'diario', label: 'Diário' },
            { value: 'semanal', label: 'Semanal' },
            { value: 'mensal', label: 'Mensal' },
        ];
        const toggleTroteMode = () => {
            isTroteMode.value = !isTroteMode.value;
            generateReport();
        };
        const generateReport = async () => {
            loading.value = true;
            error.value = null;
            try {
                const data = await reportStore.fetchReport(selectedPeriod.value, isTroteMode.value);
                report.value = data;
                toast.success("Relatório gerado com sucesso!");
            }
            catch (err) {
                console.error('Erro ao carregar relatório:', err);
                error.value = err.response?.data || 'Não foi possível carregar os dados do relatório. Por favor, tente novamente.';
                toast.error("Falha ao gerar relatório", {
                    description: `${error.value}`
                });
            }
            finally {
                loading.value = false;
            }
        };
        const formatDate = (dateStr) => {
            try {
                const date = new Date(dateStr);
                return format(date, 'dd/MM/yyyy', { locale: ptBR });
            }
            catch (e) {
                return 'Data inválida';
            }
        };
        // Versão segura do formatCurrency
        const formatCurrency = (value) => {
            // Se o valor for null, undefined ou NaN, retorna zero formatado
            if (value === null || value === undefined || isNaN(value)) {
                return '0,00';
            }
            return value.toFixed(2).replace('.', ',');
        };
        const getReportPeriodText = () => {
            if (!report.value)
                return '';
            switch (selectedPeriod.value) {
                case 'diario': return 'No dia';
                case 'semanal': return 'Na semana';
                case 'mensal': return 'No mês';
                default: return '';
            }
        };
        // Calcular o saldo (receitas - despesas)
        const calculateBalance = () => {
            if (!report.value)
                return 0;
            return report.value.totalIncome - report.value.totalCosts;
        };
        // Determinar a classe de cor para o saldo
        const getSaldoClass = () => {
            if (!report.value)
                return '';
            const balance = calculateBalance();
            return balance >= 0 ? 'text-emerald-600' : 'text-red-600';
        };
        // Dados para o gráfico de comparação com formato correto
        const comparisonChartData = computed(() => {
            if (!report.value)
                return [];
            return [
                { category: 'Receitas', name: 'Receitas', value: report.value.totalIncome },
                { category: 'Despesas', name: 'Despesas', value: Math.abs(report.value.totalCosts) }
            ];
        });
        // Dados para o gráfico de categorias com formato correto para DonutChart
        const categoryChartData = computed(() => {
            if (!report.value)
                return [];
            if (isTroteMode.value && report.value.incomeTrote) {
                // Lógica para eventos de trote
                const troteSummary = report.value.incomeTrote;
                // Gerando dados para o gráfico de trote
                return [
                    { category: 'Cartela Bingo', name: 'Cartela Bingo', value: troteSummary.cartelaSum || 0 },
                    { category: 'Correio Elegante', name: 'Correio Elegante', value: troteSummary.correioSum || 0 },
                    { category: 'Cadeia do Amor', name: 'Cadeia do Amor', value: troteSummary.cadeiaSum || 0 },
                    { category: 'Outros', name: 'Outros', value: troteSummary.outroSum || 0 }
                ].filter(item => item.value > 0);
            }
            else {
                // Lógica para vendas regulares
                const income = report.value.income;
                if (!income)
                    return [];
                return [
                    { category: 'Refri (copo)', name: 'Refri (copo)', value: income.copoSum || 0 },
                    { category: 'Refri (garrafa)', name: 'Refri (garrafa)', value: income.garrafaSum || 0 },
                    { category: 'Picolé', name: 'Picolé', value: income.picoleSum || 0 }
                ].filter(item => item.value > 0);
            }
        });
        // Transformar os dados de receitas para o formato do FinancialItem
        const incomeItems = computed(() => {
            if (!report.value)
                return [];
            const currentDate = formatDate(new Date().toISOString());
            const items = [];
            if (isTroteMode.value && report.value.incomeTrote) {
                // Items para trote
                const troteSummary = report.value.incomeTrote;
                // Cartela Bingo
                if (troteSummary.cartelaSum > 0) {
                    items.push({
                        id: 'cartela',
                        date: currentDate,
                        itemType: 'CARTELA_BINGO',
                        quantity: Math.round(troteSummary.cartelaSum / 2.5), // Estimando quantidades
                        unitPrice: 2.5,
                        totalPrice: troteSummary.cartelaSum,
                        notes: 'Resumo do período (trote)'
                    });
                }
                // Correio Elegante
                if (troteSummary.correioSum > 0) {
                    items.push({
                        id: 'correio',
                        date: currentDate,
                        itemType: 'CORREIO_ELEGANTE',
                        quantity: Math.round(troteSummary.correioSum / 1.5),
                        unitPrice: 1.5,
                        totalPrice: troteSummary.correioSum,
                        notes: 'Resumo do período (trote)'
                    });
                }
                // Cadeia do Amor
                if (troteSummary.cadeiaSum > 0) {
                    items.push({
                        id: 'cadeia',
                        date: currentDate,
                        itemType: 'CADEIA_AMOR',
                        quantity: Math.round(troteSummary.cadeiaSum / 2),
                        unitPrice: 2,
                        totalPrice: troteSummary.cadeiaSum,
                        notes: 'Resumo do período (trote)'
                    });
                }
                // Outros itens de trote
                if (troteSummary.outroSum > 0) {
                    items.push({
                        id: 'outros_trote',
                        date: currentDate,
                        itemType: 'OUTROS',
                        quantity: 1,
                        unitPrice: troteSummary.outroSum,
                        totalPrice: troteSummary.outroSum,
                        notes: 'Outros itens de trote'
                    });
                }
            }
            else {
                // Items para vendas regulares
                const income = report.value.income;
                if (!income)
                    return [];
                // Refri copo
                if (income.copoSum > 0) {
                    items.push({
                        id: 'copo',
                        date: currentDate,
                        itemType: 'REFRI_COPO',
                        quantity: Math.round(income.copoSum / 2.5), // Estimando quantidades com base no preço
                        unitPrice: 2.5,
                        totalPrice: income.copoSum,
                        notes: 'Resumo do período'
                    });
                }
                // Refri garrafa
                if (income.garrafaSum > 0) {
                    items.push({
                        id: 'garrafa',
                        date: currentDate,
                        itemType: 'REFRI_GARRAFA',
                        quantity: Math.round(income.garrafaSum / 15),
                        unitPrice: 15,
                        totalPrice: income.garrafaSum,
                        notes: 'Resumo do período'
                    });
                }
                // Picolé
                if (income.picoleSum > 0) {
                    items.push({
                        id: 'picole',
                        date: currentDate,
                        itemType: 'PICOLE',
                        quantity: Math.round(income.picoleSum / 4),
                        unitPrice: 4,
                        totalPrice: income.picoleSum,
                        notes: 'Resumo do período'
                    });
                }
            }
            return items;
        });
        // Transformar os dados de despesas para o formato do FinancialItem
        const expenseItems = computed(() => {
            if (!report.value || !report.value.costs || !report.value.costs.length)
                return [];
            // Data atual como referência
            const currentDate = formatDate(new Date().toISOString());
            return report.value.costs.map((cost, index) => ({
                id: index,
                date: currentDate,
                item: cost.item,
                quantity: 1, // Assumindo que cada item é uma unidade
                unitCost: cost.totalCost,
                totalCost: cost.totalCost,
                notes: 'Resumo do período'
            }));
        });
        // Cores para o gráfico
        const chartColors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];
        // Função para obter a cor para cada categoria
        const getChartColor = (index) => {
            return chartColors[index % chartColors.length];
        };
        // Função para calcular o total das categorias (para percentuais)
        const getTotalForCategory = () => {
            if (!categoryChartData.value || !categoryChartData.value.length)
                return 0;
            return categoryChartData.value.reduce((sum, item) => sum + item.value, 0);
        };
        return {
            report,
            loading,
            error,
            searchTerm,
            selectedPeriod,
            isTroteMode,
            periodOptions,
            toggleTroteMode,
            generateReport,
            formatDate,
            formatCurrency,
            getReportPeriodText,
            calculateBalance,
            getSaldoClass,
            comparisonChartData,
            categoryChartData,
            incomeItems,
            expenseItems,
            getChartColor,
            getTotalForCategory
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Search, Calendar, CalendarClock, Loader2, AlertCircle,
    TrendingUp, TrendingDown, FileBarChart, FileText,
    Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription,
    Tabs, TabsContent, TabsList, TabsTrigger, Badge,
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
    BarChart, DonutChart, FinancialItem
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['recharts-bar-rectangle']} */ ;
// CSS variable injection 
// CSS variable injection end 
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
    placeholder: "Buscar transações...",
    modelValue: (__VLS_ctx.searchTerm),
    ...{ class: "pl-10" },
}));
const __VLS_6 = __VLS_5({
    placeholder: "Buscar transações...",
    modelValue: (__VLS_ctx.searchTerm),
    ...{ class: "pl-10" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex gap-2" },
});
const __VLS_8 = {}.Select;
/** @type {[typeof __VLS_components.Select, typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.selectedPeriod),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.selectedPeriod),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.SelectTrigger;
/** @type {[typeof __VLS_components.SelectTrigger, typeof __VLS_components.SelectTrigger, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "w-[150px]" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "w-[150px]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.SelectValue;
/** @type {[typeof __VLS_components.SelectValue, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    placeholder: (__VLS_ctx.periodOptions.find(p => p.value === __VLS_ctx.selectedPeriod)?.label || 'Período'),
}));
const __VLS_18 = __VLS_17({
    placeholder: (__VLS_ctx.periodOptions.find(p => p.value === __VLS_ctx.selectedPeriod)?.label || 'Período'),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_15;
const __VLS_20 = {}.SelectContent;
/** @type {[typeof __VLS_components.SelectContent, typeof __VLS_components.SelectContent, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.SelectGroup;
/** @type {[typeof __VLS_components.SelectGroup, typeof __VLS_components.SelectGroup, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.SelectLabel;
/** @type {[typeof __VLS_components.SelectLabel, typeof __VLS_components.SelectLabel, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
var __VLS_31;
for (const [option] of __VLS_getVForSourceType((__VLS_ctx.periodOptions))) {
    const __VLS_32 = {}.SelectItem;
    /** @type {[typeof __VLS_components.SelectItem, typeof __VLS_components.SelectItem, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        key: (option.value),
        value: (option.value),
    }));
    const __VLS_34 = __VLS_33({
        key: (option.value),
        value: (option.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (option.label);
    var __VLS_35;
}
var __VLS_27;
var __VLS_23;
var __VLS_11;
const __VLS_36 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    variant: (__VLS_ctx.isTroteMode ? 'default' : 'outline'),
    ...{ class: "gap-2" },
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    variant: (__VLS_ctx.isTroteMode ? 'default' : 'outline'),
    ...{ class: "gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.toggleTroteMode)
};
__VLS_39.slots.default;
if (__VLS_ctx.isTroteMode) {
    const __VLS_44 = {}.CalendarClock;
    /** @type {[typeof __VLS_components.CalendarClock, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_46 = __VLS_45({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
}
else {
    const __VLS_48 = {}.Calendar;
    /** @type {[typeof __VLS_components.Calendar, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_50 = __VLS_49({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
}
(__VLS_ctx.isTroteMode ? 'Trote' : 'Regular');
var __VLS_39;
const __VLS_52 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ 'onClick': {} },
    ...{ class: "flex items-center gap-2" },
}));
const __VLS_54 = __VLS_53({
    ...{ 'onClick': {} },
    ...{ class: "flex items-center gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
    onClick: (__VLS_ctx.generateReport)
};
__VLS_55.slots.default;
const __VLS_60 = {}.FileBarChart;
/** @type {[typeof __VLS_components.FileBarChart, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ class: "h-4 w-4" },
}));
const __VLS_62 = __VLS_61({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_55;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-10" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        role: "status",
    });
    const __VLS_64 = {}.Loader2;
    /** @type {[typeof __VLS_components.Loader2, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        ...{ class: "h-8 w-8 animate-spin text-gray-400" },
    }));
    const __VLS_66 = __VLS_65({
        ...{ class: "h-8 w-8 animate-spin text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sr-only" },
    });
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12 bg-red-50 rounded-lg" },
    });
    const __VLS_68 = {}.AlertCircle;
    /** @type {[typeof __VLS_components.AlertCircle, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ class: "h-12 w-12 text-red-400 mx-auto mb-4" },
    }));
    const __VLS_70 = __VLS_69({
        ...{ class: "h-12 w-12 text-red-400 mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-red-900 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-red-500 mb-4" },
    });
    (__VLS_ctx.error);
    const __VLS_72 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        variant: "outline",
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    let __VLS_78;
    const __VLS_79 = {
        onClick: (__VLS_ctx.generateReport)
    };
    __VLS_75.slots.default;
    var __VLS_75;
}
else if (__VLS_ctx.report) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
    });
    const __VLS_80 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
    const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ class: "pb-2" },
    }));
    const __VLS_86 = __VLS_85({
        ...{ class: "pb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ class: "text-sm font-medium text-gray-500" },
    }));
    const __VLS_90 = __VLS_89({
        ...{ class: "text-sm font-medium text-gray-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    var __VLS_91;
    var __VLS_87;
    const __VLS_92 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
    const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-2xl font-bold text-emerald-600" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.report.totalIncome));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
    (__VLS_ctx.getReportPeriodText());
    var __VLS_95;
    var __VLS_83;
    const __VLS_96 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
    const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    const __VLS_100 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ class: "pb-2" },
    }));
    const __VLS_102 = __VLS_101({
        ...{ class: "pb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ class: "text-sm font-medium text-gray-500" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ class: "text-sm font-medium text-gray-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    var __VLS_107;
    var __VLS_103;
    const __VLS_108 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
    const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-2xl font-bold text-red-600" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.report.totalCosts));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
    (__VLS_ctx.getReportPeriodText());
    var __VLS_111;
    var __VLS_99;
    const __VLS_112 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({}));
    const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    const __VLS_116 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ class: "pb-2" },
    }));
    const __VLS_118 = __VLS_117({
        ...{ class: "pb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ class: "text-sm font-medium text-gray-500" },
    }));
    const __VLS_122 = __VLS_121({
        ...{ class: "text-sm font-medium text-gray-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    var __VLS_123;
    var __VLS_119;
    const __VLS_124 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
    const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-2xl font-bold" },
        ...{ class: (__VLS_ctx.getSaldoClass()) },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.calculateBalance()));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
    var __VLS_127;
    var __VLS_115;
    const __VLS_128 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
    const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ class: "pb-2" },
    }));
    const __VLS_134 = __VLS_133({
        ...{ class: "pb-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    const __VLS_136 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        ...{ class: "text-sm font-medium text-gray-500" },
    }));
    const __VLS_138 = __VLS_137({
        ...{ class: "text-sm font-medium text-gray-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    var __VLS_139;
    var __VLS_135;
    const __VLS_140 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
    const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-2xl font-bold text-indigo-600" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.report.totalProfit));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1" },
    });
    var __VLS_143;
    var __VLS_131;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
    });
    const __VLS_144 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
    const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
    const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    const __VLS_152 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
    const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    var __VLS_155;
    const __VLS_156 = {}.CardDescription;
    /** @type {[typeof __VLS_components.CardDescription, typeof __VLS_components.CardDescription, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
    const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    var __VLS_159;
    var __VLS_151;
    const __VLS_160 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ class: "h-80 relative" },
    }));
    const __VLS_162 = __VLS_161({
        ...{ class: "h-80 relative" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    __VLS_163.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-full w-full" },
    });
    if (__VLS_ctx.comparisonChartData.length > 0) {
        const __VLS_164 = {}.BarChart;
        /** @type {[typeof __VLS_components.BarChart, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            data: (__VLS_ctx.comparisonChartData),
            items: (__VLS_ctx.comparisonChartData),
            index: "category",
            categories: (['value']),
            colors: (['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)']),
            yFormatter: ((tick) => `R$ ${__VLS_ctx.formatCurrency(Number(tick))}`),
            ...{ class: "h-full w-full" },
        }));
        const __VLS_166 = __VLS_165({
            data: (__VLS_ctx.comparisonChartData),
            items: (__VLS_ctx.comparisonChartData),
            index: "category",
            categories: (['value']),
            colors: (['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)']),
            yFormatter: ((tick) => `R$ ${__VLS_ctx.formatCurrency(Number(tick))}`),
            ...{ class: "h-full w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "h-full flex items-center justify-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-500 text-sm" },
        });
    }
    var __VLS_163;
    var __VLS_147;
    const __VLS_168 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({}));
    const __VLS_170 = __VLS_169({}, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
    const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    const __VLS_176 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
    const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
    __VLS_179.slots.default;
    var __VLS_179;
    const __VLS_180 = {}.CardDescription;
    /** @type {[typeof __VLS_components.CardDescription, typeof __VLS_components.CardDescription, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({}));
    const __VLS_182 = __VLS_181({}, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    (__VLS_ctx.isTroteMode ? 'Categorias de vendas em eventos de trote' : 'Categorias de vendas por produto');
    var __VLS_183;
    var __VLS_175;
    const __VLS_184 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ class: "h-80 relative p-0" },
    }));
    const __VLS_186 = __VLS_185({
        ...{ class: "h-80 relative p-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-full flex flex-col pt-0" },
    });
    if (__VLS_ctx.categoryChartData.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex-none px-4 pt-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex flex-wrap justify-center gap-2 mb-2" },
        });
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.categoryChartData))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (`legend-${index}`),
                ...{ class: "flex items-center text-xs bg-gray-50 rounded-md px-2 py-1 border border-gray-100" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "w-2 h-2 rounded-sm mr-1" },
                ...{ style: ({ backgroundColor: __VLS_ctx.getChartColor(index) }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-medium" },
            });
            (item.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-gray-500 ml-1" },
            });
            (__VLS_ctx.formatCurrency(item.value));
            (item.value ? ` - ${((item.value / __VLS_ctx.getTotalForCategory()) * 100).toFixed(1)}%` : '');
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-grow px-5 py-5" },
    });
    if (__VLS_ctx.categoryChartData.length > 0) {
        const __VLS_188 = {}.DonutChart;
        /** @type {[typeof __VLS_components.DonutChart, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            data: (__VLS_ctx.categoryChartData),
            items: (__VLS_ctx.categoryChartData),
            index: "category",
            categories: (['value']),
            categoryPercs: (false),
            formatter: ((value) => `R$ ${__VLS_ctx.formatCurrency(value)}`),
            ...{ class: "h-full w-full" },
            legend: (false),
            showLabels: (true),
        }));
        const __VLS_190 = __VLS_189({
            data: (__VLS_ctx.categoryChartData),
            items: (__VLS_ctx.categoryChartData),
            index: "category",
            categories: (['value']),
            categoryPercs: (false),
            formatter: ((value) => `R$ ${__VLS_ctx.formatCurrency(value)}`),
            ...{ class: "h-full w-full" },
            legend: (false),
            showLabels: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "h-full flex items-center justify-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-500 text-sm" },
        });
    }
    var __VLS_187;
    var __VLS_171;
    const __VLS_192 = {}.Tabs;
    /** @type {[typeof __VLS_components.Tabs, typeof __VLS_components.Tabs, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        defaultValue: "income",
        ...{ class: "w-full" },
    }));
    const __VLS_194 = __VLS_193({
        defaultValue: "income",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    __VLS_195.slots.default;
    const __VLS_196 = {}.TabsList;
    /** @type {[typeof __VLS_components.TabsList, typeof __VLS_components.TabsList, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({}));
    const __VLS_198 = __VLS_197({}, ...__VLS_functionalComponentArgsRest(__VLS_197));
    __VLS_199.slots.default;
    const __VLS_200 = {}.TabsTrigger;
    /** @type {[typeof __VLS_components.TabsTrigger, typeof __VLS_components.TabsTrigger, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        value: "income",
        ...{ class: "flex items-center gap-2" },
    }));
    const __VLS_202 = __VLS_201({
        value: "income",
        ...{ class: "flex items-center gap-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    const __VLS_204 = {}.TrendingUp;
    /** @type {[typeof __VLS_components.TrendingUp, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_206 = __VLS_205({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    var __VLS_203;
    const __VLS_208 = {}.TabsTrigger;
    /** @type {[typeof __VLS_components.TabsTrigger, typeof __VLS_components.TabsTrigger, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        value: "expenses",
        ...{ class: "flex items-center gap-2" },
    }));
    const __VLS_210 = __VLS_209({
        value: "expenses",
        ...{ class: "flex items-center gap-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    const __VLS_212 = {}.TrendingDown;
    /** @type {[typeof __VLS_components.TrendingDown, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        ...{ class: "h-4 w-4" },
    }));
    const __VLS_214 = __VLS_213({
        ...{ class: "h-4 w-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    var __VLS_211;
    var __VLS_199;
    const __VLS_216 = {}.TabsContent;
    /** @type {[typeof __VLS_components.TabsContent, typeof __VLS_components.TabsContent, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        value: "income",
    }));
    const __VLS_218 = __VLS_217({
        value: "income",
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    __VLS_219.slots.default;
    if (__VLS_ctx.incomeItems.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
        });
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.incomeItems))) {
            const __VLS_220 = {}.FinancialItem;
            /** @type {[typeof __VLS_components.FinancialItem, ]} */ ;
            // @ts-ignore
            const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                key: (index),
                item: (item),
                type: "sale",
            }));
            const __VLS_222 = __VLS_221({
                key: (index),
                item: (item),
                type: "sale",
            }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center py-12 bg-gray-50 rounded-lg" },
        });
        const __VLS_224 = {}.FileText;
        /** @type {[typeof __VLS_components.FileText, ]} */ ;
        // @ts-ignore
        const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
            ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
        }));
        const __VLS_226 = __VLS_225({
            ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_225));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-500" },
        });
    }
    var __VLS_219;
    const __VLS_228 = {}.TabsContent;
    /** @type {[typeof __VLS_components.TabsContent, typeof __VLS_components.TabsContent, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        value: "expenses",
    }));
    const __VLS_230 = __VLS_229({
        value: "expenses",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    __VLS_231.slots.default;
    if (__VLS_ctx.expenseItems.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
        });
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.expenseItems))) {
            const __VLS_232 = {}.FinancialItem;
            /** @type {[typeof __VLS_components.FinancialItem, ]} */ ;
            // @ts-ignore
            const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
                key: (index),
                item: (item),
                type: "expense",
            }));
            const __VLS_234 = __VLS_233({
                key: (index),
                item: (item),
                type: "expense",
            }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center py-12 bg-gray-50 rounded-lg" },
        });
        const __VLS_236 = {}.FileText;
        /** @type {[typeof __VLS_components.FileText, ]} */ ;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
            ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
        }));
        const __VLS_238 = __VLS_237({
            ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-500" },
        });
    }
    var __VLS_231;
    var __VLS_195;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12 bg-gray-50 rounded-lg" },
    });
    const __VLS_240 = {}.FileBarChart;
    /** @type {[typeof __VLS_components.FileBarChart, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }));
    const __VLS_242 = __VLS_241({
        ...{ class: "h-12 w-12 text-gray-400 mx-auto mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-medium text-gray-900 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-500 mb-4" },
    });
    const __VLS_244 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        ...{ 'onClick': {} },
    }));
    const __VLS_246 = __VLS_245({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    let __VLS_248;
    let __VLS_249;
    let __VLS_250;
    const __VLS_251 = {
        onClick: (__VLS_ctx.generateReport)
    };
    __VLS_247.slots.default;
    var __VLS_247;
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
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[150px]']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-900']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-80']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['h-80']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-none']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
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
//# sourceMappingURL=ReportSection.vue.js.map