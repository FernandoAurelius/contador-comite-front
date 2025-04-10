<template>
  <Card class="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
    <CardContent class="p-0">
      <div class="flex flex-col h-full">
        <!-- Cabeçalho do Card com data e ícone do tipo -->
        <div
          class="p-4 flex justify-between items-center border-b"
          :class="getTypeColorClass()"
        >
          <div class="flex items-center">
            <component :is="getIcon()" class="h-5 w-5 mr-2" />
            <span class="font-medium text-sm">{{ formatDate(item.date) }}</span>
          </div>
          <Badge :variant="getTypeBadgeVariant()">
            {{ getTypeName() }}
          </Badge>
        </div>

        <!-- Conteúdo do Card -->
        <div class="p-4 flex-1">
          <div class="space-y-2">
            <h3 class="font-medium">
              {{ getItemTitle() }}
            </h3>

            <div v-if="item.notes" class="text-sm text-gray-500">
              {{ item.notes }}
            </div>

            <!-- Informações Específicas de Despesa -->
            <div v-if="type === 'expense' && item.quantity" class="text-sm text-gray-600">
              Quantidade: {{ item.quantity }} × R$ {{ formatCurrency(item.unitCost) }}
            </div>

            <!-- Informações Específicas de Venda -->
            <div v-if="type === 'sale' && item.quantity" class="text-sm text-gray-600">
              Quantidade: {{ item.quantity }} × R$ {{ formatCurrency(item.unitPrice) }}
            </div>
          </div>
        </div>

        <!-- Rodapé com o valor e ações -->
        <div class="p-4 bg-gray-50 border-t flex justify-between items-center">
          <div class="font-bold">
            {{ getValueLabel() }}: R$ {{ formatCurrency(getItemValue()) }}
          </div>

          <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" @click="$emit('edit', item)">
              <Edit class="h-4 w-4" />
              <span class="sr-only">Editar</span>
            </Button>
            <Button variant="ghost" size="icon" class="text-red-500" @click="$emit('delete', item)">
              <Trash class="h-4 w-4" />
              <span class="sr-only">Excluir</span>
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts">
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DollarSign,
  ShoppingCart,
  Coffee,
  IceCream,
  Droplet,
  Ticket,
  Mail,
  Heart,
  CreditCard,
  Receipt,
  Package,
  Edit,
  Trash
} from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type Venda from '@/types/Venda';
import type Despesa from '@/types/Despesa';

export default {
  name: 'FinancialItem',
  components: {
    Card,
    CardContent,
    Button,
    Badge,
    DollarSign,
    ShoppingCart,
    Coffee,
    IceCream,
    Droplet,
    Ticket,
    Mail,
    Heart,
    CreditCard,
    Receipt,
    Package,
    Edit,
    Trash
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['sale', 'expense'].includes(value)
    }
  },
  emits: ['edit', 'delete'],
  methods: {
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    },
    formatCurrency(value: number): string {
      return value.toFixed(2).replace('.', ',');
    },
    getIcon() {
      if (this.type === 'expense') {
        return CreditCard;
      }

      // Para vendas, determina o ícone baseado no tipo de item
      const itemType = (this.item as Venda).itemType;
      const iconMap: Record<string, any> = {
        'REFRI_COPO': Droplet,
        'REFRI_GARRAFA': Coffee,
        'PICOLE': IceCream,
        'CARTELA_BINGO': Ticket,
        'CORREIO_ELEGANTE': Mail,
        'OUTROS': Package
      };

      return iconMap[itemType] || ShoppingCart;
    },
    getTypeName(): string {
      if (this.type === 'expense') {
        return 'Despesa';
      }

      // Para vendas, traduz o tipo de item
      const itemType = (this.item as Venda).itemType;
      const typeMap: Record<string, string> = {
        'REFRI_COPO': 'Refri (copo)',
        'REFRI_GARRAFA': 'Refri (garrafa)',
        'PICOLE': 'Picolé',
        'CARTELA_BINGO': 'Cartela de Bingo',
        'CORREIO_ELEGANTE': 'Correio Elegante',
        'OUTROS': 'Outros'
      };

      return typeMap[itemType] || 'Venda';
    },
    getTypeBadgeVariant(): "default" | "destructive" | "outline" | "secondary" {
      // Usar apenas variantes válidos do Badge
      return this.type === 'expense' ? 'destructive' : 'default';
    },
    getTypeColorClass(): string {
      return this.type === 'expense'
        ? 'bg-red-50 border-red-100'
        : 'bg-blue-50 border-blue-100';
    },
    getItemTitle(): string {
      if (this.type === 'expense') {
        return (this.item as Despesa).item;
      }
      return this.getTypeName();
    },
    getItemValue(): number {
      if (this.type === 'expense') {
        return (this.item as Despesa).totalCost;
      }
      return (this.item as Venda).totalPrice;
    },
    getValueLabel(): string {
      return this.type === 'expense' ? 'Custo' : 'Valor';
    }
  }
};
</script>
