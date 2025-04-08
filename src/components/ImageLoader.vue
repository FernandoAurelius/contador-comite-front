<template>
  <article
    class="w-full h-1/3 md:w-1/2 rounded-b-xl md:rounded-b-none md:rounded-r-xl flex items-center justify-center overflow-hidden">
    <Carousel :plugins="plugins" class="w-full h-full">
      <CarouselContent class="h-full">
        <CarouselItem v-for="(image, index) in images" :key="index" :src="images.at(index)"
          class="h-full !pt-0 object-fill">
          <div class="flex items-center justify-center w-full h-full">
            <img :src="getImagePath(image)"
                 class="object-cover w-full h-full"
                 alt="Imagem institucional"
                 loading="lazy">
          </div>
        </CarouselItem>
      </CarouselContent>
      <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click="goToSlide(index)"
          class="w-2 h-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors"
          :class="{ 'bg-white': currentIndex === index }">
        </button>
      </div>
    </Carousel>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default defineComponent({
  name: "ImageLoader",
  data() {
    return {
      images: [] as string[],
      plugins: [Autoplay({ delay: 3500 })],
      currentIndex: 0
    }
  },
  created() {
    this.images = [
      "asilo2.jpg",
      "asilo3.jpg",
      "genero1.jpg"
    ]
  },
  methods: {
    getImagePath(image: string) {
      return `/${image}`;
    },
    goToSlide(index: number) {
      this.currentIndex = index;
      // Implemente a navegação do carrossel aqui quando necessário
    }
  },
  components: {
    Carousel,
    CarouselNext,
    CarouselPrevious,
    CarouselContent,
    CarouselItem
  }
});
</script>
