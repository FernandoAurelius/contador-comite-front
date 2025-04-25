import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, FileText, Edit, Trash, Loader, FileX } from 'lucide-vue-next';
import bankStatementService from '@/services/bankStatementService';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
export default defineComponent({
    name: 'AdminBankStatementsView',
    components: {
        Button,
        Card, CardHeader, CardTitle, CardDescription, CardContent,
        Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
        Input, Label, Progress, Select,
        Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
        Plus, FileText, Edit, Trash, Loader, FileX
    },
    setup() {
        const router = useRouter();
        const authStore = useAuthStore();
        const statements = ref([]);
        const loading = ref(true);
        const statementModalOpen = ref(false);
        const goalModalOpen = ref(false);
        const confirmDeleteOpen = ref(false);
        const isEditing = ref(false);
        const isSaving = ref(false);
        const isDeleting = ref(false);
        const isUpdatingGoal = ref(false);
        const statementToDelete = ref(null);
        const selectedFile = ref(null);
        const isAdmin = ref(null);
        const formData = ref({
            period: '',
            amount: '',
            description: '',
            legend: ''
        });
        const goalStatus = ref({
            currentAmount: 0,
            goalAmount: 100000,
            percentage: 0,
            lastUpdate: new Date()
        });
        const goalForm = ref({
            amount: 0
        });
        const filters = ref({
            period: '',
            search: '',
            applied: false
        });
        // Verificar se o usuário é admin usando o sistema de autenticação existente
        onMounted(async () => {
            try {
                console.log('Verificando permissões de administrador...');
                console.log('Dados do usuário:', authStore.user);
                isAdmin.value = authStore.user?.role === 'admin';
                console.log('Usuário é admin?', isAdmin.value);
                if (isAdmin.value) {
                    console.log('Permissão concedida: carregando dados administrativos...');
                    await loadData();
                }
                else {
                    console.warn('Acesso negado: usuário não tem permissão de administrador.');
                    console.log('Role do usuário:', authStore.user?.role);
                    toast.error('Você não tem permissão para acessar esta página.');
                }
            }
            catch (error) {
                console.error('Erro ao verificar permissões ou carregar dados:', error);
                toast.error('Ocorreu um erro ao carregar os dados.');
            }
        });
        const loadData = async () => {
            loading.value = true;
            try {
                // Carregar extratos
                statements.value = await bankStatementService.getStatements();
                // Carregar status da meta
                goalStatus.value = await bankStatementService.getGoalStatus();
                goalForm.value.amount = goalStatus.value.goalAmount;
            }
            catch (error) {
                console.error('Erro ao carregar dados:', error);
                toast.error('Falha ao carregar extratos bancários.');
            }
            finally {
                loading.value = false;
            }
        };
        // Períodos únicos para filtro
        const uniquePeriods = computed(() => {
            const periods = new Set();
            statements.value.forEach(statement => {
                periods.add(statement.period);
            });
            return Array.from(periods).sort();
        });
        // Extratos filtrados
        const filteredStatements = computed(() => {
            if (!filters.value.applied) {
                return statements.value;
            }
            return statements.value.filter(statement => {
                const periodMatch = !filters.value.period || statement.period === filters.value.period;
                const searchTerm = filters.value.search.toLowerCase();
                const searchMatch = !searchTerm ||
                    statement.description.toLowerCase().includes(searchTerm) ||
                    statement.legend.toLowerCase().includes(searchTerm);
                return periodMatch && searchMatch;
            });
        });
        const applyFilters = () => {
            filters.value.applied = true;
        };
        const resetFilters = () => {
            filters.value = {
                period: '',
                search: '',
                applied: false
            };
        };
        const openAddStatementModal = () => {
            isEditing.value = false;
            formData.value = {
                period: '',
                amount: '',
                description: '',
                legend: ''
            };
            selectedFile.value = null;
            statementModalOpen.value = true;
        };
        const editStatement = (statement) => {
            isEditing.value = true;
            formData.value = {
                id: statement.id,
                period: statement.period,
                amount: statement.amount,
                description: statement.description,
                legend: statement.legend,
                attachmentUrl: statement.attachmentUrl
            };
            selectedFile.value = null;
            statementModalOpen.value = true;
        };
        const saveStatement = async () => {
            isSaving.value = true;
            try {
                if (!formData.value.period || !formData.value.amount || !formData.value.description || !formData.value.legend) {
                    toast.error('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }
                const statementData = {
                    period: formData.value.period,
                    amount: Number(formData.value.amount),
                    description: formData.value.description,
                    legend: formData.value.legend,
                };
                if (isEditing.value && formData.value.id) {
                    // Atualizar extrato existente
                    await bankStatementService.updateStatement(formData.value.id, statementData, selectedFile.value || undefined);
                    toast.success('Extrato atualizado com sucesso!');
                }
                else {
                    // Adicionar novo extrato
                    await bankStatementService.addStatement(statementData, selectedFile.value || undefined);
                    toast.success('Extrato adicionado com sucesso!');
                }
                await loadData();
                statementModalOpen.value = false;
            }
            catch (error) {
                console.error('Erro ao salvar extrato:', error);
                toast.error('Falha ao salvar o extrato. Por favor, tente novamente.');
            }
            finally {
                isSaving.value = false;
            }
        };
        const confirmDeleteStatement = (statement) => {
            statementToDelete.value = statement;
            confirmDeleteOpen.value = true;
        };
        const deleteStatement = async () => {
            if (!statementToDelete.value?.id)
                return;
            isDeleting.value = true;
            try {
                await bankStatementService.deleteStatement(statementToDelete.value.id);
                toast.success('Extrato excluído com sucesso!');
                await loadData();
                confirmDeleteOpen.value = false;
            }
            catch (error) {
                console.error('Erro ao excluir extrato:', error);
                toast.error('Falha ao excluir o extrato. Por favor, tente novamente.');
            }
            finally {
                isDeleting.value = false;
            }
        };
        const handleFileChange = (event) => {
            const target = event.target;
            if (target.files && target.files.length > 0) {
                selectedFile.value = target.files[0];
            }
        };
        const openEditGoalModal = () => {
            goalForm.value.amount = goalStatus.value.goalAmount;
            goalModalOpen.value = true;
        };
        const updateGoal = async () => {
            if (!goalForm.value.amount || goalForm.value.amount <= 0) {
                toast.error('Por favor, insira um valor válido para a meta.');
                return;
            }
            isUpdatingGoal.value = true;
            try {
                await bankStatementService.updateGoalAmount(Number(goalForm.value.amount));
                toast.success('Meta atualizada com sucesso!');
                await loadData();
                goalModalOpen.value = false;
            }
            catch (error) {
                console.error('Erro ao atualizar meta:', error);
                toast.error('Falha ao atualizar a meta. Por favor, tente novamente.');
            }
            finally {
                isUpdatingGoal.value = false;
            }
        };
        const viewAttachment = (url) => {
            window.open(url, '_blank');
        };
        const getFileName = (url) => {
            const parts = url.split('/');
            return parts[parts.length - 1].split('?')[0];
        };
        const formatCurrency = (value) => {
            return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };
        const formatDate = (date) => {
            if (!date)
                return '';
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
        };
        return {
            statements,
            loading,
            statementModalOpen,
            goalModalOpen,
            confirmDeleteOpen,
            isEditing,
            isSaving,
            isDeleting,
            isUpdatingGoal,
            formData,
            selectedFile,
            statementToDelete,
            goalStatus,
            goalForm,
            filters,
            uniquePeriods,
            filteredStatements,
            isAdmin,
            applyFilters,
            resetFilters,
            openAddStatementModal,
            editStatement,
            saveStatement,
            confirmDeleteStatement,
            deleteStatement,
            handleFileChange,
            openEditGoalModal,
            updateGoal,
            viewAttachment,
            getFileName,
            formatCurrency,
            formatDate
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Button,
    Card, CardHeader, CardTitle, CardDescription, CardContent,
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
    Input, Label, Progress, Select,
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
    Plus, FileText, Edit, Trash, Loader, FileX
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container py-8 mx-auto" },
});
if (__VLS_ctx.isAdmin === false) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col items-center justify-center min-h-[50vh]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-2xl font-semibold text-gray-800 mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-gray-600" },
    });
    const __VLS_0 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        ...{ class: "mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isAdmin === false))
                return;
            __VLS_ctx.$router.push('/');
        }
    };
    __VLS_3.slots.default;
    var __VLS_3;
}
else if (__VLS_ctx.isAdmin === true) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col space-y-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "text-2xl font-bold" },
    });
    const __VLS_8 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        ...{ class: "ml-4" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        ...{ class: "ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.openAddStatementModal)
    };
    __VLS_11.slots.default;
    const __VLS_16 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ class: "w-4 h-4 mr-2" },
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "w-4 h-4 mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
    });
    const __VLS_20 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "bg-white shadow" },
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "bg-white shadow" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_32 = {}.CardDescription;
    /** @type {[typeof __VLS_components.CardDescription, typeof __VLS_components.CardDescription, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
    const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    var __VLS_35;
    var __VLS_27;
    const __VLS_36 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatCurrency(__VLS_ctx.goalStatus.goalAmount));
    const __VLS_40 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onClick: (__VLS_ctx.openEditGoalModal)
    };
    __VLS_43.slots.default;
    const __VLS_48 = {}.Edit;
    /** @type {[typeof __VLS_components.Edit, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ class: "h-4 w-4 text-gray-500" },
    }));
    const __VLS_50 = __VLS_49({
        ...{ class: "h-4 w-4 text-gray-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    var __VLS_43;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-emerald-600 font-medium" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.goalStatus.currentAmount));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-rose-600 font-medium" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.goalStatus.goalAmount - __VLS_ctx.goalStatus.currentAmount));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm font-medium" },
    });
    (__VLS_ctx.goalStatus.percentage.toFixed(2));
    const __VLS_52 = {}.Progress;
    /** @type {[typeof __VLS_components.Progress, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        value: (__VLS_ctx.goalStatus.percentage),
        ...{ class: "h-2" },
    }));
    const __VLS_54 = __VLS_53({
        value: (__VLS_ctx.goalStatus.percentage),
        ...{ class: "h-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-2" },
    });
    (__VLS_ctx.formatDate(__VLS_ctx.goalStatus.lastUpdate));
    var __VLS_39;
    var __VLS_23;
    const __VLS_56 = {}.Card;
    /** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ class: "bg-white shadow" },
    }));
    const __VLS_58 = __VLS_57({
        ...{ class: "bg-white shadow" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.CardHeader;
    /** @type {[typeof __VLS_components.CardHeader, typeof __VLS_components.CardHeader, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
    const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.CardTitle;
    /** @type {[typeof __VLS_components.CardTitle, typeof __VLS_components.CardTitle, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    var __VLS_67;
    const __VLS_68 = {}.CardDescription;
    /** @type {[typeof __VLS_components.CardDescription, typeof __VLS_components.CardDescription, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    var __VLS_71;
    var __VLS_63;
    const __VLS_72 = {}.CardContent;
    /** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
    const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2" },
    });
    const __VLS_76 = {}.Label;
    /** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        for: "period",
    }));
    const __VLS_78 = __VLS_77({
        for: "period",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    var __VLS_79;
    const __VLS_80 = {}.Select;
    /** @type {[typeof __VLS_components.Select, typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.filters.period),
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.filters.period),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
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
    var __VLS_83;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-2" },
    });
    const __VLS_84 = {}.Label;
    /** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        for: "search",
    }));
    const __VLS_86 = __VLS_85({
        for: "search",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    var __VLS_87;
    const __VLS_88 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        id: "search",
        modelValue: (__VLS_ctx.filters.search),
        placeholder: "Digite para buscar...",
        ...{ class: "w-full" },
    }));
    const __VLS_90 = __VLS_89({
        id: "search",
        modelValue: (__VLS_ctx.filters.search),
        placeholder: "Digite para buscar...",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-end" },
    });
    const __VLS_92 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: "mr-2" },
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: "mr-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (__VLS_ctx.resetFilters)
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (__VLS_ctx.applyFilters)
    };
    __VLS_103.slots.default;
    var __VLS_103;
    var __VLS_75;
    var __VLS_59;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-full overflow-auto" },
    });
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
            ...{ class: "py-8 text-center" },
        });
        const __VLS_108 = {}.FileX;
        /** @type {[typeof __VLS_components.FileX, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            ...{ class: "w-12 h-12 mx-auto text-gray-400" },
        }));
        const __VLS_110 = __VLS_109({
            ...{ class: "w-12 h-12 mx-auto text-gray-400" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-2 text-gray-500" },
        });
        const __VLS_112 = {}.Button;
        /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            ...{ 'onClick': {} },
            variant: "outline",
            ...{ class: "mt-4" },
        }));
        const __VLS_114 = __VLS_113({
            ...{ 'onClick': {} },
            variant: "outline",
            ...{ class: "mt-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        let __VLS_116;
        let __VLS_117;
        let __VLS_118;
        const __VLS_119 = {
            onClick: (__VLS_ctx.openAddStatementModal)
        };
        __VLS_115.slots.default;
        var __VLS_115;
    }
    else {
        const __VLS_120 = {}.Table;
        /** @type {[typeof __VLS_components.Table, typeof __VLS_components.Table, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
        const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        const __VLS_124 = {}.TableHeader;
        /** @type {[typeof __VLS_components.TableHeader, typeof __VLS_components.TableHeader, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
        const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_127.slots.default;
        const __VLS_128 = {}.TableRow;
        /** @type {[typeof __VLS_components.TableRow, typeof __VLS_components.TableRow, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
        const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_131.slots.default;
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
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({}));
        const __VLS_138 = __VLS_137({}, ...__VLS_functionalComponentArgsRest(__VLS_137));
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
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
        const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
        __VLS_147.slots.default;
        var __VLS_147;
        const __VLS_148 = {}.TableHead;
        /** @type {[typeof __VLS_components.TableHead, typeof __VLS_components.TableHead, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
        const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
        __VLS_151.slots.default;
        var __VLS_151;
        const __VLS_152 = {}.TableHead;
        /** @type {[typeof __VLS_components.TableHead, typeof __VLS_components.TableHead, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            ...{ class: "text-right" },
        }));
        const __VLS_154 = __VLS_153({
            ...{ class: "text-right" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        __VLS_155.slots.default;
        var __VLS_155;
        var __VLS_131;
        var __VLS_127;
        const __VLS_156 = {}.TableBody;
        /** @type {[typeof __VLS_components.TableBody, typeof __VLS_components.TableBody, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
        const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
        __VLS_159.slots.default;
        for (const [statement] of __VLS_getVForSourceType((__VLS_ctx.filteredStatements))) {
            const __VLS_160 = {}.TableRow;
            /** @type {[typeof __VLS_components.TableRow, typeof __VLS_components.TableRow, ]} */ ;
            // @ts-ignore
            const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
                key: (statement.id),
            }));
            const __VLS_162 = __VLS_161({
                key: (statement.id),
            }, ...__VLS_functionalComponentArgsRest(__VLS_161));
            __VLS_163.slots.default;
            const __VLS_164 = {}.TableCell;
            /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
                ...{ class: "font-medium" },
            }));
            const __VLS_166 = __VLS_165({
                ...{ class: "font-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_165));
            __VLS_167.slots.default;
            (statement.period);
            var __VLS_167;
            const __VLS_168 = {}.TableCell;
            /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
                ...{ class: (statement.amount >= 0 ? 'text-emerald-600' : 'text-rose-600') },
                ...{ class: "font-medium" },
            }));
            const __VLS_170 = __VLS_169({
                ...{ class: (statement.amount >= 0 ? 'text-emerald-600' : 'text-rose-600') },
                ...{ class: "font-medium" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_169));
            __VLS_171.slots.default;
            (__VLS_ctx.formatCurrency(statement.amount));
            var __VLS_171;
            const __VLS_172 = {}.TableCell;
            /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
            const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
            __VLS_175.slots.default;
            (statement.description);
            var __VLS_175;
            const __VLS_176 = {}.TableCell;
            /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
            const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
            __VLS_179.slots.default;
            (statement.legend);
            var __VLS_179;
            const __VLS_180 = {}.TableCell;
            /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({}));
            const __VLS_182 = __VLS_181({}, ...__VLS_functionalComponentArgsRest(__VLS_181));
            __VLS_183.slots.default;
            (__VLS_ctx.formatDate(statement.createdAt));
            var __VLS_183;
            const __VLS_184 = {}.TableCell;
            /** @type {[typeof __VLS_components.TableCell, typeof __VLS_components.TableCell, ]} */ ;
            // @ts-ignore
            const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
                ...{ class: "text-right" },
            }));
            const __VLS_186 = __VLS_185({
                ...{ class: "text-right" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_185));
            __VLS_187.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex justify-end space-x-2" },
            });
            if (statement.attachmentUrl) {
                const __VLS_188 = {}.Button;
                /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
                // @ts-ignore
                const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                    ...{ 'onClick': {} },
                    variant: "ghost",
                    size: "icon",
                }));
                const __VLS_190 = __VLS_189({
                    ...{ 'onClick': {} },
                    variant: "ghost",
                    size: "icon",
                }, ...__VLS_functionalComponentArgsRest(__VLS_189));
                let __VLS_192;
                let __VLS_193;
                let __VLS_194;
                const __VLS_195 = {
                    onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.isAdmin === false))
                            return;
                        if (!(__VLS_ctx.isAdmin === true))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.filteredStatements.length === 0))
                            return;
                        if (!(statement.attachmentUrl))
                            return;
                        __VLS_ctx.viewAttachment(statement.attachmentUrl);
                    }
                };
                __VLS_191.slots.default;
                const __VLS_196 = {}.FileText;
                /** @type {[typeof __VLS_components.FileText, ]} */ ;
                // @ts-ignore
                const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
                    ...{ class: "h-4 w-4" },
                }));
                const __VLS_198 = __VLS_197({
                    ...{ class: "h-4 w-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_197));
                var __VLS_191;
            }
            const __VLS_200 = {}.Button;
            /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
            // @ts-ignore
            const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
                ...{ 'onClick': {} },
                variant: "ghost",
                size: "icon",
            }));
            const __VLS_202 = __VLS_201({
                ...{ 'onClick': {} },
                variant: "ghost",
                size: "icon",
            }, ...__VLS_functionalComponentArgsRest(__VLS_201));
            let __VLS_204;
            let __VLS_205;
            let __VLS_206;
            const __VLS_207 = {
                onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isAdmin === false))
                        return;
                    if (!(__VLS_ctx.isAdmin === true))
                        return;
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.filteredStatements.length === 0))
                        return;
                    __VLS_ctx.editStatement(statement);
                }
            };
            __VLS_203.slots.default;
            const __VLS_208 = {}.Edit;
            /** @type {[typeof __VLS_components.Edit, ]} */ ;
            // @ts-ignore
            const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
                ...{ class: "h-4 w-4" },
            }));
            const __VLS_210 = __VLS_209({
                ...{ class: "h-4 w-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_209));
            var __VLS_203;
            const __VLS_212 = {}.Button;
            /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
            // @ts-ignore
            const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
                ...{ 'onClick': {} },
                variant: "ghost",
                size: "icon",
                ...{ class: "text-rose-500" },
            }));
            const __VLS_214 = __VLS_213({
                ...{ 'onClick': {} },
                variant: "ghost",
                size: "icon",
                ...{ class: "text-rose-500" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_213));
            let __VLS_216;
            let __VLS_217;
            let __VLS_218;
            const __VLS_219 = {
                onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.isAdmin === false))
                        return;
                    if (!(__VLS_ctx.isAdmin === true))
                        return;
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.filteredStatements.length === 0))
                        return;
                    __VLS_ctx.confirmDeleteStatement(statement);
                }
            };
            __VLS_215.slots.default;
            const __VLS_220 = {}.Trash;
            /** @type {[typeof __VLS_components.Trash, ]} */ ;
            // @ts-ignore
            const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                ...{ class: "h-4 w-4" },
            }));
            const __VLS_222 = __VLS_221({
                ...{ class: "h-4 w-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_221));
            var __VLS_215;
            var __VLS_187;
            var __VLS_163;
        }
        var __VLS_159;
        var __VLS_123;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center py-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-3" },
    });
}
const __VLS_224 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    open: (__VLS_ctx.statementModalOpen),
}));
const __VLS_226 = __VLS_225({
    open: (__VLS_ctx.statementModalOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    ...{ class: "sm:max-w-[550px]" },
}));
const __VLS_230 = __VLS_229({
    ...{ class: "sm:max-w-[550px]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({}));
const __VLS_234 = __VLS_233({}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({}));
const __VLS_238 = __VLS_237({}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
(__VLS_ctx.isEditing ? 'Editar Extrato Bancário' : 'Adicionar Extrato Bancário');
var __VLS_239;
const __VLS_240 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({}));
const __VLS_242 = __VLS_241({}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
(__VLS_ctx.isEditing ? 'Altere os detalhes do extrato bancário' : 'Preencha os detalhes do novo extrato bancário');
var __VLS_243;
var __VLS_235;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.saveStatement) },
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-2 gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-2" },
});
const __VLS_244 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    for: "period",
}));
const __VLS_246 = __VLS_245({
    for: "period",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
var __VLS_247;
const __VLS_248 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    id: "period",
    modelValue: (__VLS_ctx.formData.period),
    placeholder: "MM/YYYY ou período",
    required: true,
}));
const __VLS_250 = __VLS_249({
    id: "period",
    modelValue: (__VLS_ctx.formData.period),
    placeholder: "MM/YYYY ou período",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-2" },
});
const __VLS_252 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    for: "amount",
}));
const __VLS_254 = __VLS_253({
    for: "amount",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
var __VLS_255;
const __VLS_256 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    id: "amount",
    modelValue: (__VLS_ctx.formData.amount),
    type: "number",
    step: "0.01",
    required: true,
}));
const __VLS_258 = __VLS_257({
    id: "amount",
    modelValue: (__VLS_ctx.formData.amount),
    type: "number",
    step: "0.01",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-2" },
});
const __VLS_260 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    for: "description",
}));
const __VLS_262 = __VLS_261({
    for: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
var __VLS_263;
const __VLS_264 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    id: "description",
    modelValue: (__VLS_ctx.formData.description),
    placeholder: "Descrição do extrato",
    required: true,
}));
const __VLS_266 = __VLS_265({
    id: "description",
    modelValue: (__VLS_ctx.formData.description),
    placeholder: "Descrição do extrato",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-2" },
});
const __VLS_268 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    for: "legend",
}));
const __VLS_270 = __VLS_269({
    for: "legend",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
var __VLS_271;
const __VLS_272 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    id: "legend",
    modelValue: (__VLS_ctx.formData.legend),
    placeholder: "Legenda ou categoria",
    required: true,
}));
const __VLS_274 = __VLS_273({
    id: "legend",
    modelValue: (__VLS_ctx.formData.legend),
    placeholder: "Legenda ou categoria",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-2" },
});
const __VLS_276 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    for: "attachment",
}));
const __VLS_278 = __VLS_277({
    for: "attachment",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
__VLS_279.slots.default;
var __VLS_279;
const __VLS_280 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    ...{ 'onChange': {} },
    id: "attachment",
    type: "file",
    accept: ".pdf,.jpg,.jpeg,.png",
}));
const __VLS_282 = __VLS_281({
    ...{ 'onChange': {} },
    id: "attachment",
    type: "file",
    accept: ".pdf,.jpg,.jpeg,.png",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
let __VLS_284;
let __VLS_285;
let __VLS_286;
const __VLS_287 = {
    onChange: (__VLS_ctx.handleFileChange)
};
var __VLS_283;
if (__VLS_ctx.formData.attachmentUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-gray-500 mt-1 flex items-center" },
    });
    const __VLS_288 = {}.FileText;
    /** @type {[typeof __VLS_components.FileText, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        ...{ class: "h-3 w-3 mr-1" },
    }));
    const __VLS_290 = __VLS_289({
        ...{ class: "h-3 w-3 mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    (__VLS_ctx.getFileName(__VLS_ctx.formData.attachmentUrl));
}
const __VLS_292 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({}));
const __VLS_294 = __VLS_293({}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
const __VLS_296 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    ...{ 'onClick': {} },
    type: "button",
    variant: "outline",
}));
const __VLS_298 = __VLS_297({
    ...{ 'onClick': {} },
    type: "button",
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
let __VLS_300;
let __VLS_301;
let __VLS_302;
const __VLS_303 = {
    onClick: (...[$event]) => {
        __VLS_ctx.statementModalOpen = false;
    }
};
__VLS_299.slots.default;
var __VLS_299;
const __VLS_304 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    type: "submit",
    disabled: (__VLS_ctx.isSaving),
}));
const __VLS_306 = __VLS_305({
    type: "submit",
    disabled: (__VLS_ctx.isSaving),
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
if (__VLS_ctx.isSaving) {
    const __VLS_308 = {}.Loader;
    /** @type {[typeof __VLS_components.Loader, ]} */ ;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
        ...{ class: "mr-2 h-4 w-4 animate-spin" },
    }));
    const __VLS_310 = __VLS_309({
        ...{ class: "mr-2 h-4 w-4 animate-spin" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
}
(__VLS_ctx.isEditing ? 'Atualizar' : 'Adicionar');
var __VLS_307;
var __VLS_295;
var __VLS_231;
var __VLS_227;
const __VLS_312 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    open: (__VLS_ctx.goalModalOpen),
}));
const __VLS_314 = __VLS_313({
    open: (__VLS_ctx.goalModalOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
__VLS_315.slots.default;
const __VLS_316 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    ...{ class: "sm:max-w-[425px]" },
}));
const __VLS_318 = __VLS_317({
    ...{ class: "sm:max-w-[425px]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_319.slots.default;
const __VLS_320 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({}));
const __VLS_322 = __VLS_321({}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
const __VLS_324 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({}));
const __VLS_326 = __VLS_325({}, ...__VLS_functionalComponentArgsRest(__VLS_325));
__VLS_327.slots.default;
var __VLS_327;
const __VLS_328 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({}));
const __VLS_330 = __VLS_329({}, ...__VLS_functionalComponentArgsRest(__VLS_329));
__VLS_331.slots.default;
var __VLS_331;
var __VLS_323;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.updateGoal) },
    ...{ class: "space-y-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-2" },
});
const __VLS_332 = {}.Label;
/** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    for: "goalAmount",
}));
const __VLS_334 = __VLS_333({
    for: "goalAmount",
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
__VLS_335.slots.default;
var __VLS_335;
const __VLS_336 = {}.Input;
/** @type {[typeof __VLS_components.Input, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
    id: "goalAmount",
    modelValue: (__VLS_ctx.goalForm.amount),
    type: "number",
    step: "0.01",
    min: "1",
    required: true,
}));
const __VLS_338 = __VLS_337({
    id: "goalAmount",
    modelValue: (__VLS_ctx.goalForm.amount),
    type: "number",
    step: "0.01",
    min: "1",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
const __VLS_340 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({}));
const __VLS_342 = __VLS_341({}, ...__VLS_functionalComponentArgsRest(__VLS_341));
__VLS_343.slots.default;
const __VLS_344 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    ...{ 'onClick': {} },
    type: "button",
    variant: "outline",
}));
const __VLS_346 = __VLS_345({
    ...{ 'onClick': {} },
    type: "button",
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
let __VLS_348;
let __VLS_349;
let __VLS_350;
const __VLS_351 = {
    onClick: (...[$event]) => {
        __VLS_ctx.goalModalOpen = false;
    }
};
__VLS_347.slots.default;
var __VLS_347;
const __VLS_352 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    type: "submit",
    disabled: (__VLS_ctx.isUpdatingGoal),
}));
const __VLS_354 = __VLS_353({
    type: "submit",
    disabled: (__VLS_ctx.isUpdatingGoal),
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
__VLS_355.slots.default;
if (__VLS_ctx.isUpdatingGoal) {
    const __VLS_356 = {}.Loader;
    /** @type {[typeof __VLS_components.Loader, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
        ...{ class: "mr-2 h-4 w-4 animate-spin" },
    }));
    const __VLS_358 = __VLS_357({
        ...{ class: "mr-2 h-4 w-4 animate-spin" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
}
var __VLS_355;
var __VLS_343;
var __VLS_319;
var __VLS_315;
const __VLS_360 = {}.Dialog;
/** @type {[typeof __VLS_components.Dialog, typeof __VLS_components.Dialog, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
    open: (__VLS_ctx.confirmDeleteOpen),
}));
const __VLS_362 = __VLS_361({
    open: (__VLS_ctx.confirmDeleteOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
__VLS_363.slots.default;
const __VLS_364 = {}.DialogContent;
/** @type {[typeof __VLS_components.DialogContent, typeof __VLS_components.DialogContent, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    ...{ class: "sm:max-w-[425px]" },
}));
const __VLS_366 = __VLS_365({
    ...{ class: "sm:max-w-[425px]" },
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
const __VLS_368 = {}.DialogHeader;
/** @type {[typeof __VLS_components.DialogHeader, typeof __VLS_components.DialogHeader, ]} */ ;
// @ts-ignore
const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({}));
const __VLS_370 = __VLS_369({}, ...__VLS_functionalComponentArgsRest(__VLS_369));
__VLS_371.slots.default;
const __VLS_372 = {}.DialogTitle;
/** @type {[typeof __VLS_components.DialogTitle, typeof __VLS_components.DialogTitle, ]} */ ;
// @ts-ignore
const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({}));
const __VLS_374 = __VLS_373({}, ...__VLS_functionalComponentArgsRest(__VLS_373));
__VLS_375.slots.default;
var __VLS_375;
const __VLS_376 = {}.DialogDescription;
/** @type {[typeof __VLS_components.DialogDescription, typeof __VLS_components.DialogDescription, ]} */ ;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({}));
const __VLS_378 = __VLS_377({}, ...__VLS_functionalComponentArgsRest(__VLS_377));
__VLS_379.slots.default;
var __VLS_379;
var __VLS_371;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "py-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-gray-500 mt-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium" },
});
(__VLS_ctx.statementToDelete?.period);
__VLS_asFunctionalElement(__VLS_intrinsicElements.br, __VLS_intrinsicElements.br)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium" },
});
(__VLS_ctx.statementToDelete?.amount ? __VLS_ctx.formatCurrency(__VLS_ctx.statementToDelete.amount) : '0,00');
const __VLS_380 = {}.DialogFooter;
/** @type {[typeof __VLS_components.DialogFooter, typeof __VLS_components.DialogFooter, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({}));
const __VLS_382 = __VLS_381({}, ...__VLS_functionalComponentArgsRest(__VLS_381));
__VLS_383.slots.default;
const __VLS_384 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
    ...{ 'onClick': {} },
    type: "button",
    variant: "outline",
}));
const __VLS_386 = __VLS_385({
    ...{ 'onClick': {} },
    type: "button",
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_385));
let __VLS_388;
let __VLS_389;
let __VLS_390;
const __VLS_391 = {
    onClick: (...[$event]) => {
        __VLS_ctx.confirmDeleteOpen = false;
    }
};
__VLS_387.slots.default;
var __VLS_387;
const __VLS_392 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
    ...{ 'onClick': {} },
    type: "button",
    variant: "destructive",
    disabled: (__VLS_ctx.isDeleting),
}));
const __VLS_394 = __VLS_393({
    ...{ 'onClick': {} },
    type: "button",
    variant: "destructive",
    disabled: (__VLS_ctx.isDeleting),
}, ...__VLS_functionalComponentArgsRest(__VLS_393));
let __VLS_396;
let __VLS_397;
let __VLS_398;
const __VLS_399 = {
    onClick: (__VLS_ctx.deleteStatement)
};
__VLS_395.slots.default;
if (__VLS_ctx.isDeleting) {
    const __VLS_400 = {}.Loader;
    /** @type {[typeof __VLS_components.Loader, ]} */ ;
    // @ts-ignore
    const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
        ...{ class: "mr-2 h-4 w-4 animate-spin" },
    }));
    const __VLS_402 = __VLS_401({
        ...{ class: "mr-2 h-4 w-4 animate-spin" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_401));
}
var __VLS_395;
var __VLS_383;
var __VLS_367;
var __VLS_363;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[50vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-rose-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
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
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-rose-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-emerald-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:max-w-[550px]']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:max-w-[425px]']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:max-w-[425px]']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=AdminBankStatementsView.vue.js.map