<script lang="ts" setup>
import { ref } from 'vue'
import { FwbButton, FwbInput, FwbModal, FwbAlert } from 'flowbite-vue'
import { trpc } from '@/trpc'
import useErrorMessage from '@/composables/useErrorMessage'

const emit = defineEmits<{
  close: []
  submit: []
}>()

const firstName = ref('')
const lastName = ref('')

const [handleSubmit, errorMessage] = useErrorMessage(async () => {
  await createTrainer()
  emit('submit')
})

async function createTrainer() {
  await trpc.trainer.create.mutate({
    firstName: firstName.value,
    lastName: lastName.value,
  })
}
</script>
<template>
  <FwbModal @close="$emit('close')" size="sm">
    <template #body>
      <FwbAlert v-if="errorMessage" data-testid="errorMessage" type="danger" class="mb-2">
        {{ errorMessage }}
      </FwbAlert>
      <form aria-label="class-create" @submit.prevent="handleSubmit">
        <FwbInput v-model="firstName" placeholder="Enter first name" label="First name" required />
        <FwbInput v-model="lastName" placeholder="Enter last name" label="Last name" required />
        <div class="mt-6 flex justify-between">
          <FwbButton type="button" @click="$emit('close')" color="alternative"> Cancel </FwbButton>
          <FwbButton type="submit"> Confirm </FwbButton>
        </div>
      </form>
    </template>
  </FwbModal>
</template>
