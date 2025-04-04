<template>
  <RangeCalendar v-model="value" class="rounded-md border" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RangeCalendar } from '../components/ui/range-calendar';
import { getLocalTimeZone, today } from '@internationalized/date';
import { DateRange } from 'reka-ui';

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()).add({days: 7})
    }
  },
  computed: {
    value() {
      return { start: this.start, end: this.end } as DateRange
    }
  },
  components: {
    RangeCalendar
  }
});
</script>
