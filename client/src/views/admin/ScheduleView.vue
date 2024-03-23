<script lang="ts" setup>
import { FwbHeading } from 'flowbite-vue'
import DayCard from '@/components/DayCard.vue'
</script>

<template>
  <header class="mb-6">
    <FwbHeading>Schedule</FwbHeading>
  </header>
  <div class="grid gap-2 gap-y-6 md:grid-cols-3 md:grid-rows-3 lg:grid-cols-4 lg:grid-rows-2">
    <div v-for="index in 7" :key="index" class="flex flex-col justify-between p-2 shadow-md">
      <DayCard :dayIndex="index - 1" />
    </div>
  </div>
</template>
