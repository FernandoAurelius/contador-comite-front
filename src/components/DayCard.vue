<template>
  <Transition
    name="card-hover"
    @mouseenter="startHover"
    @mouseleave="endHover"
  >
    <div
      class="bg-white rounded-lg shadow-sm border p-2 sm:p-3 h-20 sm:h-24 md:h-28 lg:h-32 cursor-pointer transition-colors text-xs sm:text-sm"
      :class="[
        isToday(date) && 'border-emerald-500 border-2',
        isDisabled && 'opacity-50 cursor-not-allowed bg-gray-50',
        hasSales && 'bg-emerald-50'
      ]"
      :style="animationStyle"
      @click="!isDisabled ? onClick() : undefined"
      @mousedown="startTap"
      @mouseup="endTap"
      @mouseleave="endTap"
    >
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-1 sm:mb-2">
          <span class="text-sm font-medium" :class="{ 'text-emerald-600': isToday(date) }">
            {{ formatDate(date, 'dd') }}
          </span>
          <span
            v-if="isTroteDay"
            class="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[0.65rem] sm:text-xs"
          >
            Trote
          </span>
        </div>

        <div v-if="hasSales" class="flex flex-col gap-0.5 sm:gap-1 mt-auto overflow-hidden">
          <div v-if="sodaCups > 0" class="flex items-center text-xs text-gray-600 truncate">
            <Droplet class="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
            <span class="text-[0.65rem] sm:text-xs truncate">{{ sodaCups }} copos</span>
          </div>

          <div v-if="sodaBottles > 0" class="flex items-center text-xs text-gray-600 truncate">
            <Coffee class="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
            <span class="text-[0.65rem] sm:text-xs truncate">{{ sodaBottles }} garrafas</span>
          </div>

          <div v-if="popsicles > 0" class="flex items-center text-xs text-gray-600 truncate">
            <IceCream class="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
            <span class="text-[0.65rem] sm:text-xs truncate">{{ popsicles }} picolés</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Coffee, Droplet, IceCream } from 'lucide-vue-next';
import Venda from '@/types/Venda';
import useVendaStore from '@/stores/vendas';

export default defineComponent({
  name: "DayCard",
  components: {
    Coffee,
    Droplet,
    IceCream
  },
  props: {
    date: {
      type: Object as PropType<Date>,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isTroteDay: {
      type: Boolean,
      default: false
    },
    isLarge: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sales: [] as Venda[],
      hasSales: false,
      sodaCups: 0,
      sodaBottles: 0,
      popsicles: 0,
      scale: 1,
      isHovering: false,
      isTapping: false
    }
  },
  computed: {
    animationStyle() {
      // Só aplicamos escala se não estiver desabilitado
      if (this.isDisabled) return {};

      return {
        transform: `scale(${this.scale})`,
        transition: 'transform 0.2s ease'
      };
    }
  },
  created() {
    this.fetchSalesData();
  },
  methods: {
    isToday,
    formatDate(date: Date, formatStr: string): string {
      return format(date, formatStr, { locale: ptBR });
    },
    onClick() {
      this.$emit('click', this.date);
    },
    startHover() {
      if (!this.isDisabled) {
        this.isHovering = true;
        this.scale = 1.03;
      }
    },
    endHover() {
      this.isHovering = false;
      if (!this.isTapping) {
        this.scale = 1;
      }
    },
    startTap() {
      if (!this.isDisabled) {
        this.isTapping = true;
        this.scale = 0.98;
      }
    },
    endTap() {
      this.isTapping = false;
      if (this.isHovering) {
        this.scale = 1.03;
      } else {
        this.scale = 1;
      }
    },
    async fetchSalesData() {
      const vendaStore = useVendaStore();

      if (this.date && this.date instanceof Date) {
        try {
          // Formatamos a data no formato esperado pelo backend (dd-MM-yyyy)
          const day = this.date.getDate().toString().padStart(2, '0');
          const month = (this.date.getMonth() + 1).toString().padStart(2, '0');
          const year = this.date.getFullYear();
          const dateStr = `${year}-${month}-${day}`;

          this.sales = await vendaStore.getVendaByDate(dateStr);
          this.hasSales = this.sales && this.sales.length > 0;

          // Contar os diferentes tipos de vendas
          this.sodaCups = this.countItemType('REFRI_COPO');
          this.sodaBottles = this.countItemType('REFRI_GARRAFA');
          this.popsicles = this.countItemType('PICOLE');
        } catch (error) {
          console.error('Erro ao buscar vendas:', error);
          this.hasSales = false;
          // Definir valores padrão para não causar mais erros
          this.sodaCups = 0;
          this.sodaBottles = 0;
          this.popsicles = 0;
        }
      } else {
        console.warn('Data inválida fornecida ao componente DayCard');
        this.hasSales = false;
      }
    },
    countItemType(type: string): number {
      if (!this.sales || !Array.isArray(this.sales)) return 0;

      return this.sales
        .filter(sale => sale && sale.itemType === type)
        .reduce((sum, sale) => sum + (sale.quantity || 0), 0);
    }
  }
});
</script>

<style scoped>
.card-hover-enter-active,
.card-hover-leave-active {
  transition: transform 0.2s ease;
}
</style>
