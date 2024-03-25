<script lang="ts" setup>
import { ref } from 'vue'
import { FwbButton, FwbModal, FwbBadge } from 'flowbite-vue'
import { type Timeslot } from '@fit-book/server/src/shared/entities'

defineProps<{
  timeslot: Timeslot
}>()

defineEmits<{
  delete: [id: number]
}>()

const isShowModal = ref(false)

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
      {{ timeslot.timeStart.substring(0, 5) }} - {{ timeslot.timeEnd.substring(0, 5) }}
    </FwbBadge>

    <div
      class="mx-auto grid grid-cols-3 gap-y-2 rounded-lg border border-gray-200 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    >
      <div class="flex flex-col justify-between">
        <h1>
          <b>{{ timeslot.sport.name }}</b>
        </h1>
        <p>Trainer: {{ timeslot.trainer.firstName }} {{ timeslot.trainer.lastName }}</p>
      </div>
      <div class="col-start-3 col-end-4 flex flex-col">
        <p class="mb-2">Spots: {{ timeslot.spotsTotal }}</p>
        <FwbButton size="xs" @click="showModal">Delete</FwbButton>
      </div>
    </div>
  </div>

  <FwbModal v-if="isShowModal" @close="closeModal" size="sm">
    <template #body>
      <p class="mb-8 text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Are you sure you want to delete this timeslot?
      </p>
      <div class="flex justify-between">
        <FwbButton @click="closeModal" color="alternative"> Cancel </FwbButton>
        <FwbButton @click="$emit('delete', timeslot.id)" color="green"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
