<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts';
import { buttonVariants } from '@/components/ui/button';
import { BulletLegend } from '@unovis/ts';
import { VisBulletLegend } from '@unovis/vue';
import { nextTick, onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { PieChart } from 'lucide-vue-next';

// Definição das propriedades do componente
const props = withDefaults(defineProps<{
  items: BulletLegendItemInterface[];
  data: Array<{category: string; value: number; name: string}>;
  index: string;
  categories: string[];
  formatter?: (value: number) => string;
  categoryPercs?: boolean;
  legend?: boolean;
  showLabels?: boolean; // Nova propriedade para controlar exibição dos labels
}>(), {
  items: () => [],
  data: () => [],
  categories: () => [],
  formatter: (value: number) => value.toString(),
  categoryPercs: false,
  legend: true,
  showLabels: true
});

// Eventos emitidos pelo componente
const emits = defineEmits<{
  'legendItemClick': [d: BulletLegendItemInterface, i: number]
  'update:items': [payload: BulletLegendItemInterface[]]
}>();

const elRef = ref<HTMLElement>();
const svgRef = ref<SVGElement>();
const containerRef = ref<HTMLElement>();
const resizeObserver = ref<ResizeObserver | null>(null);

// Cores para o gráfico de donut
const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Calcular o total para percentuais
const total = computed(() => {
  return props.data.reduce((sum, d) => sum + d.value, 0);
});

// Dados filtrados para o gráfico
const pieData = computed(() => {
  return props.data
    .filter(item => item.value > 0)
    .map((item, index) => ({
      name: item.name || item.category,
      value: item.value,
      color: COLORS[index % COLORS.length]
    }));
});

// Ajustamos os cálculos para garantir que o donut fique bem centralizado
const svgSize = ref({ width: 300, height: 300 });
const centerX = computed(() => svgSize.value.width / 2);
const centerY = computed(() => svgSize.value.height / 2);
// Reduzimos o raio para dar mais espaço para as legendas
const radius = computed(() => Math.min(centerX.value, centerY.value) * 0.65);
const innerRadius = computed(() => radius.value * 0.55); // Ajustando proporção do buraco do donut

// Função para calcular a posição dos arcos do donut
function calculateArc(startAngle: number, endAngle: number, innerR: number, outerR: number): string {
  const start = polarToCartesian(centerX.value, centerY.value, outerR, endAngle);
  const end = polarToCartesian(centerX.value, centerY.value, outerR, startAngle);
  const innerStart = polarToCartesian(centerX.value, centerY.value, innerR, endAngle);
  const innerEnd = polarToCartesian(centerX.value, centerY.value, innerR, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
    "L", innerEnd.x, innerEnd.y,
    "A", innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
    "Z"
  ].join(" ");
}

// Função para converter de coordenadas polares para cartesianas
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): {x: number, y: number} {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// Gerar os arcos do donut com seus ângulos correspondentes
const arcs = computed(() => {
  if (pieData.value.length === 0) return [];

  let currentAngle = 0;
  return pieData.value.map(item => {
    const percentage = item.value / total.value;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calcular posição para o rótulo
    const midAngle = currentAngle + angle / 2;
    const labelRadius = (radius.value + innerRadius.value) / 2;
    const labelPos = polarToCartesian(centerX.value, centerY.value, labelRadius, midAngle);

    // Ajustar âncora de texto conforme posição
    const textAnchor = midAngle > 90 && midAngle < 270 ? "end" : "start";

    currentAngle += angle;

    return {
      path: calculateArc(startAngle, endAngle, innerRadius.value, radius.value),
      color: item.color,
      name: item.name,
      value: item.value,
      percentage,
      labelPos,
      textAnchor,
      midAngle
    };
  });
});

// Formatar o texto dos rótulos
function getLabelText(arc: any) {
  if (props.categoryPercs) {
    return `${(arc.percentage * 100).toFixed(1)}%`;
  }
  return arc.name;
}

// Função para manter o estilo das legendas
function keepStyling() {
  const selector = `.${BulletLegend.selectors.item}`;
  nextTick(() => {
    const elements = elRef.value?.querySelectorAll(selector);
    const classes = buttonVariants({ variant: 'ghost', size: 'sm' }).split(' ');

    elements?.forEach(el => el.classList.add(...classes, '!inline-flex', '!mr-2'));
  });
}

// Função para ajustar o tamanho do SVG quando o container mudar de tamanho
function resizeChart() {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  // Definindo um tamanho máximo para evitar distorções em telas muito grandes
  const maxSize = Math.min(rect.width, rect.height, 500);

  svgSize.value = {
    width: rect.width,
    height: Math.min(rect.height, maxSize)
  };
}

// Configurar o ResizeObserver para redimensionar o gráfico quando o container mudar
function setupResizeObserver() {
  if (!containerRef.value) return;

  resizeObserver.value = new ResizeObserver(resizeChart);
  resizeObserver.value.observe(containerRef.value);
}

// Evento de clique na legenda
function onLegendItemClick(d: BulletLegendItemInterface, i: number) {
  emits('legendItemClick', d, i);
  const isBulletActive = !props.items[i].inactive;
  const isFilterApplied = props.items.some(i => i.inactive);
  if (isFilterApplied && isBulletActive) {
    // reset filter
    emits('update:items', props.items.map(item => ({ ...item, inactive: false })));
  }
  else {
    // apply selection, set other item as inactive
    emits('update:items', props.items.map(item => item.name === d.name ? ({ ...d, inactive: false }) : { ...item, inactive: true }));
  }
  keepStyling();
}

// Adicionando informações para legendas
const legendItems = computed(() => {
  return pieData.value.map((item, index) => ({
    name: item.name,
    color: COLORS[index % COLORS.length],
    value: item.value,
    percentage: (item.value / total.value) * 100
  }));
});

// Ciclo de vida do componente
onMounted(() => {
  keepStyling();
  resizeChart();
  setupResizeObserver();
});

watch(() => props.data, () => {
  nextTick(keepStyling);
}, { deep: true });

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Gráfico donut usando SVG puro -->
    <div ref="containerRef" class="flex-grow relative">
      <div v-if="pieData.length === 0" class="h-full w-full flex items-center justify-center">
        <div class="text-center">
          <PieChart class="h-12 w-12 mx-auto mb-2 opacity-20 text-gray-400" />
          <p class="text-sm text-gray-500">Sem dados para exibir</p>
        </div>
      </div>

      <div v-else class="flex flex-col h-full">
        <!-- SVG contendo o gráfico de donut -->
        <div class="flex-1 flex justify-center items-center min-h-[160px]">
          <svg ref="svgRef" :width="svgSize.width" :height="svgSize.height" class="max-w-full max-h-full">
            <!-- Arcos do gráfico -->
            <g>
              <path
                v-for="(arc, index) in arcs"
                :key="`arc-${index}`"
                :d="arc.path"
                :fill="arc.color"
                stroke="white"
                stroke-width="1"
                class="transition-opacity duration-300 hover:opacity-80"
              />
            </g>

            <!-- Rótulos - agora condicionalmente exibidos -->
            <g v-if="props.showLabels">
              <text
                v-for="(arc, index) in arcs"
                :key="`label-${index}`"
                :x="arc.labelPos.x"
                :y="arc.labelPos.y"
                :text-anchor="arc.textAnchor"
                fill="white"
                font-size="11px"
                font-weight="bold"
                dominant-baseline="middle"
                style="text-shadow: 0px 0px 2px rgba(0,0,0,0.5);"
                v-show="arc.percentage > 0.05"
              >
                {{ getLabelText(arc) }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo para o gráfico e legendas */
.legend-item {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #f9fafb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #f3f4f6;
  white-space: nowrap;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 0.35rem;
  border-radius: 2px;
}

/* Ajustes para garantir espaço suficiente para o donut e legendas */
svg {
  display: block;
  margin: 0 auto;
}

/* Estilo específico para mobile */
@media (max-width: 640px) {
  .flex-1.flex svg {
    max-height: 180px;
  }
}
</style>
