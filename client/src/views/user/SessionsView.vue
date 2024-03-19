<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue'
import { trpc } from '@/trpc'
import { FwbHeading, FwbButton, FwbModal, FwbBadge } from 'flowbite-vue'
import { type Session } from '@fit-booking/server/src/shared/entities'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref()
const sessions = ref<Session[]>([])
const bookedSessions = ref<Session[]>([])
const isShowModal = ref(false)
const sessionId = ref()

onBeforeMount(async () => {
  date.value = new Date()
})

watch(date, async (newDate: Date) => {
  const date = newDate.toISOString()

  sessions.value = await trpc.session.findByDate.query({ date })
  bookedSessions.value = await trpc.booking.findByDate.query({ date })
})

const checkIfBooked = (id: number) =>
  bookedSessions.value.some((bookedSession) => bookedSession.id === id)

async function handleConfirm() {
  isShowModal.value = false
  await trpc.booking.book.mutate({ id: sessionId.value })
  bookedSessions.value = await trpc.booking.findByDate.query({ date: date.value.toISOString() })
  sessionId.value = null
}

function showModalAndSetId(id: number) {
  sessionId.value = id
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <header class="mx-auto mb-6">
    <FwbHeading>Sessions</FwbHeading>
  </header>
  <section>
    <div class="mx-auto flex flex-col items-center justify-center">
      <div class="mb-6">
        <VueDatePicker inline auto-apply :enable-time-picker="false" v-model="date"></VueDatePicker>
      </div>

      <div class="w-full sm:max-w-md md:mt-0 xl:p-0">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="m-4 mx-auto grid grid-cols-3 gap-y-2 rounded-lg border border-gray-200 bg-white p-4 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <div>
            <h1>
              <b>{{ session.sport.name }}</b>
            </h1>
            <p>Trainer: {{ session.trainer.firstName }} {{ session.trainer.lastName }}</p>
            <p>Availability: {{ session.spotsLeft }}</p>
          </div>
          <div class="col-start-3 col-end-4 flex flex-col justify-self-center">
            <p>{{ session.timeStart.substring(0, 5) }} - {{ session.timeEnd.substring(0, 5) }}</p>

            <FwbBadge v-if="checkIfBooked(session.id)" size="xs">Booked</FwbBadge>
            <FwbButton v-else size="xs" @click="showModalAndSetId(session.id)">Book</FwbButton>
          </div>
        </div>
      </div>
    </div>
    <FwbModal v-if="isShowModal" @close="closeModal" size="sm">
      <template #body>
        <p class="mb-8 text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Confirm you would like to book this session
        </p>
        <div class="flex justify-between">
          <FwbButton @click="closeModal" color="alternative"> Cancel </FwbButton>
          <FwbButton @click="handleConfirm()" color="green"> Confirm </FwbButton>
        </div>
      </template>
    </FwbModal>
  </section>
</template>
