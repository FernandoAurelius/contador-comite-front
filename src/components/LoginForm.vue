<template>
  <form @submit="onSubmit" class="flex flex-col justify-center gap-5 w-full h-full">
    <FormField #="{ componentField }" name="email">
      <FormItem class="flex items-center justify-between rounded p-4">
        <div class="relative block w-full">
          <FormLabel class="absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-sm font-semibold transition-transform">Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="m@exemplo.com" v-bind="componentField" />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField #="{ componentField }" name="password">
      <FormItem class="flex items-center justify-between rounded p-4">
        <div class="relative block w-full">
          <FormLabel class="absolute left-2 top-0 -translate-y-1/2 scale-100 bg-background px-0.5 text-sm font-semibold transition-transform">Senha</FormLabel>
          <FormControl>
            <Input type="password" placeholder="bingo123" v-bind="componentField" />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit">
      Logar
    </Button>
    <Alert v-if="loginError">
      <AlertCircle class="w-4 h-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>
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
import ToggleMode from '@/components/ToggleMode.vue';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next';

export default defineComponent({
  name: "LoginForm",
  data() {
    return {
      formSchema: toTypedSchema(loginFormSchema),
      form: useForm(this.formSchema),
      loginError: false
    }
  },
  methods: {
    async onSubmit(event: Event) {
      event.preventDefault();
      console.log("Botão de logar clicado!");

      this.form.handleSubmit(async (values) => {
        try {
          console.log("Tentando logar na API...")
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
    ToggleMode,
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
