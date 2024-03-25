<script lang="ts" setup>
import { ref } from 'vue'
import { FwbBadge, FwbButton, FwbModal } from 'flowbite-vue'
import type { Session } from '@fit-book/server/src/entities'

const props = defineProps<{
  session: Session
  isPastDate: boolean
}>()

const emit = defineEmits<{
  cancel: [id: number]
}>()

const isShowModal = ref(false)

async function handleConfirm() {
  isShowModal.value = false
  emit('cancel', props.session.id)
}

function showModal() {
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <div class="mb-2 max-w-80 text-xs" data-testid="session">
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
        <FwbButton v-if="!session.isCancelled" size="xs" @click="showModal" :disabled="isPastDate"
          >Cancel</FwbButton
        >
        <FwbBadge type="dark" v-else data-testid="canceled-badge">Canceled</FwbBadge>
      </div>
    </div>
  </div>

  <FwbModal v-if="isShowModal" @close="closeModal" size="sm">
    <template #body>
      <slot />
      <div class="mt-6 flex justify-between">
        <FwbButton @click="closeModal" color="alternative"> Cancel </FwbButton>
        <FwbButton @click="handleConfirm"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
