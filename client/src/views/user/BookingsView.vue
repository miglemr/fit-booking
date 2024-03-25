<script lang="ts" setup>
import { ref, watch, onBeforeMount, computed } from 'vue'
import { trpc } from '@/trpc'
import { FwbHeading } from 'flowbite-vue'
import SessionCard from '@/components/SessionCard.vue'
import { type Session } from '@fit-book/server/src/shared/entities'
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
  sessions.value = await fetchBookedSessions(dateString.value)
})

const fetchBookedSessions = async (date: string) => trpc.booking.findByDate.query({ date })

async function cancelBooking(id: number) {
  await trpc.booking.cancel.mutate({ id })

  sessions.value = sessions.value.filter((session) => session.id !== id)
}
</script>

<template>
  <header class="mx-auto mb-6">
    <FwbHeading>Bookings</FwbHeading>
  </header>
  <section>
    <div class="mx-auto flex flex-col md:flex-row">
      <div class="mb-6">
        <VueDatePicker inline auto-apply :enable-time-picker="false" v-model="date"></VueDatePicker>
      </div>

      <div class="md:mx-4">
        <SessionCard
          v-for="session in sessions"
          :key="session.id"
          :session="session"
          :isPastDate="isPastDate"
          @cancel="cancelBooking"
        >
          <p>Are you sure you want to cancel the booking?</p>
        </SessionCard>
      </div>
    </div>
  </section>
</template>
