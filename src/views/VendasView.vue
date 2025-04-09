<template>
  <div class="container py-4 sm:py-6 md:py-8 mx-auto">
    <div class="grid gap-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">Gestão de Vendas</h1>
          <p class="text-gray-500 text-sm sm:text-base">
            Gerencie todas as vendas do comitê
          </p>
        </div>

        <Button @click="openAddVendaModal">
          <Plus class="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      <!-- Filtros -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:flex gap-4">
        <div class="flex-1 relative max-w-sm">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            v-model="filters.search"
            placeholder="Buscar vendas..."
            class="pl-10"
          />
        </div>

        <div class="max-w-[12rem]">
          <Select v-model="filters.itemType">
            <SelectTrigger>
              <SelectValue placeholder="Tipo de item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os itens</SelectItem>
              <SelectItem value="REFRI_COPO">Refri (copo)</SelectItem>
              <SelectItem value="REFRI_GARRAFA">Refri (garrafa)</SelectItem>
              <SelectItem value="PICOLE">Picolé</SelectItem>
              <SelectItem value="CARTELA_BINGO">Bingo</SelectItem>
              <SelectItem value="CORREIO_ELEGANTE">Correio Elegante</SelectItem>
              <SelectItem value="OUTROS">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="max-w-[12rem]">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" class="w-full justify-start text-left">
                <Calendar class="mr-2 h-4 w-4" />
                {{ filters.dateRange ? `${formatDate(filters.dateStart!)} - ${formatDate(filters.dateEnd!)}` : 'Período' }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0" align="start">
              <Calendar
                class="p-3"
                mode="range"
                :selected-from="filters.dateStart"
                :selected-to="filters.dateEnd"
                @update:range="onDateRangeChange"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Button variant="outline" @click="clearFilters">
            <X class="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
      </div>

      <!-- Tabela de vendas -->
      <Card>
        <CardContent class="p-0">
          <div v-if="loading" class="flex justify-center py-10">
            <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
          </div>

          <div v-else-if="filteredVendas.length === 0" class="text-center py-12">
            <FileBarChart class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-1">Nenhuma venda encontrada</h3>
            <p class="text-gray-500 mb-4">
              {{ hasFilters ? 'Nenhuma venda corresponde aos filtros aplicados.' : 'Adicione sua primeira venda para começar.' }}
            </p>
            <Button variant="outline" v-if="hasFilters" @click="clearFilters">
              Limpar filtros
            </Button>
          </div>

          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Qtde</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Total</TableHead>
                <TableHead class="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="venda in filteredVendas" :key="venda.id">
                <TableCell>{{ formatDate(new Date(venda.date)) }}</TableCell>
                <TableCell>
                  <div class="flex flex-col">
                    <span>{{ getItemTypeName(venda.itemType) }}</span>
                    <span v-if="venda.notes" class="text-xs text-gray-500">{{ venda.notes }}</span>
                  </div>
                </TableCell>
                <TableCell>{{ venda.quantity }}</TableCell>
                <TableCell>R$ {{ formatCurrency(venda.unitPrice) }}</TableCell>
                <TableCell>R$ {{ formatCurrency(venda.totalPrice) }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" @click="editVenda(venda)">
                      <Edit class="h-4 w-4" />
                      <span class="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" class="text-red-500" @click="confirmDeleteVenda(venda)">
                      <Trash class="h-4 w-4" />
                      <span class="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan="4" class="text-right font-medium">Total:</TableCell>
                <TableCell class="font-bold">R$ {{ formatCurrency(totalVendas) }}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="isDeleteDialogOpen = false">Cancelar</Button>
          <Button variant="destructive" @click="deleteVenda">Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modal para adicionar/editar venda -->
    <DayModal
      v-if="selectedDate"
      :date="selectedDate"
      :is-open="isDayModalOpen"
      @update:is-open="isDayModalOpen = $event"
      @save="loadVendas"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  Search, Calendar, X, Edit, Trash, Plus, FileBarChart, Loader2
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DayModal from '@/components/DayModal.vue';

import { useVendaStore } from '@/stores/vendas';
import Venda from '@/types/Venda';

export default defineComponent({
  name: 'VendasView',
  components: {
    Search, Calendar, X, Edit, Trash, Plus, FileBarChart, Loader2,
    Button, Input, Card, CardContent,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter,
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    Popover, PopoverContent, PopoverTrigger,
    CalendarComponent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    DayModal
  },
  setup() {
    const vendaStore = useVendaStore();
    const vendas = ref<Venda[]>([]);
    const loading = ref(false);

    // Estado para modais
    const selectedDate = ref<Date | null>(null);
    const isDayModalOpen = ref(false);
    const isDeleteDialogOpen = ref(false);
    const vendaToDelete = ref<Venda | null>(null);

    // Filtros
    const filters = ref({
      search: '',
      itemType: '',
      dateRange: false,
      dateStart: null as Date | null,
      dateEnd: null as Date | null
    });

    const filteredVendas = computed(() => {
      return vendas.value.filter(venda => {
        const searchLower = filters.value.search.toLowerCase();
        const matchesSearch =
          getItemTypeName(venda.itemType).toLowerCase().includes(searchLower) ||
          (venda.notes && venda.notes.toLowerCase().includes(searchLower));

        const matchesItemType =
          !filters.value.itemType || venda.itemType === filters.value.itemType;

        const matchesDateRange = !filters.value.dateRange ||
          (new Date(venda.date) >= filters.value.dateStart! &&
           new Date(venda.date) <= filters.value.dateEnd!);

        return matchesSearch && matchesItemType && matchesDateRange;
      });
    });

    const totalVendas = computed(() => {
      return filteredVendas.value.reduce((total, venda) => total + venda.totalPrice, 0);
    });

    const hasFilters = computed(() => {
      return filters.value.search || filters.value.itemType || filters.value.dateRange;
    });

    // Métodos
    const loadVendas = async () => {
      loading.value = true;
      try {
        vendas.value = await vendaStore.getVendas();
      } catch (error) {
        console.error('Erro ao carregar vendas:', error);
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date: Date) => {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    };

    const formatCurrency = (value: number): string => {
      return value.toFixed(2).replace('.', ',');
    };

    const getItemTypeName = (itemType: string): string => {
      const types: Record<string, string> = {
        'REFRI_COPO': 'Refri (copo)',
        'REFRI_GARRAFA': 'Refri (garrafa)',
        'PICOLE': 'Picolé',
        'CARTELA_BINGO': 'Cartela de Bingo',
        'CORREIO_ELEGANTE': 'Correio Elegante',
        'OUTROS': 'Outros'
      };
      return types[itemType] || itemType;
    };

    const clearFilters = () => {
      filters.value = {
        search: '',
        itemType: '',
        dateRange: false,
        dateStart: null,
        dateEnd: null
      };
    };

    const onDateRangeChange = (range: { from: Date; to: Date }) => {
      filters.value.dateStart = range.from;
      filters.value.dateEnd = range.to || range.from;
      filters.value.dateRange = true;
    };

    const openAddVendaModal = () => {
      selectedDate.value = new Date();
      isDayModalOpen.value = true;
    };

    const editVenda = (venda: Venda) => {
      // Para editar, você provavelmente precisaria de um modal específico
      // ou poderia adaptar o DayModal para receber uma venda existente
      console.log('Editar venda:', venda);
    };

    const confirmDeleteVenda = (venda: Venda) => {
      vendaToDelete.value = venda;
      isDeleteDialogOpen.value = true;
    };

    const deleteVenda = async () => {
      if (!vendaToDelete.value) return;

      try {
        await vendaStore.deleteVenda(vendaToDelete.value.id);
        await loadVendas(); // Recarregar após deletar
      } catch (error) {
        console.error('Erro ao excluir venda:', error);
      } finally {
        isDeleteDialogOpen.value = false;
        vendaToDelete.value = null;
      }
    };

    onMounted(loadVendas);

    return {
      vendas,
      loading,
      selectedDate,
      isDayModalOpen,
      isDeleteDialogOpen,
      filters,
      filteredVendas,
      totalVendas,
      hasFilters,
      formatDate,
      formatCurrency,
      getItemTypeName,
      clearFilters,
      onDateRangeChange,
      openAddVendaModal,
      editVenda,
      confirmDeleteVenda,
      deleteVenda,
      loadVendas
    };
  }
});
</script>
