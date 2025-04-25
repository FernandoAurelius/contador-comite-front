import { defineComponent, ref, onMounted, computed } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileX, X } from 'lucide-vue-next';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import bankStatementService from '@/services/bankStatementService';
export default defineComponent({
    name: 'PublicBankStatements',
    components: {
        Card, CardContent, CardHeader, CardTitle, CardDescription,
        Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
        Select, Label, Button,
        AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
        FileX, X
    },
    setup() {
        const loading = ref(true);
        const statements = ref([]);
        const selectedPeriod = ref('');
        onMounted(async () => {
            try {
                statements.value = await bankStatementService.getStatements();
            }
            catch (error) {
                console.error('Erro ao carregar extratos:', error);
            }
            finally {
                loading.value = false;
            }
        });
        const uniquePeriods = computed(() => {
            const periods = new Set();
            statements.value.forEach(statement => {
                periods.add(statement.period);
            });
            return Array.from(periods).sort();
        });
        const filteredStatements = computed(() => {
            if (!selectedPeriod.value) {
                return statements.value;
            }
            return statements.value.filter(s => s.period === selectedPeriod.value);
        });
        const totalAmount = computed(() => {
            return filteredStatements.value.reduce((sum, statement) => sum + statement.amount, 0);
        });
        const chartData = computed(() => {
            // Agregar dados por período para o gráfico
            const periodMap = new Map();
            statements.value.forEach(statement => {
                const currentValue = periodMap.get(statement.period) || 0;
                periodMap.set(statement.period, currentValue + statement.amount);
            });
            // Converter para formato do recharts e ordenar por período
            return Array.from(periodMap.entries())
                .map(([period, value]) => ({ name: period, valor: value }))
                .sort((a, b) => {
                // Ordenar os períodos cronologicamente
                const periodA = a.name.split('/');
                const periodB = b.name.split('/');
                // Se for período composto (MM/YYYY-MM/YYYY), pegar o primeiro
                const yearA = parseInt(periodA[periodA.length > 1 ? 1 : 0]);
                const yearB = parseInt(periodB[periodB.length > 1 ? 1 : 0]);
                if (yearA !== yearB)
                    return yearA - yearB;
                const monthA = parseInt(periodA[0]);
                const monthB = parseInt(periodB[0]);
                return monthA - monthB;
            });
        });
        const formatCurrency = (value) => {
            return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };
        const formatDate = (date) => {
            if (!date)
                return '';
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
        };
        return {
            loading,
            statements,
            selectedPeriod,
            uniquePeriods,
            filteredStatements,
            totalAmount,
            chartData,
            formatCurrency,
            formatDate
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Card, CardContent, CardHeader, CardTitle, CardDescription,
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
    Select, Label, Button,
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    FileX, X
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
const __VLS_0 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.CardHeader;
/** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.CardTitle;
/** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
const __VLS_12 = {}.CardDescription;
/** @type {[typeof __VLS_components.CardDescription, typeof __VLS_components.CardDescription, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
var __VLS_7;
const __VLS_16 = {}.CardContent;
/** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-6 space-y-2" },
});
const __VLS_20 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    for: "periodFilter",
}));
const __VLS_22 = __VLS_21({
    for: "periodFilter",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex space-x-2" },
});
const __VLS_24 = {}.Select;
/** @type {[typeof __VLS_components.Select, typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    id: "periodFilter",
    modelValue: (__VLS_ctx.selectedPeriod),
    ...{ class: "w-full" },
}));
const __VLS_26 = __VLS_25({
    id: "periodFilter",
    modelValue: (__VLS_ctx.selectedPeriod),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
for (const [period] of __VLS_getVForSourceType((__VLS_ctx.uniquePeriods))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (period),
        value: (period),
    });
    (period);
}
var __VLS_27;
const __VLS_28 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (...[$event]) => {
        __VLS_ctx.selectedPeriod = '';
    }
};
__VLS_31.slots.default;
const __VLS_36 = {}.X;
/** @type {[typeof __VLS_components.X, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ class: "h-4 w-4" },
}));
const __VLS_38 = __VLS_37({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_31;
if (__VLS_ctx.statements.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-64 mb-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-sm font-medium mb-2" },
    });
    const __VLS_40 = {}.ResponsiveContainer;
    /** @type {[typeof __VLS_components.ResponsiveContainer, typeof __VLS_components.ResponsiveContainer, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        width: "100%",
        height: "90%",
    }));
    const __VLS_42 = __VLS_41({
        width: "100%",
        height: "90%",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.AreaChart;
    /** @type {[typeof __VLS_components.AreaChart, typeof __VLS_components.AreaChart, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        data: (__VLS_ctx.chartData),
    }));
    const __VLS_46 = __VLS_45({
        data: (__VLS_ctx.chartData),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = {}.XAxis;
    /** @type {[typeof __VLS_components.XAxis, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        dataKey: "name",
    }));
    const __VLS_50 = __VLS_49({
        dataKey: "name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_52 = {}.YAxis;
    /** @type {[typeof __VLS_components.YAxis, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const __VLS_56 = {}.Tooltip;
    /** @type {[typeof __VLS_components.Tooltip, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
    const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_60 = {}.Area;
    /** @type {[typeof __VLS_components.Area, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        type: "monotone",
        dataKey: "valor",
        stroke: "#10b981",
        fill: "#10b981",
        fillOpacity: "{0.2}",
    }));
    const __VLS_62 = __VLS_61({
        type: "monotone",
        dataKey: "valor",
        stroke: "#10b981",
        fill: "#10b981",
        fillOpacity: "{0.2}",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    var __VLS_47;
    var __VLS_43;
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center py-8" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-2" },
    });
}
else if (__VLS_ctx.filteredStatements.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "py-6 text-center" },
    });
    const __VLS_64 = {}.FileX;
    /** @type {[typeof __VLS_components.FileX, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        ...{ class: "w-12 h-12 mx-auto text-gray-400" },
    }));
    const __VLS_66 = __VLS_65({
        ...{ class: "w-12 h-12 mx-auto text-gray-400" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-2 text-gray-500" },
    });
    (__VLS_ctx.selectedPeriod ? `Nenhum extrato encontrado para o período ${__VLS_ctx.selectedPeriod}.` : 'Nenhum extrato disponível.');
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" },
    });
    const __VLS_68 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ class: "p-4" },
    }));
    const __VLS_74 = __VLS_73({
        ...{ class: "p-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ class: "text-sm" },
    }));
    const __VLS_78 = __VLS_77({
        ...{ class: "text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    var __VLS_79;
    var __VLS_75;
    const __VLS_80 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ class: "p-4 pt-0" },
    }));
    const __VLS_82 = __VLS_81({
        ...{ class: "p-4 pt-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-bold" },
    });
    (__VLS_ctx.filteredStatements.length);
    var __VLS_83;
    var __VLS_71;
    const __VLS_84 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
    const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ class: "p-4" },
    }));
    const __VLS_90 = __VLS_89({
        ...{ class: "p-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    const __VLS_92 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ class: "text-sm" },
    }));
    const __VLS_94 = __VLS_93({
        ...{ class: "text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    var __VLS_95;
    var __VLS_91;
    const __VLS_96 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ class: "p-4 pt-0" },
    }));
    const __VLS_98 = __VLS_97({
        ...{ class: "p-4 pt-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-bold text-emerald-600" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.totalAmount));
    var __VLS_99;
    var __VLS_87;
    const __VLS_100 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
    const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ class: "p-4" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ class: "p-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ class: "text-sm" },
    }));
    const __VLS_110 = __VLS_109({
        ...{ class: "text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    var __VLS_111;
    var __VLS_107;
    const __VLS_112 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ class: "p-4 pt-0" },
    }));
    const __VLS_114 = __VLS_113({
        ...{ class: "p-4 pt-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-bold" },
    });
    (__VLS_ctx.uniquePeriods.length);
    var __VLS_115;
    var __VLS_103;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "overflow-x-auto" },
    });
    const __VLS_116 = {}.Table;
    /** @type {[typeof __VLS_components.Table, typeof __VLS_components.Table, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
    const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.TableHeader;
    /** @type {[typeof __VLS_components.TableHeader, typeof __VLS_components.TableHeader, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
    const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    const __VLS_124 = {}.TableRow;
    /** @type {[typeof __VLS_components.TableRow, typeof __VLS_components.TableRow, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
    const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.TableHead;
    /** @type {[typeof __VLS_components.TableHead, typeof __VLS_components.TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
    const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    var __VLS_131;
    const __VLS_132 = {}.TableHead;
    /** @type {[typeof __VLS_components.TableHead, typeof __VLS_components.TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    var __VLS_135;
    const __VLS_136 = {}.TableHead;
    /** @type {[typeof __VLS_components.TableHead, typeof __VLS_components.TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        ...{ class: "hidden md:table-cell" },
    }));
    const __VLS_138 = __VLS_137({
        ...{ class: "hidden md:table-cell" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    var __VLS_139;
    const __VLS_140 = {}.TableHead;
    /** @type {[typeof __VLS_components.TableHead, typeof __VLS_components.TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
    const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    var __VLS_143;
    const __VLS_144 = {}.TableHead;
    /** @type {[typeof __VLS_components.TableHead, typeof __VLS_components.TableHead, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        ...{ class: "hidden md:table-cell" },
    }));
    const __VLS_146 = __VLS_145({
        ...{ class: "hidden md:table-cell" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    var __VLS_147;
    var __VLS_127;
    var __VLS_123;
    const __VLS_148 = {}.TableBody;
    /** @type {[typeof __VLS_components.TableBody, typeof __VLS_components.TableBody, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
    const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    for (const [statement] of __VLS_getVForSourceType((__VLS_ctx.filteredStatements))) {
        const __VLS_152 = {}.TableRow;
        /** @type {[typeof __VLS_components.TableRow, typeof __VLS_components.TableRow, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            key: (statement.id),
        }));
        const __VLS_154 = __VLS_153({
            key: (statement.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        __VLS_155.slots.default;
        const __VLS_156 = {}.TableCell;
        /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            ...{ class: "font-medium" },
        }));
        const __VLS_158 = __VLS_157({
            ...{ class: "font-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        __VLS_159.slots.default;
        (statement.period);
        var __VLS_159;
        const __VLS_160 = {}.TableCell;
        /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            ...{ class: (statement.amount >= 0 ? 'text-emerald-600' : 'text-rose-600') },
            ...{ class: "font-medium" },
        }));
        const __VLS_162 = __VLS_161({
            ...{ class: (statement.amount >= 0 ? 'text-emerald-600' : 'text-rose-600') },
            ...{ class: "font-medium" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        __VLS_163.slots.default;
        (__VLS_ctx.formatCurrency(statement.amount));
        var __VLS_163;
        const __VLS_164 = {}.TableCell;
        /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            ...{ class: "hidden md:table-cell" },
        }));
        const __VLS_166 = __VLS_165({
            ...{ class: "hidden md:table-cell" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        __VLS_167.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "truncate max-w-[200px]" },
            title: (statement.description),
        });
        (statement.description);
        var __VLS_167;
        const __VLS_168 = {}.TableCell;
        /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({}));
        const __VLS_170 = __VLS_169({}, ...__VLS_functionalComponentArgsRest(__VLS_169));
        __VLS_171.slots.default;
        (statement.legend);
        var __VLS_171;
        const __VLS_172 = {}.TableCell;
        /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            ...{ class: "hidden md:table-cell" },
        }));
        const __VLS_174 = __VLS_173({
            ...{ class: "hidden md:table-cell" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        __VLS_175.slots.default;
        (__VLS_ctx.formatDate(statement.createdAt));
        var __VLS_175;
        var __VLS_155;
    }
    var __VLS_151;
    var __VLS_119;
}
var __VLS_19;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-64']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-emerald-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-600']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:table-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:table-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:table-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[200px]']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:table-cell']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=PublicBankStatements.vue.js.map