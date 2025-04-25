<template>
  <div class="container py-8 mx-auto">
    <div v-if="isAdmin === false" class="flex flex-col items-center justify-center min-h-[50vh]">
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Acesso Restrito</h2>
        <p class="text-gray-600">Esta página é exclusiva para administradores.</p>
        <Button @click="$router.push('/')" class="mt-4">Voltar para o início</Button>
      </div>
    </div>

    <div v-else-if="isAdmin === true" class="flex flex-col space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Gerenciamento de Extratos Bancários</h1>
        <Button @click="openAddStatementModal" class="ml-4">
          <Plus class="w-4 h-4 mr-2" />
          Novo Extrato
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Card de Meta -->
        <Card class="bg-white shadow">
          <CardHeader>
            <CardTitle>Meta Atual</CardTitle>
            <CardDescription>Acompanhe o progresso da meta financeira</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Meta:</span>
                <div class="flex items-center">
                  <span>R$ {{ formatCurrency(goalStatus.goalAmount) }}</span>
                  <Button variant="ghost" size="icon" @click="openEditGoalModal">
                    <Edit class="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Arrecadado:</span>
                <span class="text-emerald-600 font-medium">R$ {{ formatCurrency(goalStatus.currentAmount) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Falta:</span>
                <span class="text-rose-600 font-medium">R$ {{ formatCurrency(goalStatus.goalAmount - goalStatus.currentAmount) }}</span>
              </div>
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">Progresso: {{ goalStatus.percentage.toFixed(2) }}%</span>
                </div>
                <Progress :value="goalStatus.percentage" class="h-2" />
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Última atualização: {{ formatDate(goalStatus.lastUpdate) }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Card de Filtros -->
        <Card class="bg-white shadow">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refine os resultados por período ou descrição</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="period">Período</Label>
                <Select v-model="filters.period">
                  <option value="">Todos os períodos</option>
                  <option v-for="period in uniquePeriods" :key="period" :value="period">
                    {{ period }}
                  </option>
                </Select>
              </div>

              <div class="space-y-2">
                <Label for="search">Buscar por descrição ou legenda</Label>
                <Input
                  id="search"
                  v-model="filters.search"
                  placeholder="Digite para buscar..."
                  class="w-full"
                />
              </div>

              <div class="flex justify-end">
                <Button @click="resetFilters" variant="outline" class="mr-2">Limpar</Button>
                <Button @click="applyFilters">Filtrar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Tabela de Extratos -->
      <div class="w-full overflow-auto">
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span class="ml-2">Carregando extratos...</span>
        </div>

        <div v-else-if="filteredStatements.length === 0" class="py-8 text-center">
          <FileX class="w-12 h-12 mx-auto text-gray-400" />
          <p class="mt-2 text-gray-500">Nenhum extrato encontrado.</p>
          <Button @click="openAddStatementModal" variant="outline" class="mt-4">
            Adicionar Extrato
          </Button>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Legenda</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead class="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="statement in filteredStatements" :key="statement.id">
              <TableCell class="font-medium">{{ statement.period }}</TableCell>
              <TableCell
                :class="statement.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'"
                class="font-medium"
              >
                {{ formatCurrency(statement.amount) }}
              </TableCell>
              <TableCell>{{ statement.description }}</TableCell>
              <TableCell>{{ statement.legend }}</TableCell>
              <TableCell>{{ formatDate(statement.createdAt) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end space-x-2">
                  <Button
                    v-if="statement.attachmentUrl"
                    variant="ghost"
                    size="icon"
                    @click="viewAttachment(statement.attachmentUrl)"
                  >
                    <FileText class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="editStatement(statement)"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-rose-500"
                    @click="confirmDeleteStatement(statement)"
                  >
                    <Trash class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <div v-else class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      <span class="ml-3">Verificando permissões...</span>
    </div>

    <!-- Modal para adicionar/editar extrato -->
    <Dialog v-model:open="statementModalOpen">
      <DialogContent class="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Editar Extrato Bancário' : 'Adicionar Extrato Bancário' }}</DialogTitle>
          <DialogDescription>
            {{ isEditing ? 'Altere os detalhes do extrato bancário' : 'Preencha os detalhes do novo extrato bancário' }}
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveStatement" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="period">Período</Label>
              <Input
                id="period"
                v-model="formData.period"
                placeholder="MM/YYYY ou período"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="amount">Valor (R$)</Label>
              <Input
                id="amount"
                v-model="formData.amount"
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">Descrição</Label>
            <Input
              id="description"
              v-model="formData.description"
              placeholder="Descrição do extrato"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="legend">Legenda</Label>
            <Input
              id="legend"
              v-model="formData.legend"
              placeholder="Legenda ou categoria"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="attachment">Anexo (opcional)</Label>
            <Input
              id="attachment"
              type="file"
              @change="handleFileChange"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p v-if="formData.attachmentUrl" class="text-xs text-gray-500 mt-1 flex items-center">
              <FileText class="h-3 w-3 mr-1" />
              Arquivo atual: {{ getFileName(formData.attachmentUrl) }}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="statementModalOpen = false">Cancelar</Button>
            <Button type="submit" :disabled="isSaving">
              <Loader v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
              {{ isEditing ? 'Atualizar' : 'Adicionar' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Modal para editar meta -->
    <Dialog v-model:open="goalModalOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar Meta</DialogTitle>
          <DialogDescription>Defina o valor alvo da arrecadação</DialogDescription>
        </DialogHeader>
        <form @submit.prevent="updateGoal" class="space-y-4">
          <div class="space-y-2">
            <Label for="goalAmount">Valor da Meta (R$)</Label>
            <Input
              id="goalAmount"
              v-model="goalForm.amount"
              type="number"
              step="0.01"
              min="1"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="goalModalOpen = false">Cancelar</Button>
            <Button type="submit" :disabled="isUpdatingGoal">
              <Loader v-if="isUpdatingGoal" class="mr-2 h-4 w-4 animate-spin" />
              Atualizar Meta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Modal de confirmação de exclusão -->
    <Dialog v-model:open="confirmDeleteOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
        </DialogHeader>
        <div class="py-3">
          <p>Tem certeza que deseja excluir este extrato bancário?</p>
          <p class="text-sm text-gray-500 mt-1">
            Período: <span class="font-medium">{{ statementToDelete?.period }}</span><br>
            Valor: <span class="font-medium">R$ {{ statementToDelete?.amount ? formatCurrency(statementToDelete.amount) : '0,00' }}</span>
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="confirmDeleteOpen = false">Cancelar</Button>
          <Button
            type="button"
            variant="destructive"
            @click="deleteStatement"
            :disabled="isDeleting"
          >
            <Loader v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Button,
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
  Input, Label, Progress, Select,
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui';
import { Plus, FileText, Edit, Trash, Loader, FileX } from 'lucide-vue-next';
import bankStatementService from '@/services/bankStatementService';
import { useAuthStore } from '@/stores/auth';
import { BankStatement, GoalStatus } from '@/types/BankStatement';
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
    const statements = ref<BankStatement[]>([]);
    const loading = ref(true);
    const statementModalOpen = ref(false);
    const goalModalOpen = ref(false);
    const confirmDeleteOpen = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);
    const isDeleting = ref(false);
    const isUpdatingGoal = ref(false);
    const statementToDelete = ref<BankStatement | null>(null);
    const selectedFile = ref<File | null>(null);
    const isAdmin = ref<boolean | null>(null);

    const formData = ref<{
      id?: string;
      period: string;
      amount: number | string;
      description: string;
      legend: string;
      attachmentUrl?: string;
    }>({
      period: '',
      amount: '',
      description: '',
      legend: ''
    });

    const goalStatus = ref<GoalStatus>({
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
        isAdmin.value = authStore.user?.role === 'admin';

        if (isAdmin.value) {
          await loadData();
        }
      } catch (error) {
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

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Falha ao carregar extratos bancários.');
      } finally {
        loading.value = false;
      }
    };

    // Períodos únicos para filtro
    const uniquePeriods = computed(() => {
      const periods = new Set<string>();
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

    const editStatement = (statement: BankStatement) => {
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
          await bankStatementService.updateStatement(
            formData.value.id,
            statementData,
            selectedFile.value || undefined
          );
          toast.success('Extrato atualizado com sucesso!');
        } else {
          // Adicionar novo extrato
          await bankStatementService.addStatement(
            statementData,
            selectedFile.value || undefined
          );
          toast.success('Extrato adicionado com sucesso!');
        }

        await loadData();
        statementModalOpen.value = false;
      } catch (error) {
        console.error('Erro ao salvar extrato:', error);
        toast.error('Falha ao salvar o extrato. Por favor, tente novamente.');
      } finally {
        isSaving.value = false;
      }
    };

    const confirmDeleteStatement = (statement: BankStatement) => {
      statementToDelete.value = statement;
      confirmDeleteOpen.value = true;
    };

    const deleteStatement = async () => {
      if (!statementToDelete.value?.id) return;

      isDeleting.value = true;
      try {
        await bankStatementService.deleteStatement(statementToDelete.value.id);
        toast.success('Extrato excluído com sucesso!');
        await loadData();
        confirmDeleteOpen.value = false;
      } catch (error) {
        console.error('Erro ao excluir extrato:', error);
        toast.error('Falha ao excluir o extrato. Por favor, tente novamente.');
      } finally {
        isDeleting.value = false;
      }
    };

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
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
      } catch (error) {
        console.error('Erro ao atualizar meta:', error);
        toast.error('Falha ao atualizar a meta. Por favor, tente novamente.');
      } finally {
        isUpdatingGoal.value = false;
      }
    };

    const viewAttachment = (url: string) => {
      window.open(url, '_blank');
    };

    const getFileName = (url: string): string => {
      const parts = url.split('/');
      return parts[parts.length - 1].split('?')[0];
    };

    const formatCurrency = (value: number): string => {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (date: Date | string): string => {
      if (!date) return '';
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
</script>

