<template>
  <section class="flex justify-center items-start w-full h-screen p-5">
    <article
      class="w-full h-19/20 md:h-5/6 max-w-md md:max-w-none md:w-4/5 lg:w-3/4 xl:w-2/3 flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden">
      <Card
        class="w-full h-2/3 md:h-full md:flex md:flex-col md:justify-center md:w-1/2 md:rounded-r-none rounded-b-none md:border-r-0 flex flex-col">
        <CardHeader class="flex flex-col justify-center items-center pt-8 md:pt-6">
          <CardTitle class="text-2xl md:text-3xl">Bem-vindo de volta!</CardTitle>
          <CardDescription class="text-sm md:text-md">Faça login para acessar o aplicativo</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col justify-center items-center p-6">
          <LoginForm />
        </CardContent>
        <div class="flex flex-col items-center gap-4">
          <span class="text-xs md:text-sm self-center justify-self-center">
            Ou, se ainda não tem uma conta...
          </span>
          <Button variant="outline" @click="$router.push('/register')" class="hover-lift">
            Registre-se aqui.
          </Button>
        </div>
      </Card>
      <ImageLoader class="w-full md:w-1/2 md:h-full md:rounded-l-none" />
    </article>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm.vue';
import ImageLoader from '@/components/ImageLoader.vue';
import Button from '@/components/ui/button/Button.vue';

export default defineComponent({
  name: "LoginView",
  components: {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    LoginForm,
    ImageLoader,
    Button
  }
});
</script>
