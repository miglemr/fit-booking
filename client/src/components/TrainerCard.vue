<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton, FwbModal, FwbAlert, FwbInput } from 'flowbite-vue'
import type { Trainer } from '@fit-booking/server/src/entities'
import useErrorMessage from '@/composables/useErrorMessage'

onBeforeMount(async () => {
  firstName.value = props.trainer.firstName
  lastName.value = props.trainer.lastName
})

const props = defineProps<{
  trainer: Trainer
}>()

const emit = defineEmits<{
  update: []
}>()

const firstName = ref()
const lastName = ref()

const isShowEditModal = ref(false)
const isShowDeleteModal = ref(false)

const [handleEdit, editErrorMessage] = useErrorMessage(async () => {
  await editTrainer()
  closeEditModal()
  emit('update')
})

const [handleDelete, deleteErorMessage] = useErrorMessage(async () => {
  await removeTrainer()
  closeDeleteModal()
  emit('update')
})

const editTrainer = async () =>
  trpc.trainer.update.mutate({
    id: props.trainer.id,
    firstName: firstName.value,
    lastName: lastName.value,
  })

async function removeTrainer() {
  await trpc.trainer.remove.mutate({ id: props.trainer.id })
}

function showEditModal() {
  isShowEditModal.value = true
}

function closeEditModal() {
  isShowEditModal.value = false
}

function showDeleteModal() {
  isShowDeleteModal.value = true
}

function closeDeleteModal() {
  isShowDeleteModal.value = false
}
</script>

<template>
  <div
    class="mb-6 flex max-w-80 justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
  >
    <p>{{ trainer.firstName }} {{ trainer.lastName }}</p>
    <div class="flex">
      <FwbButton color="light" size="xs" class="mr-2" @click="showEditModal">Edit</FwbButton>
      <FwbButton color="dark" size="xs" @click="showDeleteModal">Delete</FwbButton>
    </div>
  </div>

  <FwbModal v-if="isShowEditModal" @close="closeEditModal" size="sm">
    <template #body>
      <FwbAlert v-if="editErrorMessage" data-testid="errorMessage" type="danger" class="mb-2">
        {{ editErrorMessage }}
      </FwbAlert>
      <form aria-label="trainer-edit" @submit.prevent="handleEdit">
        <FwbInput v-model="firstName" label="First name" required />
        <FwbInput v-model="lastName" label="Last name" required />
        <div class="mt-6 flex justify-between">
          <FwbButton type="button" @click="closeEditModal" color="alternative"> Cancel </FwbButton>
          <FwbButton type="submit"> Submit </FwbButton>
        </div>
      </form>
    </template>
  </FwbModal>

  <FwbModal v-if="isShowDeleteModal" @close="closeDeleteModal" size="sm">
    <template #body>
      <FwbAlert v-if="deleteErorMessage" data-testid="errorMessage" type="danger" class="mb-2">
        {{ deleteErorMessage }}
      </FwbAlert>
      <p class="mb-8 text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Are you sure you want to remove this trainer?
      </p>
      <div class="mt-6 flex justify-between">
        <FwbButton @click="closeDeleteModal" color="alternative"> Cancel </FwbButton>
        <FwbButton @click="handleDelete"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
