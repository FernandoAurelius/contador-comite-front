import { defineComponent, ref, computed, watch } from 'vue';
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
import { toast } from 'vue-sonner';
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
            type: Object,
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
        const loadedVendas = ref({});
        const loadedCustomVendas = ref({});
        const initialItemValues = ref({});
        const initialCustomItems = ref([]);
        const hasChanges = computed(() => {
            const standardItemsChanged = items.value.some(item => {
                return item.count !== (initialItemValues.value[item.id] || 0);
            });
            const customItemsChanged = customItems.value.length !== initialCustomItems.value.length ||
                customItems.value.some((item, idx) => {
                    if (idx >= initialCustomItems.value.length)
                        return true;
                    return item.count !== initialCustomItems.value[idx].count ||
                        item.name !== initialCustomItems.value[idx].name ||
                        item.price !== initialCustomItems.value[idx].price;
                });
            return standardItemsChanged || customItemsChanged;
        });
        const items = ref([
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
        const customItems = ref([]);
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
        const formatDate = (date, formatStr) => {
            return format(date, formatStr, { locale: ptBR });
        };
        const formatCurrency = (value) => {
            return value.toFixed(2).replace('.', ',');
        };
        const formatDateStr = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };
        const formatDateForBackend = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };
        const handleIncrement = (id) => {
            items.value = items.value.map(item => {
                if (item.id === id) {
                    return { ...item, count: item.count + 1 };
                }
                return item;
            });
        };
        const handleDecrement = async (id) => {
            const item = items.value.find(item => item.id === id);
            if (!item || item.count <= 0)
                return;
            const itemType = ITEM_TYPE_MAPPING[id];
            if (loadedVendas.value[itemType] && loadedVendas.value[itemType].length > 0) {
                const vendaToDelete = loadedVendas.value[itemType].pop();
                if (vendaToDelete) {
                    try {
                        await vendaService.deleteVenda(vendaToDelete.id);
                    }
                    catch (error) {
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
        const handleIncrementCustom = (id) => {
            customItems.value = customItems.value.map(item => {
                if (item.id === id) {
                    return { ...item, count: item.count + 1 };
                }
                return item;
            });
        };
        const handleDecrementCustom = async (id) => {
            const item = customItems.value.find(item => item.id === id);
            if (!item || item.count <= 0)
                return;
            const itemName = item.name;
            if (loadedCustomVendas.value[itemName] && loadedCustomVendas.value[itemName].length > 0) {
                const vendaToDelete = loadedCustomVendas.value[itemName].pop();
                if (vendaToDelete) {
                    try {
                        await vendaService.deleteVenda(vendaToDelete.id);
                    }
                    catch (error) {
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
            if (customItemName.value.trim() && Number.parseFloat(customItemPrice.value) > 0) {
                const newItem = {
                    id: `custom-${Date.now()}`,
                    name: customItemName.value.trim(),
                    icon: Plus,
                    count: 0,
                    price: Number.parseFloat(customItemPrice.value),
                };
                customItems.value.push(newItem);
                customItemName.value = '';
                customItemPrice.value = '';
            }
        };
        const loadDayVendas = async () => {
            if (!props.date)
                return;
            loading.value = true;
            try {
                const dateStr = formatDateStr(props.date);
                const dayVendas = await vendaService.getVendaByDate(dateStr);
                items.value = items.value.map(item => ({ ...item, count: 0 }));
                customItems.value = [];
                loadedVendas.value = {};
                loadedCustomVendas.value = {};
                if (dayVendas && dayVendas.length > 0) {
                    const isTroteVendas = dayVendas.some(v => v.itemType === 'CARTELA_BINGO' ||
                        v.itemType === 'CORREIO_ELEGANTE' ||
                        v.itemType === 'CADEIA_DO_AMOR' ||
                        (v.notes && v.notes.toLowerCase().includes('trote')));
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
                            }
                            else {
                                customItems.value.push({
                                    id: `custom-${Date.now()}-${customItems.value.length}`,
                                    name: itemName,
                                    icon: Plus,
                                    count: venda.quantity,
                                    price: venda.unitPrice || 0
                                });
                            }
                        }
                        else {
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
                    initialItemValues.value = Object.fromEntries(items.value.map(item => [item.id, item.count]));
                    initialCustomItems.value = JSON.parse(JSON.stringify(customItems.value));
                }
                else {
                    initialItemValues.value = Object.fromEntries(items.value.map(item => [item.id, 0]));
                    initialCustomItems.value = [];
                }
            }
            catch (error) {
                console.error('Erro ao carregar vendas do dia:', error);
                toast.error("Erro ao carregar vendas");
            }
            finally {
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
                        const loadedCount = (loadedVendas.value[itemType] || []).reduce((sum, v) => sum + v.quantity, 0);
                        if (item.count > loadedCount) {
                            const newCount = item.count - loadedCount;
                            const venda = {
                                date: formatDateForBackend(props.date),
                                itemType: itemType,
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
                            }
                            catch (error) {
                                console.error(`Erro ao salvar item ${item.id}:`, error);
                                vendaPromises.push(Promise.reject(error));
                            }
                        }
                    }
                }
                for (const item of customItems.value) {
                    if (item.count > 0) {
                        const loadedCount = (loadedCustomVendas.value[item.name] || []).reduce((sum, v) => sum + v.quantity, 0);
                        if (item.count > loadedCount) {
                            const newCount = item.count - loadedCount;
                            const venda = {
                                date: formatDateForBackend(props.date),
                                itemType: "OUTROS",
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
                            }
                            catch (error) {
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
                initialItemValues.value = Object.fromEntries(items.value.map(item => [item.id, item.count]));
                initialCustomItems.value = JSON.parse(JSON.stringify(customItems.value));
                emit('save', saleData);
                emit('update:is-open', false);
            }
            catch (error) {
                console.error('Erro ao salvar vendas:', error);
                toast.error("Erro ao salvar vendas");
            }
            finally {
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
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    X, Coffee, Droplet, IceCream, Ticket, Heart, Mail, Plus, PieChart,
    Button, Input, Label, Switch, Separator, Tabs, TabsContent, TabsList, TabsTrigger,
    BarChart,
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['modal-fade-enter-from']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-fade-leave-to']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-fade-enter-from']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-fade-leave-to']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-fade-enter-active']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-fade-leave-active']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
const __VLS_2 = __VLS_1({
    to: "body",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    name: "modal-fade",
}));
const __VLS_6 = __VLS_5({
    name: "modal-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
if (__VLS_ctx.isOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.onClose) },
        ...{ class: "fixed inset-0 bg-black/50 flex items-center justify-center p-0 sm:p-4 z-50" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: () => { } },
        ...{ class: "\u0062\u0067\u002d\u0077\u0068\u0069\u0074\u0065\u0020\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0074\u002d\u0078\u006c\u0020\u0073\u006d\u003a\u0072\u006f\u0075\u006e\u0064\u0065\u0064\u002d\u0078\u006c\u0020\u0073\u0068\u0061\u0064\u006f\u0077\u002d\u0078\u006c\u0020\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u0068\u002d\u005b\u0039\u0030\u0076\u0068\u005d\u0020\u0073\u006d\u003a\u0068\u002d\u0061\u0075\u0074\u006f\u0020\u0073\u006d\u003a\u006d\u0061\u0078\u002d\u0077\u002d\u006d\u0064\u000a\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u006f\u0076\u0065\u0072\u0066\u006c\u006f\u0077\u002d\u0068\u0069\u0064\u0064\u0065\u006e\u0020\u006d\u0061\u0078\u002d\u0068\u002d\u005b\u0039\u0030\u0076\u0068\u005d\u0020\u0073\u006d\u003a\u006d\u0061\u0078\u002d\u0068\u002d\u005b\u0038\u0035\u0076\u0068\u005d\u0020\u006f\u0076\u0065\u0072\u0066\u006c\u006f\u0077\u002d\u0079\u002d\u0061\u0075\u0074\u006f\u0020\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u0062\u006f\u0074\u0074\u006f\u006d\u002d\u0030\u0020\u0073\u006d\u003a\u0072\u0065\u006c\u0061\u0074\u0069\u0076\u0065" },
        ...{ class: ({ 'scale-100': __VLS_ctx.isOpen, 'translate-y-0': __VLS_ctx.isOpen }) },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2 mb-1 sm:hidden" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-4 sm:p-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center mb-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg sm:text-xl font-bold" },
    });
    (__VLS_ctx.formatDate(__VLS_ctx.date, "EEEE, dd 'de' MMMM"));
    const __VLS_8 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        variant: "ghost",
        size: "icon",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.onClose)
    };
    __VLS_11.slots.default;
    const __VLS_16 = {}.X;
    /** @type {[typeof __VLS_components.X, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ class: "h-5 w-5" },
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "h-5 w-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sr-only" },
    });
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-2 mb-4 sm:mb-6" },
    });
    const __VLS_20 = {}.Switch;
    /** @type {[typeof __VLS_components.Switch, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        id: "trote-day",
        modelValue: (__VLS_ctx.isTroteDay),
    }));
    const __VLS_22 = __VLS_21({
        id: "trote-day",
        modelValue: (__VLS_ctx.isTroteDay),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    const __VLS_24 = {}.Label;
    /** @type {[typeof __VLS_components.Label, typeof __VLS_components.Label, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        for: "trote-day",
    }));
    const __VLS_26 = __VLS_25({
        for: "trote-day",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
    const __VLS_28 = {}.Tabs;
    /** @type {[typeof __VLS_components.Tabs, typeof __VLS_components.Tabs, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        defaultValue: "items",
        ...{ class: "space-y-4" },
    }));
    const __VLS_30 = __VLS_29({
        defaultValue: "items",
        ...{ class: "space-y-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.TabsList;
    /** @type {[typeof __VLS_components.TabsList, typeof __VLS_components.TabsList, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ class: "grid w-full grid-cols-2" },
    }));
    const __VLS_34 = __VLS_33({
        ...{ class: "grid w-full grid-cols-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.TabsTrigger;
    /** @type {[typeof __VLS_components.TabsTrigger, typeof __VLS_components.TabsTrigger, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        value: "items",
        ...{ class: "text-sm" },
    }));
    const __VLS_38 = __VLS_37({
        value: "items",
        ...{ class: "text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    const __VLS_40 = {}.TabsTrigger;
    /** @type {[typeof __VLS_components.TabsTrigger, typeof __VLS_components.TabsTrigger, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        value: "chart",
        ...{ class: "text-sm" },
    }));
    const __VLS_42 = __VLS_41({
        value: "chart",
        ...{ class: "text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    var __VLS_43;
    var __VLS_35;
    const __VLS_44 = {}.TabsContent;
    /** @type {[typeof __VLS_components.TabsContent, typeof __VLS_components.TabsContent, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        value: "items",
        ...{ class: "space-y-4 pt-2" },
    }));
    const __VLS_46 = __VLS_45({
        value: "items",
        ...{ class: "space-y-4 pt-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-medium text-gray-700" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.items))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (item.id),
            ...{ class: "flex items-center justify-between py-2" },
            ...{ class: ({ 'hidden': item.isTroteItem && !__VLS_ctx.isTroteDay }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-2" },
        });
        const __VLS_48 = ((item.icon));
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            ...{ class: "h-4 w-4" },
        }));
        const __VLS_50 = __VLS_49({
            ...{ class: "h-4 w-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-xs text-gray-500" },
        });
        (item.price.toFixed(2));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center gap-2" },
        });
        const __VLS_52 = {}.Button;
        /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
            ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
            disabled: (item.count === 0),
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
            ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
            disabled: (item.count === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_56;
        let __VLS_57;
        let __VLS_58;
        const __VLS_59 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isOpen))
                    return;
                __VLS_ctx.handleDecrement(item.id);
            }
        };
        __VLS_55.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        var __VLS_55;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "w-8 text-center" },
        });
        (item.count);
        const __VLS_60 = {}.Button;
        /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
            ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "icon",
            ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isOpen))
                    return;
                __VLS_ctx.handleIncrement(item.id);
            }
        };
        __VLS_63.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        var __VLS_63;
    }
    if (__VLS_ctx.customItems.length > 0) {
        const __VLS_68 = {}.Separator;
        /** @type {[typeof __VLS_components.Separator, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            ...{ class: "my-4" },
        }));
        const __VLS_70 = __VLS_69({
            ...{ class: "my-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "font-medium text-gray-700" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.customItems))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (item.id),
                ...{ class: "flex items-center justify-between py-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-center gap-2" },
            });
            const __VLS_72 = ((item.icon));
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                ...{ class: "h-4 w-4" },
            }));
            const __VLS_74 = __VLS_73({
                ...{ class: "h-4 w-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_73));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "text-xs text-gray-500" },
            });
            (item.price.toFixed(2));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex items-center gap-2" },
            });
            const __VLS_76 = {}.Button;
            /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
            // @ts-ignore
            const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                ...{ 'onClick': {} },
                variant: "outline",
                size: "icon",
                ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
                disabled: (item.count === 0),
            }));
            const __VLS_78 = __VLS_77({
                ...{ 'onClick': {} },
                variant: "outline",
                size: "icon",
                ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
                disabled: (item.count === 0),
            }, ...__VLS_functionalComponentArgsRest(__VLS_77));
            let __VLS_80;
            let __VLS_81;
            let __VLS_82;
            const __VLS_83 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isOpen))
                        return;
                    if (!(__VLS_ctx.customItems.length > 0))
                        return;
                    __VLS_ctx.handleDecrementCustom(item.id);
                }
            };
            __VLS_79.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            var __VLS_79;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "w-8 text-center" },
            });
            (item.count);
            const __VLS_84 = {}.Button;
            /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
            // @ts-ignore
            const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                ...{ 'onClick': {} },
                variant: "outline",
                size: "icon",
                ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
            }));
            const __VLS_86 = __VLS_85({
                ...{ 'onClick': {} },
                variant: "outline",
                size: "icon",
                ...{ class: "h-10 w-10 sm:h-8 sm:w-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_85));
            let __VLS_88;
            let __VLS_89;
            let __VLS_90;
            const __VLS_91 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isOpen))
                        return;
                    if (!(__VLS_ctx.customItems.length > 0))
                        return;
                    __VLS_ctx.handleIncrementCustom(item.id);
                }
            };
            __VLS_87.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            var __VLS_87;
        }
    }
    const __VLS_92 = {}.Separator;
    /** @type {[typeof __VLS_components.Separator, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ class: "my-4" },
    }));
    const __VLS_94 = __VLS_93({
        ...{ class: "my-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-1 sm:grid-cols-3 gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sm:col-span-2" },
    });
    const __VLS_96 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        placeholder: "Adicionar outro item...",
        modelValue: (__VLS_ctx.customItemName),
    }));
    const __VLS_98 = __VLS_97({
        placeholder: "Adicionar outro item...",
        modelValue: (__VLS_ctx.customItemName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_100 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        placeholder: "Preço",
        inputmode: "decimal",
        modelValue: (__VLS_ctx.customItemPrice),
    }));
    const __VLS_102 = __VLS_101({
        placeholder: "Preço",
        inputmode: "decimal",
        modelValue: (__VLS_ctx.customItemPrice),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    const __VLS_104 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.customItemName.trim() || !(Number.parseFloat(__VLS_ctx.customItemPrice) > 0)),
        ...{ class: "w-full py-6 sm:py-2" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.customItemName.trim() || !(Number.parseFloat(__VLS_ctx.customItemPrice) > 0)),
        ...{ class: "w-full py-6 sm:py-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (__VLS_ctx.handleAddCustomItem)
    };
    __VLS_107.slots.default;
    const __VLS_112 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ class: "h-4 w-4 mr-1" },
    }));
    const __VLS_114 = __VLS_113({
        ...{ class: "h-4 w-4 mr-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    var __VLS_107;
    var __VLS_47;
    const __VLS_116 = {}.TabsContent;
    /** @type {[typeof __VLS_components.TabsContent, typeof __VLS_components.TabsContent, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        value: "chart",
    }));
    const __VLS_118 = __VLS_117({
        value: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-medium text-gray-700" },
    });
    const __VLS_120 = {}.PieChart;
    /** @type {[typeof __VLS_components.PieChart, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ class: "h-5 w-5 text-gray-500" },
    }));
    const __VLS_122 = __VLS_121({
        ...{ class: "h-5 w-5 text-gray-500" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-[30vh] sm:h-[35vh] mx-auto overflow-hidden" },
    });
    if (__VLS_ctx.totalSales > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "h-full w-full" },
        });
        const __VLS_124 = {}.BarChart;
        /** @type {[typeof __VLS_components.BarChart, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            index: "id",
            data: (__VLS_ctx.chartData),
            categories: (['value']),
            yFormatter: ((tick) => `R$ ${typeof tick === 'number' ? tick.toFixed(2) : ''}`),
            colors: (['rgba(75, 192, 192, 0.6)']),
            roundedCorners: (4),
            ...{ class: "h-full max-h-full" },
        }));
        const __VLS_126 = __VLS_125({
            index: "id",
            data: (__VLS_ctx.chartData),
            categories: (['value']),
            yFormatter: ((tick) => `R$ ${typeof tick === 'number' ? tick.toFixed(2) : ''}`),
            colors: (['rgba(75, 192, 192, 0.6)']),
            roundedCorners: (4),
            ...{ class: "h-full max-h-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "h-full flex items-center justify-center text-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-gray-500" },
        });
        const __VLS_128 = {}.PieChart;
        /** @type {[typeof __VLS_components.PieChart, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            ...{ class: "h-12 w-12 mx-auto mb-2 opacity-20" },
        }));
        const __VLS_130 = __VLS_129({
            ...{ class: "h-12 w-12 mx-auto mb-2 opacity-20" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 p-4 rounded-lg" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-gray-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-bold" },
    });
    (__VLS_ctx.formatCurrency(__VLS_ctx.totalSales));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-gray-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-bold" },
    });
    ([...__VLS_ctx.items, ...__VLS_ctx.customItems].filter(item => item.count > 0).length);
    var __VLS_119;
    var __VLS_31;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 px-6 py-4 sm:flex justify-end sticky bottom-0 left-0 right-0 shadow-md sm:shadow-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-2 sm:flex sm:grid-cols-none gap-2" },
    });
    const __VLS_132 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: "w-full sm:w-auto" },
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        variant: "outline",
        ...{ class: "w-full sm:w-auto" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (__VLS_ctx.onClose)
    };
    __VLS_135.slots.default;
    var __VLS_135;
    const __VLS_140 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.totalSales <= 0 || !__VLS_ctx.hasChanges),
        ...{ class: "w-full sm:w-auto" },
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.totalSales <= 0 || !__VLS_ctx.hasChanges),
        ...{ class: "w-full sm:w-auto" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_143.slots.default;
    (__VLS_ctx.hasChanges ? 'Salvar' : 'Fechar');
    var __VLS_143;
}
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[90vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[90vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:max-h-[85vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:relative']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-100']} */ ;
/** @type {__VLS_StyleScopedClasses['translate-y-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[30vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-[35vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-20']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:shadow-none']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-none']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=DayModal.vue.js.map