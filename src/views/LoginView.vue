<template>
  <section class="flex justify-center items-center w-full h-full">
    <ToggleMode />
    <article class="w-1/2 h-2/3 flex shadow-lg">
      <Card class="w-1/2 h-full rounded-r-none border-r-0">
      <CardHeader class="flex flex-col justify-center items-center">
        <CardTitle class="text-3xl">Bem-vindo de volta!</CardTitle>
        <CardDescription class="text-md">Faça login para acessar o aplicativo</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col justify-center items-center h-4/6">
        <LoginForm />
      </CardContent>
    </Card>
    <ImageLoader class="rounded-l-none" />
    </article>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm.vue';
import ImageLoader from '@/components/ImageLoader.vue';
import ToggleMode from '@/components/ToggleMode.vue';

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
    ToggleMode
  }
});
</script>
