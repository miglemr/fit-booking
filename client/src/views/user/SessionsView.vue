<script lang="ts" setup>
import { ref, watch, onBeforeMount, computed } from 'vue'
import { trpc } from '@/trpc'
import { FwbHeading } from 'flowbite-vue'
import SessionBookCard from '@/components/SessionBookCard.vue'
import { type Session } from '@fit-booking/server/src/shared/entities'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

onBeforeMount(async () => {
  date.value = new Date()
})

const date = ref()
const dateString = computed(() => date.value.toISOString())
const isPastDate = computed(() => date.value.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))

const sessions = ref<Session[]>([])

watch(date, async () => {
  sessions.value = await fetchSessions(dateString.value)
})

const fetchSessions = async (date: string) => trpc.session.findByDate.query({ date })

async function bookSession(id: number) {
  await trpc.booking.book.mutate({ id })

  sessions.value = await fetchSessions(dateString.value)
}
</script>

<template>
  <header class="mx-auto mb-6">
    <FwbHeading>Sessions</FwbHeading>
  </header>
  <section>
    <div class="mx-auto flex flex-col md:flex-row">
      <div class="mb-6">
        <VueDatePicker inline auto-apply :enable-time-picker="false" v-model="date" />
      </div>
      <div class="md:mx-4">
        <SessionBookCard
          v-for="session in sessions"
          :key="session.id"
          :session="session"
          :isPastDate="isPastDate"
          @book="bookSession"
        />
      </div>
    </div>
  </section>
</template>
