<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { FwbButton, FwbAlert, FwbModal } from 'flowbite-vue'
import { trpc } from '@/trpc'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref()

const isShowModal = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  const startDate = new Date()
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7))
  date.value = [startDate, endDate]
})

async function createBySchedule() {
  const [startDate, endDate] = date.value

  await trpc.session.createBySchedule.mutate({ startDate, endDate })

  isSuccess.value = true
}

function showModal() {
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <div>
    <div v-if="isSuccess" class="my-4 max-w-96">
      <FwbAlert type="success">Created successfully</FwbAlert>
    </div>
    <div class="max-w-64">
      <VueDatePicker
        v-model="date"
        range
        multi-calendars
        :enable-time-picker="false"
        :min-date="new Date()"
        class="mb-4"
      />
      <FwbButton @click="showModal">Create</FwbButton>
    </div>
  </div>

  <FwbModal v-if="isShowModal" @close="closeModal" size="sm">
    <template #body>
      <p class="mb-4">Are you sure you want to create sessions?</p>
      <div class="flex justify-between">
        <FwbButton @click="closeModal" color="alternative"> Cancel </FwbButton>
        <FwbButton @click="createBySchedule"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
