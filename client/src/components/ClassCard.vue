<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton, FwbModal, FwbAlert, FwbInput } from 'flowbite-vue'
import type { Sport } from '@fit-booking/server/src/entities'
import useErrorMessage from '@/composables/useErrorMessage'

onBeforeMount(async () => {
  name.value = props.sport.name
})

const props = defineProps<{
  sport: Sport
}>()

const emit = defineEmits<{
  update: []
}>()

const name = ref()

const isShowEditModal = ref(false)
const isShowDeleteModal = ref(false)

const [handleEdit, editErrorMessage] = useErrorMessage(async () => {
  await editSport()
  closeEditModal()
  emit('update')
})

const [handleDelete, deleteErorMessage] = useErrorMessage(async () => {
  await removeSport()
  closeDeleteModal()
  emit('update')
})

const editSport = async () =>
  trpc.sport.update.mutate({
    id: props.sport.id,
    name: name.value,
  })

async function removeSport() {
  await trpc.sport.remove.mutate({ id: props.sport.id })
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
    <p>{{ sport.name }}</p>
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
      <form aria-label="class-edit" @submit.prevent="handleEdit">
        <FwbInput v-model="name" label="Class name" required />
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
        Are you sure you want to remove this class?
      </p>
      <div class="mt-6 flex justify-between">
        <FwbButton @click="closeDeleteModal" color="alternative"> Cancel </FwbButton>
        <FwbButton @click="handleDelete"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
