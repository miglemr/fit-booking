<script lang="ts" setup>
import { ref } from 'vue'
import { FwbButton, FwbInput, FwbModal, FwbAlert } from 'flowbite-vue'
import { trpc } from '@/trpc'
import useErrorMessage from '@/composables/useErrorMessage'

const emit = defineEmits<{
  close: []
  submit: []
}>()

const name = ref('')

const [handleSubmit, errorMessage] = useErrorMessage(async () => {
  await createSport()
  emit('submit')
})

async function createSport() {
  await trpc.sport.create.mutate({
    name: name.value,
  })
}
</script>
<template>
  <FwbModal @close="$emit('close')" size="sm">
    <template #body>
      <FwbAlert v-if="errorMessage" data-testid="errorMessage" type="danger" class="mb-2">
        {{ errorMessage }}
      </FwbAlert>
      <form @submit.prevent="handleSubmit">
        <FwbInput v-model="name" placeholder="Enter name" label="Class name" required />
        <div class="mt-6 flex justify-between">
          <FwbButton @click="$emit('close')" color="alternative"> Cancel </FwbButton>
          <FwbButton type="submit"> Confirm </FwbButton>
        </div>
      </form>
    </template>
  </FwbModal>
</template>
