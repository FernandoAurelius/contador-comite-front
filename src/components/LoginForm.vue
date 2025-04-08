<template>
  <form @submit="onSubmit" class="flex flex-col justify-center gap-4 w-full h-full rounded-b-none">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem class="flex flex-col rounded p-2 md:p-4">
        <div class="relative block w-full">
          <FormLabel
            class="absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-xs md:text-sm font-semibold transition-transform">
            Email</FormLabel>
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
            <Input type="password" placeholder="bingo123" v-bind="componentField" class="h-10 md:h-11" />
          </FormControl>
        </div>
        <FormMessage class="text-xs md:text-sm mt-1" />
      </FormItem>
    </FormField>
    <div class="flex flex-col p-2 md:p-4">
      <Button type="submit" class="mt-2 h-10 md:h-11 hover-lift">
        Logar
      </Button>
    </div>
    <Alert v-if="loginError" class="mt-2 py-2 text-sm">
      <AlertCircle class="w-4 h-4" />
      <AlertTitle class="text-xs md:text-sm">Erro</AlertTitle>
      <AlertDescription class="text-xs md:text-sm">
        Credenciais inválidas. Por favor, tente novamente.
      </AlertDescription>
    </Alert>
  </form>
</template>

<script lang="ts">
import authService from '@/api/authService';
import { loginFormSchema } from '@/types/LoginForm';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { defineComponent } from 'vue'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next';

export default defineComponent({
  name: "LoginForm",
  data() {
    const schema = toTypedSchema(loginFormSchema);
    return {
      form: useForm({ validationSchema: schema }),
      loginError: false
    }
  },
  methods: {
    async onSubmit(event: Event) {
      event.preventDefault();
      console.log("Botão de logar clicado!");

      this.form.handleSubmit(async (values) => {
        try {
          console.log("Tentando logar na API...");
          await authService.login(values.email, values.password);

          console.log("Usuário logado?", await authService.userIsLogged());
          this.$router.push("/");
        } catch (error) {
          this.loginError = true;
        }
      })();
    }
  },
  components: {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    Input,
    Button,
    Alert,
    AlertCircle,
    AlertTitle,
    AlertDescription,
  }
});
</script>
