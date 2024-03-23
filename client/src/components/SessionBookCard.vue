<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { FwbBadge, FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '@/stores/user'
import type { Session } from '@fit-booking/server/src/entities'

onBeforeMount(() => {
  isBooked.value = props.session.users.some((user) => user.id === authUserId)
})

const props = defineProps<{
  session: Session
  isPastDate: boolean
}>()

const emit = defineEmits<{
  book: [id: number]
}>()

const { authUserId } = useUserStore()

const isBooked = ref()

const isShowModal = ref(false)

async function handleConfirm() {
  isShowModal.value = false
  emit('book', props.session.id)
  isBooked.value = true
}

function showModal() {
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <div class="mb-2 max-w-80 text-xs">
    <FwbBadge class="mb-1 w-24">
      {{ session.timeStart.substring(0, 5) }} - {{ session.timeEnd.substring(0, 5) }}
    </FwbBadge>

    <div
      class="mx-auto grid grid-cols-3 gap-y-2 rounded-lg border border-gray-200 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    >
      <div class="flex flex-col justify-between">
        <h1>
          <b>{{ session.sport.name }}</b>
        </h1>
        <p>Trainer: {{ session.trainer.firstName }} {{ session.trainer.lastName }}</p>
      </div>
      <div class="col-start-3 col-end-4 flex flex-col">
        <p class="mb-2">Availability: {{ session.spotsLeft }}</p>
        <FwbBadge v-if="session.isCancelled" type="dark">Canceled</FwbBadge>
        <FwbButton v-else-if="!isBooked" size="xs" @click="showModal" :disabled="isPastDate"
          >Book</FwbButton
        >
        <FwbBadge v-else type="green">Booked</FwbBadge>
      </div>
    </div>
  </div>

  <FwbModal v-if="isShowModal" @close="closeModal" size="sm">
    <template #body>
      <p>Are you sure you want to book the session?</p>
      <div class="mt-6 flex justify-between">
        <FwbButton @click="closeModal" color="alternative"> Cancel </FwbButton>
        <FwbButton @click="handleConfirm"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
