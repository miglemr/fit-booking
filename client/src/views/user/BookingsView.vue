<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue'
import { trpc } from '@/trpc'
import { FwbHeading, FwbButton, FwbModal } from 'flowbite-vue'
import { type Session } from '@fit-booking/server/src/shared/entities'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

onBeforeMount(async () => {
  date.value = new Date()
})

const date = ref()
const bookings = ref<Session[]>([])
const isShowModal = ref(false)
const bookingId = ref()

watch(date, async (newDate: Date) => {
  const date = newDate.toISOString()

  bookings.value = await trpc.booking.findByDate.query({ date })
})

async function handleConfirm() {
  isShowModal.value = false
  await cancelBooking()
  bookings.value = bookings.value.filter((booking) => booking.id !== bookingId.value)
  bookingId.value = null
}

async function cancelBooking() {
  await trpc.booking.cancel.mutate({ id: bookingId.value })
}

function showModalAndSetId(id: number) {
  bookingId.value = id
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <header class="mx-auto mb-6">
    <FwbHeading>Bookings</FwbHeading>
  </header>
  <section>
    <div class="mx-auto flex flex-col items-center justify-center">
      <div class="mb-6">
        <VueDatePicker inline auto-apply :enable-time-picker="false" v-model="date"></VueDatePicker>
      </div>

      <div class="w-full sm:max-w-md md:mt-0 xl:p-0">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="m-4 mx-auto grid grid-cols-3 gap-y-2 rounded-lg border border-gray-200 bg-white p-4 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <div>
            <h1>
              <b>{{ booking.sport.name }}</b>
            </h1>
            <p>Trainer: {{ booking.trainer.firstName }} {{ booking.trainer.lastName }}</p>
          </div>
          <div class="col-start-3 col-end-4 flex flex-col justify-self-center">
            <p>{{ booking.timeStart.substring(0, 5) }} - {{ booking.timeEnd.substring(0, 5) }}</p>

            <FwbButton size="xs" @click="showModalAndSetId(booking.id)">Cancel</FwbButton>
          </div>
        </div>
      </div>
    </div>
    <FwbModal v-if="isShowModal" @close="closeModal" size="sm">
      <template #body>
        <p class="mb-8 text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Confirm you would like to cancel this session booking
        </p>
        <div class="flex justify-between">
          <FwbButton @click="closeModal" color="alternative"> Cancel </FwbButton>
          <FwbButton @click="handleConfirm()" color="green"> Confirm </FwbButton>
        </div>
      </template>
    </FwbModal>
  </section>
</template>
