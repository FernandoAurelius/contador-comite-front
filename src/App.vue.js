import { defineComponent } from 'vue';
import { BarChart2, Home, BarChart, FileText, Settings, Menu, X, Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import DayModal from '@/components/DayModal.vue';
import Sonner from './components/ui/sonner/Sonner.vue';
import { useAuthStore } from './stores/auth';
import { mapState } from 'pinia';
export default defineComponent({
    name: 'App',
    components: {
        BarChart2, Home, BarChart, FileText, Settings, Menu, X, Plus, Button, DayModal, Sonner
    },
    data() {
        return {
            isMobileMenuOpen: false,
            isDayModalOpen: false,
            selectedDay: new Date(),
            navItems: [
                { title: 'Início', path: '/' },
                { title: 'Vendas', path: '/vendas' },
                { title: 'Relatórios', path: '/relatorios' }
            ],
            mobileNavItems: [
                { title: 'Início', path: '/', icon: Home },
                { title: 'Dashboard', path: '/dashboard', icon: BarChart },
                { title: 'Relatórios', path: '/relatorios', icon: FileText },
                { title: 'Vendas', path: '/vendas', icon: Settings }
            ]
        };
    },
    methods: {
        openAddModal() {
            this.selectedDay = new Date();
            this.isDayModalOpen = true;
        },
        closeDayModal(value) {
            this.isDayModalOpen = value;
        },
        handleSave() {
            this.isDayModalOpen = false;
        },
        setFavicon() {
            // Criamos um favicon dinâmico baseado no ícone BarChart2
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Estilo similar ao BarChart2 da biblioteca Lucide
                ctx.fillStyle = '#10b981'; // cor emerald-600
                // Desenhando as barras do gráfico (similar ao BarChart2)
                // Primeira barra
                ctx.fillRect(6, 22, 4, 6);
                // Segunda barra
                ctx.fillRect(14, 16, 4, 12);
                // Terceira barra
                ctx.fillRect(22, 8, 4, 20);
                // Convertendo para URL de dados e definindo como favicon
                const dataUrl = canvas.toDataURL('image/png');
                let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = dataUrl;
                document.head.appendChild(link);
            }
        }
    },
    computed: {
        ...mapState(useAuthStore, ["logged"]),
    },
    mounted() {
        this.setFavicon();
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    BarChart2, Home, BarChart, FileText, Settings, Menu, X, Plus, Button, DayModal, Sonner
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Sonner;
/** @type {[typeof __VLS_components.Sonner, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen bg-gray-50" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "bg-white border-b sticky top-0 z-30" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container mx-auto px-4 py-3 flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center" },
});
const __VLS_4 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    to: "/",
    ...{ class: "flex items-center space-x-2" },
}));
const __VLS_6 = __VLS_5({
    to: "/",
    ...{ class: "flex items-center space-x-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.BarChart2;
/** @type {[typeof __VLS_components.BarChart2, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "h-6 w-6 text-emerald-600" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "h-6 w-6 text-emerald-600" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-bold text-lg" },
});
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "hidden md:flex items-center space-x-1" },
});
if (__VLS_ctx.logged) {
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.navItems))) {
        const __VLS_12 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            key: (item.path),
            to: (item.path),
            ...{ class: "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100" },
            ...{ class: (__VLS_ctx.$route.path === item.path ? 'text-emerald-600' : 'text-gray-700') },
        }));
        const __VLS_14 = __VLS_13({
            key: (item.path),
            to: (item.path),
            ...{ class: "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100" },
            ...{ class: (__VLS_ctx.$route.path === item.path ? 'text-emerald-600' : 'text-gray-700') },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        __VLS_15.slots.default;
        (item.title);
        var __VLS_15;
    }
}
const __VLS_16 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "md:hidden" },
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    variant: "ghost",
    size: "icon",
    ...{ class: "md:hidden" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isMobileMenuOpen = !__VLS_ctx.isMobileMenuOpen;
    }
};
__VLS_19.slots.default;
if (!__VLS_ctx.isMobileMenuOpen) {
    const __VLS_24 = {}.Menu;
    /** @type {[typeof __VLS_components.Menu, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ class: "h-5 w-5" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "h-5 w-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
}
else {
    const __VLS_28 = {}.X;
    /** @type {[typeof __VLS_components.X, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ class: "h-5 w-5" },
    }));
    const __VLS_30 = __VLS_29({
        ...{ class: "h-5 w-5" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_19;
if (__VLS_ctx.isMobileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "md:hidden bg-white border-t" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "container mx-auto px-4 py-2 space-y-1" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.navItems))) {
        const __VLS_32 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            ...{ 'onClick': {} },
            key: (item.path),
            to: (item.path),
            ...{ class: "block px-3 py-2 rounded-md text-base font-medium" },
            ...{ class: (__VLS_ctx.$route.path === item.path ? 'bg-gray-100 text-emerald-600' : 'text-gray-700') },
        }));
        const __VLS_34 = __VLS_33({
            ...{ 'onClick': {} },
            key: (item.path),
            to: (item.path),
            ...{ class: "block px-3 py-2 rounded-md text-base font-medium" },
            ...{ class: (__VLS_ctx.$route.path === item.path ? 'bg-gray-100 text-emerald-600' : 'text-gray-700') },
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        let __VLS_36;
        let __VLS_37;
        let __VLS_38;
        const __VLS_39 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isMobileMenuOpen))
                    return;
                __VLS_ctx.isMobileMenuOpen = false;
            }
        };
        __VLS_35.slots.default;
        (item.title);
        var __VLS_35;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "pb-20 md:pb-10" },
});
const __VLS_40 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
{
    const { default: __VLS_thisSlot } = __VLS_43.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_44 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        name: "fade",
        mode: "out-in",
    }));
    const __VLS_46 = __VLS_45({
        name: "fade",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = ((Component));
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
    const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
    var __VLS_47;
    __VLS_43.slots['' /* empty slot name completion */];
}
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "border-t bg-white py-6 hidden md:block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container mx-auto px-4 text-center text-sm text-gray-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(new Date().getFullYear());
if (__VLS_ctx.logged) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-around py-2" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.mobileNavItems))) {
        const __VLS_52 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            key: (item.path),
            to: (item.path),
            ...{ class: "flex flex-col items-center px-3 py-1" },
            ...{ class: (__VLS_ctx.$route.path === item.path ? 'text-emerald-600' : 'text-gray-700') },
        }));
        const __VLS_54 = __VLS_53({
            key: (item.path),
            to: (item.path),
            ...{ class: "flex flex-col items-center px-3 py-1" },
            ...{ class: (__VLS_ctx.$route.path === item.path ? 'text-emerald-600' : 'text-gray-700') },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        __VLS_55.slots.default;
        const __VLS_56 = ((item.icon));
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            ...{ class: "h-5 w-5" },
        }));
        const __VLS_58 = __VLS_57({
            ...{ class: "h-5 w-5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs mt-1" },
        });
        (item.title);
        var __VLS_55;
    }
}
if (__VLS_ctx.logged) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed bottom-16 right-4 md:hidden" },
    });
    const __VLS_60 = {}.Button;
    /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        size: "lg",
        ...{ class: "rounded-full h-14 w-14 shadow-lg" },
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        size: "lg",
        ...{ class: "rounded-full h-14 w-14 shadow-lg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (__VLS_ctx.openAddModal)
    };
    __VLS_63.slots.default;
    const __VLS_68 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ class: "h-6 w-6" },
    }));
    const __VLS_70 = __VLS_69({
        ...{ class: "h-6 w-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sr-only" },
    });
    var __VLS_63;
}
if (__VLS_ctx.isDayModalOpen) {
    const __VLS_72 = {}.DayModal;
    /** @type {[typeof __VLS_components.DayModal, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ 'onUpdate:isOpen': {} },
        ...{ 'onSave': {} },
        date: (__VLS_ctx.selectedDay),
        isOpen: (__VLS_ctx.isDayModalOpen),
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onUpdate:isOpen': {} },
        ...{ 'onSave': {} },
        date: (__VLS_ctx.selectedDay),
        isOpen: (__VLS_ctx.isDayModalOpen),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    let __VLS_78;
    const __VLS_79 = {
        'onUpdate:isOpen': (__VLS_ctx.closeDayModal)
    };
    const __VLS_80 = {
        onSave: (__VLS_ctx.handleSave)
    };
    var __VLS_75;
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['sticky']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-30']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-emerald-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['md:pb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:block']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['z-30']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-around']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-16']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-14']} */ ;
/** @type {__VLS_StyleScopedClasses['w-14']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=App.vue.js.map