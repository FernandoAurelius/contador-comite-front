import authService from '@/api/authService';
import Button from '@/components/ui/button/Button.vue';
import { FormField, FormLabel, FormControl, FormMessage, FormItem } from '@/components/ui/form';
import Input from '@/components/ui/input/Input.vue';
import { useAuthStore } from '@/stores/auth';
import { registerFormSchema } from '@/types/RegisterForm';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next';
import { defineComponent } from 'vue';
export default defineComponent({
    name: "RegisterForm",
    data() {
        const schema = toTypedSchema(registerFormSchema);
        return {
            form: useForm({ validationSchema: schema }),
            registerError: false
        };
    },
    methods: {
        async onSubmit(event) {
            event.preventDefault();
            this.form.handleSubmit(async (values) => {
                try {
                    console.log("Tentando registrar usuário...");
                    await authService.register(values.name, values.email, values.password);
                    const store = useAuthStore();
                    store.registered = true;
                    this.$router.push("/login");
                }
                catch (error) {
                    this.registerError = true;
                }
            })();
        }
    },
    components: {
        Button,
        FormField,
        FormLabel,
        FormControl,
        FormMessage,
        FormItem,
        Input,
        Alert,
        AlertTitle,
        AlertDescription,
        AlertCircle
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    Button,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
    FormItem,
    Input,
    Alert,
    AlertTitle,
    AlertDescription,
    AlertCircle
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.onSubmit) },
    ...{ class: "flex flex-col justify-center gap-4 w-full h-full rounded-b-none" },
});
const __VLS_0 = {}.FormField;
/** @type {[typeof __VLS_components.FormField, typeof __VLS_components.FormField, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "name",
}));
const __VLS_2 = __VLS_1({
    name: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
{
    const { default: __VLS_thisSlot } = __VLS_3.slots;
    const [{ componentField }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_4 = {}.FormItem;
    /** @type {[typeof __VLS_components.FormItem, typeof __VLS_components.FormItem, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative block w-full" },
    });
    const __VLS_8 = {}.FormLabel;
    /** @type {[typeof __VLS_components.FormLabel, typeof __VLS_components.FormLabel, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_12 = {}.FormControl;
    /** @type {[typeof __VLS_components.FormControl, typeof __VLS_components.FormControl, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        type: "name",
        placeholder: "Miguel Fernando (ou floresz)",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }));
    const __VLS_18 = __VLS_17({
        type: "name",
        placeholder: "Miguel Fernando (ou floresz)",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    var __VLS_15;
    const __VLS_20 = {}.FormMessage;
    /** @type {[typeof __VLS_components.FormMessage, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "text-xs md:text-sm mt-1" },
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "text-xs md:text-sm mt-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    var __VLS_7;
    __VLS_3.slots['' /* empty slot name completion */];
}
var __VLS_3;
const __VLS_24 = {}.FormField;
/** @type {[typeof __VLS_components.FormField, typeof __VLS_components.FormField, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    name: "email",
}));
const __VLS_26 = __VLS_25({
    name: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
{
    const { default: __VLS_thisSlot } = __VLS_27.slots;
    const [{ componentField }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_28 = {}.FormItem;
    /** @type {[typeof __VLS_components.FormItem, typeof __VLS_components.FormItem, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }));
    const __VLS_30 = __VLS_29({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative block w-full" },
    });
    const __VLS_32 = {}.FormLabel;
    /** @type {[typeof __VLS_components.FormLabel, typeof __VLS_components.FormLabel, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }));
    const __VLS_34 = __VLS_33({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    var __VLS_35;
    const __VLS_36 = {}.FormControl;
    /** @type {[typeof __VLS_components.FormControl, typeof __VLS_components.FormControl, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    const __VLS_40 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        type: "email",
        placeholder: "m@exemplo.com",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }));
    const __VLS_42 = __VLS_41({
        type: "email",
        placeholder: "m@exemplo.com",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    var __VLS_39;
    const __VLS_44 = {}.FormMessage;
    /** @type {[typeof __VLS_components.FormMessage, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ class: "text-xs md:text-sm mt-1" },
    }));
    const __VLS_46 = __VLS_45({
        ...{ class: "text-xs md:text-sm mt-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    var __VLS_31;
    __VLS_27.slots['' /* empty slot name completion */];
}
var __VLS_27;
const __VLS_48 = {}.FormField;
/** @type {[typeof __VLS_components.FormField, typeof __VLS_components.FormField, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    name: "password",
}));
const __VLS_50 = __VLS_49({
    name: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ componentField }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.FormItem;
    /** @type {[typeof __VLS_components.FormItem, typeof __VLS_components.FormItem, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }));
    const __VLS_54 = __VLS_53({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative block w-full" },
    });
    const __VLS_56 = {}.FormLabel;
    /** @type {[typeof __VLS_components.FormLabel, typeof __VLS_components.FormLabel, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }));
    const __VLS_58 = __VLS_57({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    var __VLS_59;
    const __VLS_60 = {}.FormControl;
    /** @type {[typeof __VLS_components.FormControl, typeof __VLS_components.FormControl, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
    const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        type: "password",
        placeholder: "Bingo#123",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }));
    const __VLS_66 = __VLS_65({
        type: "password",
        placeholder: "Bingo#123",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    var __VLS_63;
    const __VLS_68 = {}.FormMessage;
    /** @type {[typeof __VLS_components.FormMessage, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ class: "text-xs md:text-sm mt-1" },
    }));
    const __VLS_70 = __VLS_69({
        ...{ class: "text-xs md:text-sm mt-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_55;
    __VLS_51.slots['' /* empty slot name completion */];
}
var __VLS_51;
const __VLS_72 = {}.FormField;
/** @type {[typeof __VLS_components.FormField, typeof __VLS_components.FormField, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    name: "confirmPassword",
}));
const __VLS_74 = __VLS_73({
    name: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ componentField }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.FormItem;
    /** @type {[typeof __VLS_components.FormItem, typeof __VLS_components.FormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }));
    const __VLS_78 = __VLS_77({
        ...{ class: "flex flex-col rounded p-2 md:p-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative block w-full" },
    });
    const __VLS_80 = {}.FormLabel;
    /** @type {[typeof __VLS_components.FormLabel, typeof __VLS_components.FormLabel, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }));
    const __VLS_82 = __VLS_81({
        ...{ class: "absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    var __VLS_83;
    const __VLS_84 = {}.FormControl;
    /** @type {[typeof __VLS_components.FormControl, typeof __VLS_components.FormControl, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
    const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.Input;
    /** @type {[typeof __VLS_components.Input, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        type: "password",
        placeholder: "Bingo#123",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }));
    const __VLS_90 = __VLS_89({
        type: "password",
        placeholder: "Bingo#123",
        ...(componentField),
        ...{ class: "h-10 md:h-11" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    var __VLS_87;
    const __VLS_92 = {}.FormMessage;
    /** @type {[typeof __VLS_components.FormMessage, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ class: "text-xs md:text-sm mt-1" },
    }));
    const __VLS_94 = __VLS_93({
        ...{ class: "text-xs md:text-sm mt-1" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    var __VLS_79;
    __VLS_75.slots['' /* empty slot name completion */];
}
var __VLS_75;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col p-2 md:p-4" },
});
const __VLS_96 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    type: "submit",
    ...{ class: "mt-2 h-10 md:h-11 hover-lift" },
}));
const __VLS_98 = __VLS_97({
    type: "submit",
    ...{ class: "mt-2 h-10 md:h-11 hover-lift" },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
var __VLS_99;
if (__VLS_ctx.registerError) {
    const __VLS_100 = {}.Alert;
    /** @type {[typeof __VLS_components.Alert, typeof __VLS_components.Alert, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ class: "mt-2 py-2 text-sm" },
    }));
    const __VLS_102 = __VLS_101({
        ...{ class: "mt-2 py-2 text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.AlertCircle;
    /** @type {[typeof __VLS_components.AlertCircle, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_106 = __VLS_105({
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const __VLS_108 = {}.AlertTitle;
    /** @type {[typeof __VLS_components.AlertTitle, typeof __VLS_components.AlertTitle, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ class: "text-xs md:text-sm" },
    }));
    const __VLS_110 = __VLS_109({
        ...{ class: "text-xs md:text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    var __VLS_111;
    const __VLS_112 = {}.AlertDescription;
    /** @type {[typeof __VLS_components.AlertDescription, typeof __VLS_components.AlertDescription, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ class: "text-xs md:text-sm" },
    }));
    const __VLS_114 = __VLS_113({
        ...{ class: "text-xs md:text-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    var __VLS_115;
    var __VLS_103;
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-b-none']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-100']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['px-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-11']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-100']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['px-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-11']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-100']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['px-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-11']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-100']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-background']} */ ;
/** @type {__VLS_StyleScopedClasses['px-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-11']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['md:h-11']} */ ;
/** @type {__VLS_StyleScopedClasses['hover-lift']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=RegisterForm.vue.js.map