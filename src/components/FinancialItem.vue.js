import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, ShoppingCart, Coffee, IceCream, Droplet, Ticket, Mail, Heart, CreditCard, Receipt, Package, Edit, Trash } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export default (await import('vue')).defineComponent({
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
            validator: (value) => ['sale', 'expense'].includes(value)
        }
    },
    emits: ['edit', 'delete'],
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy', { locale: ptBR });
        },
        formatCurrency(value) {
            return value.toFixed(2).replace('.', ',');
        },
        getIcon() {
            if (this.type === 'expense') {
                return CreditCard;
            }
            // Para vendas, determina o ícone baseado no tipo de item
            const itemType = this.item.itemType;
            const iconMap = {
                'REFRI_COPO': Droplet,
                'REFRI_GARRAFA': Coffee,
                'PICOLE': IceCream,
                'CARTELA_BINGO': Ticket,
                'CORREIO_ELEGANTE': Mail,
                'OUTROS': Package
            };
            return iconMap[itemType] || ShoppingCart;
        },
        getTypeName() {
            if (this.type === 'expense') {
                return 'Despesa';
            }
            // Para vendas, traduz o tipo de item
            const itemType = this.item.itemType;
            const typeMap = {
                'REFRI_COPO': 'Refri (copo)',
                'REFRI_GARRAFA': 'Refri (garrafa)',
                'PICOLE': 'Picolé',
                'CARTELA_BINGO': 'Cartela de Bingo',
                'CORREIO_ELEGANTE': 'Correio Elegante',
                'OUTROS': 'Outros'
            };
            return typeMap[itemType] || 'Venda';
        },
        getTypeBadgeVariant() {
            // Usar apenas variantes válidos do Badge
            return this.type === 'expense' ? 'destructive' : 'default';
        },
        getTypeColorClass() {
            return this.type === 'expense'
                ? 'bg-red-50 border-red-100'
                : 'bg-blue-50 border-blue-100';
        },
        getItemTitle() {
            if (this.type === 'expense') {
                return this.item.item;
            }
            return this.getTypeName();
        },
        getItemValue() {
            if (this.type === 'expense') {
                return this.item.totalCost;
            }
            return this.item.totalPrice;
        },
        getValueLabel() {
            return this.type === 'expense' ? 'Custo' : 'Valor';
        }
    }
});
const __VLS_ctx = {};
const __VLS_componentsOption = {
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
};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Card;
/** @type {[typeof __VLS_components.Card, typeof __VLS_components.Card, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "h-full overflow-hidden hover:shadow-md transition-shadow duration-200" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "h-full overflow-hidden hover:shadow-md transition-shadow duration-200" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.CardContent;
/** @type {[typeof __VLS_components.CardContent, typeof __VLS_components.CardContent, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "p-0" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "p-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col h-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4 flex justify-between items-center border-b" },
    ...{ class: (__VLS_ctx.getTypeColorClass()) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center" },
});
const __VLS_9 = ((__VLS_ctx.getIcon()));
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "h-5 w-5 mr-2" },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "h-5 w-5 mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-medium text-sm" },
});
(__VLS_ctx.formatDate(__VLS_ctx.item.date));
const __VLS_13 = {}.Badge;
/** @type {[typeof __VLS_components.Badge, typeof __VLS_components.Badge, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    variant: (__VLS_ctx.getTypeBadgeVariant()),
}));
const __VLS_15 = __VLS_14({
    variant: (__VLS_ctx.getTypeBadgeVariant()),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
(__VLS_ctx.getTypeName());
var __VLS_16;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4 flex-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-medium" },
});
(__VLS_ctx.getItemTitle());
if (__VLS_ctx.item.notes) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-sm text-gray-500" },
    });
    (__VLS_ctx.item.notes);
}
if (__VLS_ctx.type === 'expense' && __VLS_ctx.item.quantity) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-sm text-gray-600" },
    });
    (__VLS_ctx.item.quantity);
    (__VLS_ctx.formatCurrency(__VLS_ctx.item.unitCost));
}
if (__VLS_ctx.type === 'sale' && __VLS_ctx.item.quantity) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-sm text-gray-600" },
    });
    (__VLS_ctx.item.quantity);
    (__VLS_ctx.formatCurrency(__VLS_ctx.item.unitPrice));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-4 bg-gray-50 border-t flex justify-between items-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-bold" },
});
(__VLS_ctx.getValueLabel());
(__VLS_ctx.formatCurrency(__VLS_ctx.getItemValue()));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_17 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('edit', __VLS_ctx.item);
    }
};
__VLS_20.slots.default;
const __VLS_25 = {}.Edit;
/** @type {[typeof __VLS_components.Edit, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    ...{ class: "h-4 w-4" },
}));
const __VLS_27 = __VLS_26({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only" },
});
var __VLS_20;
const __VLS_29 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "text-red-500" },
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "text-red-500" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$emit('delete', __VLS_ctx.item);
    }
};
__VLS_32.slots.default;
const __VLS_37 = {}.Trash;
/** @type {[typeof __VLS_components.Trash, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    ...{ class: "h-4 w-4" },
}));
const __VLS_39 = __VLS_38({
    ...{ class: "h-4 w-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "sr-only" },
});
var __VLS_32;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=FinancialItem.vue.js.map