<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-0 sm:p-4 z-50"
        @click="onClose"
      >
        <div
          class="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full h-[90vh] sm:h-auto sm:max-w-md
                 overflow-hidden max-h-[90vh] sm:max-h-[85vh] overflow-y-auto absolute bottom-0 sm:relative"
          :class="{ 'scale-100': isOpen, 'translate-y-0': isOpen }"
          style="transition: transform 0.3s ease, opacity 0.3s ease;"
          @click.stop
        >
          <!-- Puxador móvel no topo para UX de sheet em mobile -->
          <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2 mb-1 sm:hidden"></div>

          <div class="p-4 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg sm:text-xl font-bold">{{ formatDate(date, "EEEE, dd 'de' MMMM") }}</h2>
              <Button variant="ghost" size="icon" @click="onClose">
                <X class="h-5 w-5" />
                <span class="sr-only">Fechar</span>
              </Button>
            </div>

            <div class="flex items-center space-x-2 mb-4 sm:mb-6">
              <Switch id="trote-day" v-model="isTroteDay" />
              <Label for="trote-day">Dia de Trote</Label>
            </div>

            <Tabs default-value="items" class="space-y-4">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="items" class="text-sm">Itens</TabsTrigger>
                <TabsTrigger value="chart" class="text-sm">Gráfico</TabsTrigger>
              </TabsList>

              <TabsContent value="items" class="space-y-4 pt-2">
                <h3 class="font-medium text-gray-700">Itens Vendidos</h3>

                <div
                  v-for="item in items"
                  :key="item.id"
                  class="flex items-center justify-between py-2"
                  :class="{ 'hidden': item.isTroteItem && !isTroteDay }"
                >
                  <div class="flex items-center gap-2">
                    <component :is="item.icon" class="h-4 w-4" />
                    <div>
                      <span>{{ item.name }}</span>
                      <div class="text-xs text-gray-500">R$ {{ item.price.toFixed(2) }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      class="h-10 w-10 sm:h-8 sm:w-8"
                      @click="handleDecrement(item.id)"
                      :disabled="item.count === 0"
                    >
                      <span>-</span>
                    </Button>
                    <span class="w-8 text-center">{{ item.count }}</span>
                    <Button variant="outline" size="icon" class="h-10 w-10 sm:h-8 sm:w-8" @click="handleIncrement(item.id)">
                      <span>+</span>
                    </Button>
                  </div>
                </div>

                <template v-if="customItems.length > 0">
                  <Separator class="my-4" />
                  <h3 class="font-medium text-gray-700">Outros Itens</h3>

                  <div
                    v-for="item in customItems"
                    :key="item.id"
                    class="flex items-center justify-between py-2"
                  >
                    <div class="flex items-center gap-2">
                      <component :is="item.icon" class="h-4 w-4" />
                      <div>
                        <span>{{ item.name }}</span>
                        <div class="text-xs text-gray-500">R$ {{ item.price.toFixed(2) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-10 w-10 sm:h-8 sm:w-8"
                        @click="handleDecrementCustom(item.id)"
                        :disabled="item.count === 0"
                      >
                        <span>-</span>
                      </Button>
                      <span class="w-8 text-center">{{ item.count }}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-10 w-10 sm:h-8 sm:w-8"
                        @click="handleIncrementCustom(item.id)"
                      >
                        <span>+</span>
                      </Button>
                    </div>
                  </div>
                </template>

                <Separator class="my-4" />

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div class="sm:col-span-2">
                    <Input
                      placeholder="Adicionar outro item..."
                      v-model="customItemName"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Preço"
                      inputmode="decimal"
                      v-model="customItemPrice"
                    />
                  </div>
                </div>

                <Button
                  @click="handleAddCustomItem"
                  :disabled="!customItemName.trim() || !(Number.parseFloat(customItemPrice) > 0)"
                  class="w-full py-6 sm:py-2"
                >
                  <Plus class="h-4 w-4 mr-1" />
                  <span>Adicionar Item</span>
                </Button>
              </TabsContent>

              <TabsContent value="chart">
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="font-medium text-gray-700">Resumo de Vendas</h3>
                    <PieChart class="h-5 w-5 text-gray-500" />
                  </div>

                  <div class="h-[35vh] sm:h-[40vh] mx-auto">
                    <div v-if="totalSales > 0">
                      <BarChart
                        index="id"
                        :data="chartData"
                        :categories="['value']"
                        :y-formatter="(tick) => `R$ ${typeof tick === 'number' ? tick.toFixed(2) : ''}`"
                        :colors="['rgba(75, 192, 192, 0.6)']"
                        :rounded-corners="4"
                      />
                    </div>
                    <div v-else class="h-full flex items-center justify-center text-center">
                      <div class="text-gray-500">
                        <PieChart class="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>Adicione itens para visualizar o gráfico</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between mb-2">
                      <span class="text-gray-600">Total de Vendas:</span>
                      <span class="font-bold">R$ {{ formatCurrency(totalSales) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Itens Diferentes:</span>
                      <span class="font-bold">
                        {{ [...items, ...customItems].filter(item => item.count > 0).length }}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <!-- Botão de salvar fixo na parte inferior em mobile -->
          <div class="bg-gray-50 px-6 py-4 sm:flex justify-end sticky bottom-0 left-0 right-0 shadow-md sm:shadow-none">
            <div class="grid grid-cols-2 sm:flex sm:grid-cols-none gap-2">
              <Button variant="outline" @click="onClose" class="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                @click="handleSave"
                :disabled="totalSales <= 0"
                class="w-full sm:w-auto"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, Coffee, Droplet, IceCream, Ticket, Heart, Mail, Plus, PieChart } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/chart-bar';
import vendaService from '@/api/vendaService';
import { useTroteStore } from '@/stores/trote';
import { storeToRefs } from 'pinia';

interface SaleItem {
  id: string;
  name: string;
  icon: any;
  count: number;
  price: number;
  isTroteItem?: boolean;
}

// Mapeamento de IDs para ItemType do backend
const ITEM_TYPE_MAPPING = {
  'soda-cup': 'REFRI_COPO',
  'soda-bottle': 'REFRI_GARRAFA',
  'popsicle': 'PICOLE',
  'bingo': 'CARTELA_BINGO',
  'love-chain': 'OUTROS',
  'elegant-mail': 'CORREIO_ELEGANTE'
};

// Product prices
const PRICES = {
  "soda-cup": 2.5,
  "soda-bottle": 15,
  "popsicle": 4,
  "bingo": 2.5,
  "love-chain": 2.0,
  "elegant-mail": 1.5,
};

export default defineComponent({
  name: 'DayModal',
  components: {
    X, Coffee, Droplet, IceCream, Ticket, Heart, Mail, Plus, PieChart,
    Button, Input, Label, Switch, Separator, Tabs, TabsContent, TabsList, TabsTrigger,
    BarChart,
  },
  props: {
    date: {
      type: Object as PropType<Date>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:is-open', 'save'],
  setup(props, { emit }) {
    const troteStore = useTroteStore();
    const isTroteDay = ref(false);
    const customItemName = ref('');
    const customItemPrice = ref('');
    const loading = ref(false);

    // Inicializar isTroteDay com valor do store
    watch(() => props.date, () => {
      if (props.date) {
        const day = props.date.getDate().toString().padStart(2, '0');
        const month = (props.date.getMonth() + 1).toString().padStart(2, '0');
        const year = props.date.getFullYear();
        const dateStr = `${day}-${month}-${year}`;

        isTroteDay.value = troteStore.isTroteDay(dateStr);
      }
    }, { immediate: true });

    // Initial sales items
    const items = ref<SaleItem[]>([
      {
        id: "soda-cup",
        name: "Refri (copo)",
        icon: Droplet,
        count: 0,
        price: PRICES["soda-cup"],
      },
      {
        id: "soda-bottle",
        name: "Refri (garrafa)",
        icon: Coffee,
        count: 0,
        price: PRICES["soda-bottle"],
      },
      {
        id: "popsicle",
        name: "Picolé",
        icon: IceCream,
        count: 0,
        price: PRICES["popsicle"]
      },
      {
        id: "bingo",
        name: "Cartela de Bingo",
        icon: Ticket,
        count: 0,
        price: PRICES["bingo"],
        isTroteItem: true,
      },
      {
        id: "love-chain",
        name: "Cadeia do Amor",
        icon: Heart,
        count: 0,
        price: PRICES["love-chain"],
        isTroteItem: true,
      },
      {
        id: "elegant-mail",
        name: "Correio Elegante",
        icon: Mail,
        count: 0,
        price: PRICES["elegant-mail"],
        isTroteItem: true,
      }
    ]);

    const customItems = ref<SaleItem[]>([]);

    // Calculate total sales
    const totalSales = computed(() => {
      return [...items.value, ...customItems.value].reduce((total, item) => {
        return total + item.count * item.price;
      }, 0);
    });

    // Prepare chart data for shadcn-vue BarChart
    const chartData = computed(() => {
      return [...items.value, ...customItems.value]
        .filter(item => item.count > 0)
        .map(item => ({
          id: item.name,
          name: item.name,
          value: item.count * item.price
        }));
    });

    const formatDate = (date: Date, formatStr: string): string => {
      return format(date, formatStr, { locale: ptBR });
    };

    const formatCurrency = (value: number): string => {
      return value.toFixed(2).replace('.', ',');
    };

    const formatDateStr = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formatDateForBackend = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const handleIncrement = (id: string) => {
      items.value = items.value.map(item => {
        if (item.id === id) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
    };

    const handleDecrement = (id: string) => {
      items.value = items.value.map(item => {
        if (item.id === id && item.count > 0) {
          return { ...item, count: item.count - 1 };
        }
        return item;
      });
    };

    const handleIncrementCustom = (id: string) => {
      customItems.value = customItems.value.map(item => {
        if (item.id === id) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
    };

    const handleDecrementCustom = (id: string) => {
      customItems.value = customItems.value.map(item => {
        if (item.id === id && item.count > 0) {
          return { ...item, count: item.count - 1 };
        }
        return item;
      });
    };

    const handleAddCustomItem = () => {
      if (customItemName.value.trim() && Number.parseFloat(customItemPrice.value) > 0) {
        const newItem: SaleItem = {
          id: `custom-${Date.now()}`,
          name: customItemName.value,
          icon: Plus,
          count: 0,
          price: Number.parseFloat(customItemPrice.value),
        };
        customItems.value.push(newItem);
        customItemName.value = '';
        customItemPrice.value = '';
      }
    };

    const handleSave = async () => {
      loading.value = true;

      try {
        // Se for dia de trote, salva no store global
        if (isTroteDay.value) {
          const dateStr = formatDateStr(props.date);
          troteStore.setTroteDay(dateStr);
        }

        // Preparar e enviar todos os itens com quantidade > 0
        const vendaPromises = [];
        const savedItems = [];

        // Processar itens padrão
        for (const item of items.value) {
          if (item.count > 0) {
            const venda = {
              date: formatDateForBackend(props.date),
              itemType: ITEM_TYPE_MAPPING[item.id] || 'OUTROS',
              quantity: item.count,
              unitPrice: item.price,
              totalPrice: item.count * item.price,
              notes: isTroteDay.value ? 'Dia de Trote' : ''
            };

            try {
              const savedVenda = await vendaService.addVenda(venda);
              savedItems.push({
                id: item.id,
                name: item.name,
                count: item.count,
                price: item.price,
                total: item.count * item.price
              });

              vendaPromises.push(Promise.resolve(savedVenda));
            } catch (error) {
              console.error(`Erro ao salvar item ${item.id}:`, error);
              vendaPromises.push(Promise.reject(error));
            }
          }
        }

        // Processar itens customizados
        for (const item of customItems.value) {
          if (item.count > 0) {
            const venda = {
              date: formatDateForBackend(props.date),
              itemType: 'OUTROS',
              quantity: item.count,
              unitPrice: item.price,
              totalPrice: item.count * item.price,
              notes: `${item.name}${isTroteDay.value ? ' - Dia de Trote' : ''}`
            };

            try {
              const savedVenda = await vendaService.addVenda(venda);
              savedItems.push({
                id: item.id,
                name: item.name,
                count: item.count,
                price: item.price,
                total: item.count * item.price
              });

              vendaPromises.push(Promise.resolve(savedVenda));
            } catch (error) {
              console.error(`Erro ao salvar item personalizado ${item.id}:`, error);
              vendaPromises.push(Promise.reject(error));
            }
          }
        }

        await Promise.all(vendaPromises);

        // Criar o objeto de venda completo para emitir
        const saleData = {
          date: formatDateForBackend(props.date),
          isTroteDay: isTroteDay.value,
          items: savedItems,
          totalAmount: totalSales.value // Certifique-se de que este valor é acessível
        };

        emit('save', saleData);
        emit('update:is-open', false);
      } catch (error) {
        console.error('Erro ao salvar vendas:', error);
      } finally {
        loading.value = false;
      }
    };

    const onClose = () => {
      emit('update:is-open', false);
    };

    return {
      isTroteDay,
      customItemName,
      customItemPrice,
      items,
      customItems,
      totalSales,
      chartData,
      loading,
      formatDate,
      formatCurrency,
      handleIncrement,
      handleDecrement,
      handleIncrementCustom,
      handleDecrementCustom,
      handleAddCustomItem,
      handleSave,
      onClose
    };
  }
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .modal-fade-enter-from .bg-white,
  .modal-fade-leave-to .bg-white {
    transform: translateY(100%);
  }
}

@media (min-width: 641px) {
  .modal-fade-enter-from .bg-white,
  .modal-fade-leave-to .bg-white {
    transform: scale(0.9) translateY(20px);
  }
}

/* Melhor suporte a gestos de arrasto para mobile com sheet */
@media (max-width: 640px) {
  .modal-fade-enter-active .bg-white,
  .modal-fade-leave-active .bg-white {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
}
</style>
