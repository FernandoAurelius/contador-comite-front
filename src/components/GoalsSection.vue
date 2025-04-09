<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <h2 class="text-xl font-medium text-gray-700">Metas Financeiras</h2>

      <Dialog v-model:open="isNewGoalDialogOpen">
        <DialogTrigger asChild>
          <Button class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            <span>Nova Meta</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Meta</DialogTitle>
            <DialogDescription>Configure uma nova meta financeira abaixo.</DialogDescription>
          </DialogHeader>

          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="goal-name">Nome da Meta</Label>
              <Input
                id="goal-name"
                v-model="newGoal.name"
                placeholder="Ex: Meta para formatura"
              />
            </div>

            <div class="grid gap-2">
              <Label for="goal-value">Valor Alvo (R$)</Label>
              <div class="relative">
                <DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="goal-value"
                  type="number"
                  v-model="newGoal.value"
                  placeholder="0.00"
                  class="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div class="grid gap-2">
              <Label for="goal-description">Descrição (opcional)</Label>
              <Textarea
                id="goal-description"
                v-model="newGoal.description"
                placeholder="Detalhes sobre a meta..."
                rows="3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" @click="isNewGoalDialogOpen = false">
              Cancelar
            </Button>
            <Button @click="addGoal" :disabled="!isGoalFormValid">
              Adicionar Meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Goals List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="goal in goals" :key="goal.id" class="overflow-hidden">
        <CardHeader class="pb-3">
          <div class="flex justify-between items-start">
            <CardTitle class="text-lg">{{ goal.name }}</CardTitle>
            <div class="flex space-x-1">
              <Button variant="ghost" size="icon" class="h-8 w-8" @click="editGoal(goal)">
                <Edit class="h-4 w-4" />
                <span class="sr-only">Editar</span>
              </Button>
              <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500" @click="confirmDeleteGoal(goal)">
                <Trash class="h-4 w-4" />
                <span class="sr-only">Excluir</span>
              </Button>
            </div>
          </div>
          <CardDescription>{{ goal.description }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span>{{ Math.min(Math.round((currentBalance / goal.value) * 100), 100) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  :style="`width: ${Math.min((currentBalance / goal.value) * 100, 100)}%`"
                ></div>
              </div>
            </div>

            <div class="flex justify-between">
              <div>
                <p class="text-xs text-gray-500">Valor Atual</p>
                <p class="font-medium">R$ {{ formatCurrency(currentBalance) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">Meta</p>
                <p class="font-medium">R$ {{ formatCurrency(goal.value) }}</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-500">Restante</p>
              <p class="font-medium" :class="remainingAmount(goal) <= 0 ? 'text-emerald-600' : 'text-orange-600'">
                {{ remainingAmount(goal) <= 0 ? 'Meta alcançada!' : `R$ ${formatCurrency(remainingAmount(goal))}` }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-if="goals.length === 0" class="text-center py-16 bg-gray-50 rounded-lg">
      <Target class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-1">Sem metas definidas</h3>
      <p class="text-gray-500 mb-4">
        Crie sua primeira meta financeira para acompanhar seu progresso.
      </p>
      <Button @click="isNewGoalDialogOpen = true">
        <Plus class="h-4 w-4 mr-2" />
        Criar Meta
      </Button>
    </div>

    <!-- Edit Goal Dialog -->
    <Dialog v-model:open="isEditGoalDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
          <DialogDescription>Atualize os detalhes da meta.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="edit-goal-name">Nome da Meta</Label>
            <Input
              id="edit-goal-name"
              v-model="editingGoal.name"
              placeholder="Ex: Meta para formatura"
            />
          </div>

          <div class="grid gap-2">
            <Label for="edit-goal-value">Valor Alvo (R$)</Label>
            <div class="relative">
              <DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="edit-goal-value"
                type="number"
                v-model="editingGoal.value"
                placeholder="0.00"
                class="pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div class="grid gap-2">
            <Label for="edit-goal-description">Descrição (opcional)</Label>
            <Textarea
              id="edit-goal-description"
              v-model="editingGoal.description"
              placeholder="Detalhes sobre a meta..."
              rows="3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isEditGoalDialogOpen = false">
            Cancelar
          </Button>
          <Button @click="saveEditedGoal" :disabled="!isEditFormValid">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="isDeleteConfirmDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a meta "{{ goalToDelete?.name }}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="isDeleteConfirmDialogOpen = false">
            Cancelar
          </Button>
          <Button variant="destructive" @click="deleteGoal">
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { Edit, Trash, Plus, DollarSign, Target } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Goal {
  id: string;
  name: string;
  value: number;
  description: string;
}

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
      type: Array as PropType<Goal[]>,
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
      value: 0 as number | string,
      description: ''
    });

    const editingGoal = ref<Goal>({
      id: '',
      name: '',
      value: 0,
      description: ''
    });

    const goalToDelete = ref<Goal | null>(null);

    const isGoalFormValid = computed(() => {
      return newGoal.value.name &&
            (typeof newGoal.value.value === 'number' ?
              newGoal.value.value > 0 :
              parseFloat(String(newGoal.value.value)) > 0);
    });

    const isEditFormValid = computed(() => {
      return editingGoal.value.name && editingGoal.value.value > 0;
    });

    const formatCurrency = (value: number) => {
      return value.toFixed(2).replace('.', ',');
    };

    const remainingAmount = (goal: Goal) => {
      return goal.value - props.currentBalance;
    };

    const addGoal = () => {
      const goalValue = typeof newGoal.value.value === 'string'
        ? parseFloat(newGoal.value.value)
        : newGoal.value.value;

      const goal: Goal = {
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

    const editGoal = (goal: Goal) => {
      editingGoal.value = { ...goal };
      isEditGoalDialogOpen.value = true;
    };

    const saveEditedGoal = () => {
      const updatedGoals = props.goals.map(goal =>
        goal.id === editingGoal.value.id ? editingGoal.value : goal
      );

      emit('update-goals', updatedGoals);
      isEditGoalDialogOpen.value = false;
    };

    const confirmDeleteGoal = (goal: Goal) => {
      goalToDelete.value = goal;
      isDeleteConfirmDialogOpen.value = true;
    };

    const deleteGoal = () => {
      if (!goalToDelete.value) return;

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
</script>
