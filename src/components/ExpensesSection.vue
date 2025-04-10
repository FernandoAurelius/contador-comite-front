<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Buscar despesas..."
          v-model="searchTerm"
          class="pl-10"
        />
      </div>

      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger asChild>
          <Button class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            <span>Nova Despesa</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Despesa</DialogTitle>
            <DialogDescription>Preencha os detalhes da despesa abaixo.</DialogDescription>
          </DialogHeader>

          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="expense-date">Data</Label>
              <div class="relative">
                <Popover v-model:open="isCalendarOpen">
                  <PopoverTrigger asChild>
                    <Button variant="outline" class="w-full justify-start text-left font-normal">
                      <Calendar class="mr-2 h-4 w-4" />
                      {{ newExpense.date
                        ? formatDate(new Date(newExpense.date), "dd 'de' MMMM 'de' yyyy")
                        : "Selecione uma data" }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      :selected="newExpense.date ? new Date(newExpense.date) : new Date()"
                      @update:model-value="onDateSelect"
                      :initial-focus="true"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div class="grid gap-2">
              <Label for="expense-description">Descrição</Label>
              <Input
                id="expense-description"
                v-model="newExpense.item"
                placeholder="Ex: Material para decoração"
              />
            </div>

            <div class="grid gap-2">
              <Label for="expense-quantity">Quantidade</Label>
              <Input
                id="expense-quantity"
                type="number"
                v-model="newExpense.quantity"
                placeholder="1"
                class="pl-4"
                min="1"
                step="1"
              />
            </div>

            <div class="grid gap-2">
              <Label for="expense-amount">Valor Unitário (R$)</Label>
              <div class="relative">
                <DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="expense-amount"
                  type="number"
                  v-model="newExpense.unitCost"
                  placeholder="0.00"
                  class="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div class="grid gap-2">
              <Label for="expense-notes">Observações (opcional)</Label>
              <Textarea
                id="expense-notes"
                v-model="newExpense.notes"
                placeholder="Detalhes adicionais sobre a despesa..."
                rows="3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" @click="isDialogOpen = false">
              Cancelar
            </Button>
            <Button
              @click="handleAddExpense"
              :disabled="!isFormValid || (isEditing && !hasChanges)"
            >
              {{ isEditing ? (hasChanges ? 'Atualizar' : 'Fechar') : 'Adicionar' }} Despesa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Exibição em Grid com FinancialItem -->
    <div v-if="filteredExpenses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FinancialItem
        v-for="expense in filteredExpenses"
        :key="expense.id"
        :item="expense"
        type="expense"
        @edit="handleEditExpense"
        @delete="handleDeleteExpense"
      />
    </div>

    <template v-else>
      <div class="text-center py-12 bg-gray-50 rounded-lg">
        <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">Nenhuma despesa encontrada</h3>
        <p class="text-gray-500 mb-4">
          {{ searchTerm
            ? "Nenhuma despesa corresponde à sua busca."
            : "Adicione sua primeira despesa para começar a controlar os gastos." }}
        </p>
        <Button v-if="searchTerm" variant="outline" @click="searchTerm = ''">
          Limpar busca
        </Button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
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
import Despesa from '@/types/Despesa';
import { useDespesaStore } from '@/stores/despesas';
import { mapActions } from 'pinia';
import { PropType } from 'vue';
import FinancialItem from '@/components/FinancialItem.vue';
import { toast } from 'vue-sonner';

export default {
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
      type: Array as PropType<Despesa[]>,
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
      selectedExpense: null as Despesa | null,
      initialExpense: null,  // Para armazenar o estado inicial do item em edição
      isEditing: false       // Flag para identificar se está editando ou criando
    };
  },
  computed: {
    filteredExpenses() {
      const searchLower = this.searchTerm.toLowerCase();
      return this.expenses.filter(
        expense =>
          (expense.item && expense.item.toLowerCase().includes(searchLower)) ||
          (expense.notes && expense.notes.toLowerCase().includes(searchLower))
      );
    },
    isFormValid() {
      return this.newExpense.item &&
             this.newExpense.date &&
             this.newExpense.quantity > 0 &&
             this.newExpense.unitCost > 0;
    },
    // Verificar se há alterações no formulário comparado ao estado inicial
    hasChanges() {
      if (!this.isEditing || !this.initialExpense) return true; // Se estiver criando, sempre pode salvar

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
    formatDate(date: Date, formatStr: string) {
      return format(date, formatStr, { locale: ptBR });
    },
    formatDateForBackend(date: Date) {
      return format(date, 'yyyy-MM-dd');
    },
    formatCurrency(value: number) {
      return value.toFixed(2).replace('.', ',');
    },
    onDateSelect(date: Date) {
      this.newExpense.date = this.formatDateForBackend(date);
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
        } else {
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
      } catch (error) {
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
    handleEditExpense(expense: Despesa) {
      this.selectedExpense = expense;
      this.newExpense = {...expense};
      this.initialExpense = {...expense}; // Salvar estado inicial para comparação
      this.isEditing = true;
      this.isDialogOpen = true;
    },
    async handleDeleteExpense(expense: Despesa) {
      if (confirm('Tem certeza que deseja excluir esta despesa?')) {
        try {
          await this.deleteDespesa(expense.id);
          toast.success("Despesa excluída com sucesso");
          this.$emit('expense-deleted');
        } catch (error) {
          console.error('Erro ao excluir despesa:', error);
          toast.error("Erro ao excluir despesa");
        }
      }
    }
  }
};
</script>
