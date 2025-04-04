<template>
  <section>
    <ToggleMode />
    <form @submit="onSubmit">
      <FormField #="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="Email" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            O e-mail utilizado pra registro no aplicativo.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField #="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Senha</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Senha" v-bind="componentField" />
          </FormControl>
          <FormDescription>
            A senha utilizada para registro no aplicativo.
          </FormDescription>
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
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ToggleMode from '@/components/ui/ToggleMode.vue';
import { toTypedSchema } from '@vee-validate/zod';
import { loginFormSchema } from '@/types/LoginForm';
import { useForm } from 'vee-validate';
import authService from '@/api/authService';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next';

export default defineComponent({
  name: "LoginView",
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
    AlertDescription
  }
});
</script>
