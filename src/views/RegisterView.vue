<template>
  <section class="flex flex-col items-center justify-center md:justify-start w-full h-screen p-5">
    <Card class="w-full md:w-1/3">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/components/RegisterForm.vue';

export default defineComponent({
  name: "RegisterView",
  components: {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    RegisterForm
  }
});
</script>
