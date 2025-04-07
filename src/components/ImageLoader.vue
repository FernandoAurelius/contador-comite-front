<template>
  <article
    class="w-1/2 h-full rounded-r-xl flex items-center justify-center overflow-y-hidden">
    <Carousel :plugins="plugins" class="w-full h-full">
      <CarouselContent class="h-full">
        <CarouselItem v-for="(image, index) in images" :key="index" :src="images.at(index)"
          class="h-full !pt-0 object-fill">
          <div class="flex items-center justify-center w-full h-full">
            <img :src="getImagePath(image)" class="object-cover rounded-md w-full h-full">
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselNext class="hidden" />
      <CarouselPrevious class="hidden" />
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
      plugins: [Autoplay({ delay: 3500 })]
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
