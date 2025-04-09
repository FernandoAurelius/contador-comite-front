<template>
  <form @submit="onSubmit" class="flex flex-col justify-center gap-4 w-full h-full rounded-b-none">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="flex flex-col rounded p-2 md:p-4">
              <div class="relative block w-full">
                <FormLabel
                  class="absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform">
                  Nome
                </FormLabel>
                <FormControl>
                  <Input type="name" placeholder="Miguel Fernando (ou floresz)" v-bind="componentField"
                    class="h-10 md:h-11" />
                </FormControl>
              </div>
              <FormMessage class="text-xs md:text-sm mt-1" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem class="flex flex-col rounded p-2 md:p-4">
              <div class="relative block w-full">
                <FormLabel
                  class="absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform">
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@exemplo.com" v-bind="componentField" class="h-10 md:h-11" />
                </FormControl>
              </div>
              <FormMessage class="text-xs md:text-sm mt-1" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem class="flex flex-col rounded p-2 md:p-4">
              <div class="relative block w-full">
                <FormLabel
                  class="absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform">
                  Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Bingo#123" v-bind="componentField" class="h-10 md:h-11" />
                </FormControl>
              </div>
              <FormMessage class="text-xs md:text-sm mt-1" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem class="flex flex-col rounded p-2 md:p-4">
              <div class="relative block w-full">
                <FormLabel
                  class="absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform">
                  Senha de confirmação
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Bingo#123" v-bind="componentField" class="h-10 md:h-11" />
                </FormControl>
              </div>
              <FormMessage class="text-xs md:text-sm mt-1" />
            </FormItem>
          </FormField>
          <div class="flex flex-col p-2 md:p-4">
            <Button type="submit" class="mt-2 h-10 md:h-11 hover-lift">
              Registrar-se
            </Button>
          </div>
          <Alert v-if="registerError" class="mt-2 py-2 text-sm">
            <AlertCircle class="w-4 h-4" />
            <AlertTitle class="text-xs md:text-sm">Erro</AlertTitle>
            <AlertDescription class="text-xs md:text-sm">
              E-mail já em uso. Tente novamente.
            </AlertDescription>
          </Alert>
        </form>
</template>

<script lang="ts">
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
    }
  },
  methods: {
    async onSubmit(event: Event) {
      event.preventDefault();

      this.form.handleSubmit(async (values) => {
        try {
          console.log("Tentando registrar usuário...")
          await authService.register(values.name, values.email, values.password);

          const store = useAuthStore();

          store.registered = true;

          this.$router.push("/login");
        } catch (error) {
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
})

</script>
