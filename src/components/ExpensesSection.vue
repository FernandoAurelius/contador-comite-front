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
                        ? formatDate(newExpense.date, "dd 'de' MMMM 'de' yyyy")
                        : "Selecione uma data" }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      :selected="newExpense.date"
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
                v-model="newExpense.description"
                placeholder="Ex: Material para decoração"
              />
            </div>

            <div class="grid gap-2">
              <Label for="expense-amount">Valor (R$)</Label>
              <div class="relative">
                <DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="expense-amount"
                  type="number"
                  v-model="newExpense.amount"
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
            <Button @click="handleAddExpense" :disabled="!isFormValid">
              Adicionar Despesa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <template v-if="filteredExpenses.length > 0">
      <Card>
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead class="text-right">Valor</TableHead>
                <TableHead class="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="expense in filteredExpenses" :key="expense.id">
                <TableCell>{{ formatDateShort(expense.date) }}</TableCell>
                <TableCell>
                  <div>
                    {{ expense.description }}
                    <p v-if="expense.notes" class="text-xs text-gray-500 mt-1">{{ expense.notes }}</p>
                  </div>
                </TableCell>
                <TableCell class="text-right font-medium">R$ {{ formatCurrency(expense.amount) }}</TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <Edit class="h-4 w-4" />
                      <span class="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500">
                      <Trash class="h-4 w-4" />
                      <span class="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
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
import { defineComponent, ref, computed, PropType } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Plus, Edit, Trash, Calendar, DollarSign, FileText } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface Expense {
  id: string;
  date: Date;
  description: string;
  amount: number;
  notes?: string;
}

export default defineComponent({
  name: 'ExpensesSection',
  components: {
    Search,
    Plus,
    Edit,
    Trash,
    Calendar,
    DollarSign,
    FileText,
    Button,
    Input,
    Label,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Textarea,
    Popover,
    PopoverContent,
    PopoverTrigger,
    CalendarComponent
  },
  props: {
    expenses: {
      type: Array as PropType<Expense[]>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const searchTerm = ref('');
    const isDialogOpen = ref(false);
    const isCalendarOpen = ref(false);

    const newExpense = ref({
      date: new Date(),
      description: '',
      amount: 0 as number | string,
      notes: ''
    });

    const filteredExpenses = computed(() => {
      const searchLower = searchTerm.value.toLowerCase();
      return props.expenses.filter(
        expense =>
          expense.description.toLowerCase().includes(searchLower) ||
          (expense.notes && expense.notes.toLowerCase().includes(searchLower))
      );
    });

    const isFormValid = computed(() => {
      return newExpense.value.description &&
            (typeof newExpense.value.amount === 'number' ?
              newExpense.value.amount > 0 :
              parseFloat(newExpense.value.amount) > 0);
    });

    const formatDate = (date: Date, formatStr: string) => {
      return format(date, formatStr, { locale: ptBR });
    };

    const formatDateShort = (date: Date) => {
      return format(date, 'dd/MM/yyyy');
    };

    const formatCurrency = (value: number) => {
      return value.toFixed(2).replace('.', ',');
    };

    const onDateSelect = (date: Date) => {
      newExpense.value.date = date;
      isCalendarOpen.value = false;
    };

    const handleAddExpense = () => {
      const amount = typeof newExpense.value.amount === 'string'
        ? parseFloat(newExpense.value.amount)
        : newExpense.value.amount;

      const expense: Expense = {
        id: Date.now().toString(),
        date: newExpense.value.date,
        description: newExpense.value.description,
        amount: amount,
        notes: newExpense.value.notes || undefined
      };

      emit('add-expense', expense);

      // Reset form
      newExpense.value = {
        date: new Date(),
        description: '',
        amount: 0,
        notes: ''
      };

      isDialogOpen.value = false;
    };

    return {
      searchTerm,
      isDialogOpen,
      isCalendarOpen,
      newExpense,
      filteredExpenses,
      isFormValid,
      formatDate,
      formatDateShort,
      formatCurrency,
      onDateSelect,
      handleAddExpense
    };
  }
});
</script>
