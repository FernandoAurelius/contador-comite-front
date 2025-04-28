<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-0 sm:p-4 z-50"
        @click="onClose">
        <div class="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full h-[90vh] sm:h-auto sm:max-w-md
                 overflow-hidden max-h-[90vh] sm:max-h-[85vh] overflow-y-auto absolute bottom-0 sm:relative"
          :class="{ 'scale-100': isOpen, 'translate-y-0': isOpen }"
          style="transition: transform 0.3s ease, opacity 0.3s ease;" @click.stop>
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

                <div v-for="item in items" :key="item.id" class="flex items-center justify-between py-2"
                  :class="{ 'hidden': item.isTroteItem && !isTroteDay }">
                  <div class="flex items-center gap-2">
                    <component :is="item.icon" class="h-4 w-4" />
                    <div>
                      <span>{{ item.name }}</span>
                      <div class="text-xs text-gray-500">R$ {{ item.price.toFixed(2) }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button variant="outline" size="icon" class="h-10 w-10 sm:h-8 sm:w-8"
                      @click="handleDecrement(item.id)" :disabled="item.count === 0">
                      <span>-</span>
                    </Button>
                    <span class="w-8 text-center">{{ item.count }}</span>
                    <Button variant="outline" size="icon" class="h-10 w-10 sm:h-8 sm:w-8"
                      @click="handleIncrement(item.id)">
                      <span>+</span>
                    </Button>
                  </div>
                </div>

                <template v-if="customItems.length > 0">
                  <Separator class="my-4" />
                  <h3 class="font-medium text-gray-700">Outros Itens</h3>

                  <div v-for="item in customItems" :key="item.id" class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-2">
                      <component :is="item.icon" class="h-4 w-4" />
                      <div>
                        <span>{{ item.name }}</span>
                        <div class="text-xs text-gray-500">R$ {{ item.price.toFixed(2) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <Button variant="outline" size="icon" class="h-10 w-10 sm:h-8 sm:w-8"
                        @click="handleDecrementCustom(item.id)" :disabled="item.count === 0">
                        <span>-</span>
                      </Button>
                      <span class="w-8 text-center">{{ item.count }}</span>
                      <Button variant="outline" size="icon" class="h-10 w-10 sm:h-8 sm:w-8"
                        @click="handleIncrementCustom(item.id)">
                        <span>+</span>
                      </Button>
                    </div>
                  </div>
                </template>

                <Separator class="my-4" />

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div class="sm:col-span-2">
                    <Input placeholder="Adicionar outro item..." v-model="customItemName" />
                  </div>
                  <div>
                    <Input placeholder="Preço" inputmode="decimal" v-model="customItemPrice" />
                  </div>
                </div>

                <Button @click="handleAddCustomItem"
                  :disabled="!customItemName.trim() || !(Number.parseFloat(customItemPrice) > 0)"
                  class="w-full py-6 sm:py-2">
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

                  <div class="h-[30vh] sm:h-[35vh] mx-auto overflow-hidden">
                    <div v-if="totalSales > 0" class="h-full w-full">
                      <BarChart index="id" :data="chartData" :categories="['value']"
                        :y-formatter="(tick) => `R$ ${typeof tick === 'number' ? tick.toFixed(2) : ''}`"
                        :colors="['rgba(75, 192, 192, 0.6)']" :rounded-corners="4" class="h-full max-h-full" />
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
                        {{[...items, ...customItems].filter(item => item.count > 0).length}}
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
              <Button @click="handleSave" :disabled="totalSales <= 0 || !hasChanges" class="w-full sm:w-auto">
                {{ hasChanges ? 'Salvar' : 'Fechar' }}
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
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isAfter, isBefore, endOfWeek } from 'date-fns';
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
import { toast } from 'vue-sonner';

interface SaleItem {
  id: string;
  name: string;
  icon: any;
  count: number;
  price: number;
  isTroteItem?: boolean;
}

interface LoadedVenda {
  id: number;
  itemType: string;
  quantity: number;
}

const ITEM_TYPE_MAPPING = {
  'soda-cup': 'REFRI_COPO',
  'soda-bottle': 'REFRI_GARRAFA',
  'popsicle': 'PICOLE',
  'bingo': 'CARTELA_BINGO',
  'love-chain': 'CADEIA_DO_AMOR',
  'elegant-mail': 'CORREIO_ELEGANTE'
};

const ITEM_ID_MAPPING = {
  'REFRI_COPO': 'soda-cup',
  'REFRI_GARRAFA': 'soda-bottle',
  'PICOLE': 'popsicle',
  'CARTELA_BINGO': 'bingo',
  'CADEIA_DO_AMOR': 'love-chain',
  'CORREIO_ELEGANTE': 'elegant-mail'
};

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

    const loadedVendas = ref<{ [key: string]: LoadedVenda[] }>({});
    const loadedCustomVendas = ref<{ [key: string]: LoadedVenda[] }>({});

    const initialItemValues = ref<{ [key: string]: number }>({});
    const initialCustomItems = ref<SaleItem[]>([]);
    const hasChanges = computed(() => {
      const standardItemsChanged = items.value.some(item => {
        return item.count !== (initialItemValues.value[item.id] || 0);
      });

      const customItemsChanged = customItems.value.length !== initialCustomItems.value.length ||
        customItems.value.some((item, idx) => {
          if (idx >= initialCustomItems.value.length) return true;
          return item.count !== initialCustomItems.value[idx].count ||
            item.name !== initialCustomItems.value[idx].name ||
            item.price !== initialCustomItems.value[idx].price;
        });

      return standardItemsChanged || customItemsChanged;
    });

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

    const totalSales = computed(() => {
      return [...items.value, ...customItems.value].reduce((total, item) => {
        return total + item.count * item.price;
      }, 0);
    });

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
      return `${year}-${month}-${day}`;
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

    const handleDecrement = async (id: string) => {
      const item = items.value.find(item => item.id === id);
      if (!item || item.count <= 0) return;

      const itemType = ITEM_TYPE_MAPPING[id];

      if (loadedVendas.value[itemType] && loadedVendas.value[itemType].length > 0) {
        const vendaToDelete = loadedVendas.value[itemType].pop();
        if (vendaToDelete) {
          try {
            await vendaService.deleteVenda(vendaToDelete.id);
          } catch (error) {
            console.error(`Erro ao excluir venda ${vendaToDelete.id}:`, error);
            toast.error("Erro ao excluir venda");
            return;
          }
        }
      }

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

    const handleDecrementCustom = async (id: string) => {
      const item = customItems.value.find(item => item.id === id);
      if (!item || item.count <= 0) return;

      const itemName = item.name;

      if (loadedCustomVendas.value[itemName] && loadedCustomVendas.value[itemName].length > 0) {
        const vendaToDelete = loadedCustomVendas.value[itemName].pop();
        if (vendaToDelete) {
          try {
            await vendaService.deleteVenda(vendaToDelete.id);
          } catch (error) {
            console.error(`Erro ao excluir venda customizada ${vendaToDelete.id}:`, error);
            toast.error("Erro ao excluir venda");
            return;
          }
        }
      }

      customItems.value = customItems.value.map(item => {
        if (item.id === id && item.count > 0) {
          return { ...item, count: item.count - 1 };
        }
        return item;
      });
    };

    const handleAddCustomItem = () => {
      if (customItemName.value.trim() && Number.parseFloat(customItemPrice.value.replace(',', '.')) > 0) {
        const newItem: SaleItem = {
          id: `custom-${Date.now()}`,
          name: customItemName.value.trim(),
          icon: Plus,
          count: 0,
          price: Number.parseFloat(customItemPrice.value.replace(',', '.')),
        };
        customItems.value.push(newItem);
        customItemName.value = '';
        customItemPrice.value = '';
      }
    };

    const loadDayVendas = async () => {
      if (!props.date) return;

      loading.value = true;
      try {
        const dateStr = formatDateStr(props.date);
        const dayVendas = await vendaService.getVendaByDate(dateStr);

        items.value = items.value.map(item => ({ ...item, count: 0 }));
        customItems.value = [];
        loadedVendas.value = {};
        loadedCustomVendas.value = {};

        if (dayVendas && dayVendas.length > 0) {
          const isTroteVendas = dayVendas.some(v =>
            v.itemType === 'CARTELA_BINGO' ||
            v.itemType === 'CORREIO_ELEGANTE' ||
            v.itemType === 'CADEIA_DO_AMOR' ||
            (v.notes && v.notes.toLowerCase().includes('trote'))
          );

          if (isTroteVendas) {
            isTroteDay.value = true;
          }

          dayVendas.forEach(venda => {
            if (venda.itemType === 'OUTROS') {
              const itemName = venda.notes || 'Item sem nome';

              if (!loadedCustomVendas.value[itemName]) {
                loadedCustomVendas.value[itemName] = [];
              }

              loadedCustomVendas.value[itemName].push({
                id: venda.id,
                itemType: venda.itemType,
                quantity: venda.quantity
              });

              const existingItem = customItems.value.find(item => item.name === itemName);
              if (existingItem) {
                existingItem.count += venda.quantity;
              } else {
                customItems.value.push({
                  id: `custom-${Date.now()}-${customItems.value.length}`,
                  name: itemName,
                  icon: Plus,
                  count: venda.quantity,
                  price: venda.unitPrice || 0
                });
              }
            } else {
              if (!loadedVendas.value[venda.itemType]) {
                loadedVendas.value[venda.itemType] = [];
              }

              loadedVendas.value[venda.itemType].push({
                id: venda.id,
                itemType: venda.itemType,
                quantity: venda.quantity
              });

              const itemId = ITEM_ID_MAPPING[venda.itemType];
              if (itemId) {
                const item = items.value.find(item => item.id === itemId);
                if (item) {
                  item.count += venda.quantity;
                  item.price = venda.unitPrice || item.price;
                }
              }
            }
          });

          initialItemValues.value = Object.fromEntries(
            items.value.map(item => [item.id, item.count])
          );
          initialCustomItems.value = JSON.parse(JSON.stringify(customItems.value));
        } else {
          initialItemValues.value = Object.fromEntries(
            items.value.map(item => [item.id, 0])
          );
          initialCustomItems.value = [];
        }
      } catch (error) {
        console.error('Erro ao carregar vendas do dia:', error);
        toast.error("Erro ao carregar vendas");
      } finally {
        loading.value = false;
      }
    };

    const handleSave = async () => {
      if (!hasChanges.value) {
        console.log('Nenhuma alteração detectada, pulando salvamento');
        emit('update:is-open', false);
        return;
      }

      loading.value = true;

      try {
        if (isTroteDay.value) {
          const dateStr = formatDateStr(props.date);
          troteStore.setTroteDay(dateStr);
        }

        const vendaPromises = [];
        const savedItems = [];

        for (const item of items.value) {
          if (item.count > 0) {
            const itemType = ITEM_TYPE_MAPPING[item.id];
            const loadedCount = (loadedVendas.value[itemType] || []).reduce(
              (sum, v) => sum + v.quantity, 0
            );

            if (item.count > loadedCount) {
              const newCount = item.count - loadedCount;
              const venda = {
                date: formatDateForBackend(props.date),
                itemType: itemType as "REFRI_COPO" | "REFRI_GARRAFA" | "PICOLE" | "CARTELA_BINGO" | "CORREIO_ELEGANTE" | "OUTROS",
                quantity: newCount,
                unitPrice: item.price,
                totalPrice: newCount * item.price,
                notes: isTroteDay.value ? 'Dia de Trote' : ''
              };

              try {
                const savedVenda = await vendaService.addVenda(venda);
                savedItems.push({
                  id: item.id,
                  name: item.name,
                  count: newCount,
                  price: item.price,
                  total: newCount * item.price
                });

                vendaPromises.push(Promise.resolve(savedVenda));
              } catch (error) {
                console.error(`Erro ao salvar item ${item.id}:`, error);
                vendaPromises.push(Promise.reject(error));
              }
            }
          }
        }

        for (const item of customItems.value) {
          if (item.count > 0) {
            const loadedCount = (loadedCustomVendas.value[item.name] || []).reduce(
              (sum, v) => sum + v.quantity, 0
            );

            if (item.count > loadedCount) {
              const newCount = item.count - loadedCount;
              const venda = {
                date: formatDateForBackend(props.date),
                itemType: "OUTROS" as "REFRI_COPO" | "REFRI_GARRAFA" | "PICOLE" | "CARTELA_BINGO" | "CORREIO_ELEGANTE" | "OUTROS",
                quantity: newCount,
                unitPrice: item.price,
                totalPrice: newCount * item.price,
                notes: `${item.name}${isTroteDay.value ? ' - Dia de Trote' : ''}`
              };

              try {
                const savedVenda = await vendaService.addVenda(venda);
                savedItems.push({
                  id: item.id,
                  name: item.name,
                  count: newCount,
                  price: item.price,
                  total: newCount * item.price
                });

                vendaPromises.push(Promise.resolve(savedVenda));
              } catch (error) {
                console.error(`Erro ao salvar item personalizado ${item.id}:`, error);
                vendaPromises.push(Promise.reject(error));
              }
            }
          }
        }

        await Promise.all(vendaPromises);

        const saleData = {
          date: formatDateForBackend(props.date),
          isTroteDay: isTroteDay.value,
          items: savedItems,
          totalAmount: totalSales.value
        };

        initialItemValues.value = Object.fromEntries(
          items.value.map(item => [item.id, item.count])
        );
        initialCustomItems.value = JSON.parse(JSON.stringify(customItems.value));

        emit('save', saleData);
        emit('update:is-open', false);
      } catch (error) {
        console.error('Erro ao salvar vendas:', error);
        toast.error("Erro ao salvar vendas");
      } finally {
        loading.value = false;
      }
    };

    watch(() => [props.isOpen, props.date], () => {
      if (props.isOpen && props.date) {
        loadDayVendas();
      }
    }, { immediate: true });

    watch(() => props.date, () => {
      if (props.date) {
        const day = props.date.getDate().toString().padStart(2, '0');
        const month = (props.date.getMonth() + 1).toString().padStart(2, '0');
        const year = props.date.getFullYear();
        const dateStr = `${day}-${month}-${year}`;

        isTroteDay.value = troteStore.isTroteDay(dateStr);
      }
    }, { immediate: true });

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
      loadDayVendas,
      onClose,
      hasChanges
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

/* Ajustar o overflow e dimensionamento dos gráficos */
:deep(.recharts-responsive-container) {
  overflow: visible !important;
}

:deep(.recharts-wrapper) {
  max-height: 100% !important;
  overflow: visible !important;
}

:deep(.recharts-surface) {
  overflow: visible !important;
}
</style>
