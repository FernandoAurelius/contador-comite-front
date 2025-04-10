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
              <!-- A key diferença aqui: valor vazio não permitido -->
              <SelectItem value="todos">Todos os itens</SelectItem>
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

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-10">
        <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredVendas.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
        <FileBarChart class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-1">Nenhuma venda encontrada</h3>
        <p class="text-gray-500 mb-4">
          {{ hasFilters ? 'Nenhuma venda corresponde aos filtros aplicados.' : 'Adicione sua primeira venda para começar.' }}
        </p>
        <Button variant="outline" v-if="hasFilters" @click="clearFilters">
          Limpar filtros
        </Button>
      </div>

      <!-- Grid de vendas usando FinancialItem -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FinancialItem
            v-for="venda in filteredVendas"
            :key="venda.id"
            :item="venda"
            type="sale"
            @edit="editVenda"
            @delete="confirmDeleteVenda"
          />
        </div>

        <!-- Totais -->
        <div class="mt-6 bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-medium">Total de vendas:</span>
            <span class="font-bold">R$ {{ formatCurrency(totalVendas) }}</span>
          </div>
        </div>
      </div>
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
import { defineComponent } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  Search, Calendar, X, Plus, FileBarChart, Loader2
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DayModal from '@/components/DayModal.vue';
import FinancialItem from '@/components/FinancialItem.vue';

import useVendaStore from '@/stores/vendas';
import Venda from '@/types/Venda';

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
      vendas: [] as Venda[],
      loading: false,
      selectedDate: null as Date | null,
      isDayModalOpen: false,
      isDeleteDialogOpen: false,
      vendaToDelete: null as Venda | null,
      filters: {
        search: '',
        itemType: 'todos', // Valor inicial válido, não vazio
        dateRange: false,
        dateStart: null as Date | null,
        dateEnd: null as Date | null
      }
    };
  },
  computed: {
    filteredVendas() {
      return this.vendas.filter(venda => {
        const searchLower = this.filters.search.toLowerCase();
        const matchesSearch =
          this.getItemTypeName(venda.itemType).toLowerCase().includes(searchLower) ||
          (venda.notes && venda.notes.toLowerCase().includes(searchLower));

        const matchesItemType =
          this.filters.itemType === 'todos' || venda.itemType === this.filters.itemType;

        const matchesDateRange = !this.filters.dateRange ||
          (new Date(venda.date) >= this.filters.dateStart! &&
           new Date(venda.date) <= this.filters.dateEnd!);

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
      } catch (error) {
        console.error('Erro ao carregar vendas:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date: Date) {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    },
    formatCurrency(value: number): string {
      return value.toFixed(2).replace('.', ',');
    },
    getItemTypeName(itemType: string): string {
      const types: Record<string, string> = {
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
    onDateRangeChange(range: { from: Date; to: Date }) {
      this.filters.dateStart = range.from;
      this.filters.dateEnd = range.to || range.from;
      this.filters.dateRange = true;
    },
    openAddVendaModal() {
      this.selectedDate = new Date();
      this.isDayModalOpen = true;
    },
    editVenda(venda: Venda) {
      // Para editar, poderia adaptar o DayModal para receber uma venda existente
      console.log('Editar venda:', venda);
    },
    confirmDeleteVenda(venda: Venda) {
      this.vendaToDelete = venda;
      this.isDeleteDialogOpen = true;
    },
    async deleteVenda() {
      if (!this.vendaToDelete) return;

      try {
        const vendaStore = useVendaStore();
        await vendaStore.deleteVenda(this.vendaToDelete.id);
        await this.loadVendas(); // Recarregar após deletar
      } catch (error) {
        console.error('Erro ao excluir venda:', error);
      } finally {
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
</script>
