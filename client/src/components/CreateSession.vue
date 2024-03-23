<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton, FwbModal, FwbSelect, FwbAlert } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'

onBeforeMount(async () => {
  await setTrainerOptions()
  await setClassOptions()
})

const props = defineProps<{
  dateISO: string
}>()

const emit = defineEmits<{
  close: []
  submit: []
}>()

const trainerOptions = ref()
const sportOptions = ref()

const trainerSelected = ref('')
const sportSelected = ref('')
const timeStart = ref()
const timeEnd = ref()
const spotsTotal = ref()

const fetchTrainers = async () => trpc.trainer.findAll.query()
const fetchClasses = async () => trpc.sport.findAll.query()

async function setTrainerOptions() {
  const trainers = await fetchTrainers()

  trainerOptions.value = trainers.map((trainer) => ({
    value: `${trainer.id}`,
    name: `${trainer.firstName} ${trainer.lastName}`,
  }))
}

async function setClassOptions() {
  const sports = await fetchClasses()

  sportOptions.value = sports.map((sport) => ({
    value: `${sport.id}`,
    name: `${sport.name}`,
  }))
}

const [handleSubmit, errorMessage] = useErrorMessage(async () => {
  await createSession()
  emit('submit')
})

async function createSession() {
  const sessionObj = {
    sportId: parseInt(sportSelected.value, 10),
    trainerId: parseInt(trainerSelected.value, 10),
    date: props.dateISO,
    timeStart: timeStart.value,
    timeEnd: timeEnd.value,
    spotsTotal: spotsTotal.value,
  }

  await trpc.session.createCustom.mutate(sessionObj)
}
</script>

<template>
  <FwbModal @close="$emit('close')" size="sm">
    <template #body>
      <FwbAlert v-if="errorMessage" data-testid="errorMessage" type="danger" class="mb-2">
        {{ errorMessage }}
      </FwbAlert>
      <form
        class="space-y-4 md:space-y-6"
        aria-label="session-create"
        @submit.prevent="handleSubmit"
      >
        <FwbSelect
          v-model="trainerSelected"
          :options="trainerOptions"
          label="Select trainer"
          required
        />
        <FwbSelect v-model="sportSelected" :options="sportOptions" label="Select class" required />
        <div class="grid-col-2 grid">
          <div class="flex flex-col">
            <label for="startTime">Start time</label>
            <input
              v-model="timeStart"
              type="time"
              id="startTime"
              name="startTime"
              class="max-w-24 rounded-md border-neutral-300 bg-neutral-50 p-2"
              required
            />
          </div>
          <div class="col-start-2 flex flex-col">
            <label for="endTime">End time</label>
            <input
              v-model="timeEnd"
              type="time"
              id="endTime"
              name="endTime"
              class="max-w-24 rounded-md border-neutral-300 bg-neutral-50 p-2"
              required
            />
          </div>
        </div>
        <label for="spots" class="mr-2 rounded-md p-2">Spots total</label>
        <input
          v-model="spotsTotal"
          type="number"
          id="spots"
          name="spots"
          min="1"
          max="30"
          class="rounded-md border-neutral-300 bg-neutral-50 p-2"
        />

        <div class="flex justify-between">
          <FwbButton @click="$emit('close')" color="alternative"> Cancel </FwbButton>
          <FwbButton type="submit"> Confirm </FwbButton>
        </div>
      </form>
    </template>
  </FwbModal>
</template>
