<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'
import { trpc } from '@/trpc'
import TimeslotCard from '@/components/TimeslotCard.vue'
import CreateTimeslot from '@/components/CreateTimeslot.vue'
import { FwbButton } from 'flowbite-vue'
import { type Timeslot } from '@fit-book/server/src/shared/entities'

onBeforeMount(async () => {
  timeslots.value = await fetchTimeslots(jsDayIndex.value)
})

const props = defineProps<{
  dayIndex: number
}>()

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const timeslots = ref<Timeslot[]>([])
const jsDayIndex = computed(() => (props.dayIndex === 6 ? 0 : props.dayIndex + 1))

const isShowModal = ref(false)

const fetchTimeslots = async (dayOfWeek: number) => trpc.timeslot.findByDay.query({ dayOfWeek })

async function removeTimeslot(id: number) {
  await trpc.timeslot.remove.mutate({ id })
  timeslots.value = await fetchTimeslots(jsDayIndex.value)
}

async function handleSubmit() {
  closeModal()
  timeslots.value = await fetchTimeslots(jsDayIndex.value)
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
    <h1 class="mb-2 font-bold">{{ daysOfWeek[dayIndex] }}</h1>
    <div>
      <TimeslotCard
        v-for="timeslot of timeslots"
        :key="timeslot.id"
        :timeslot="timeslot"
        @delete="removeTimeslot"
      />
    </div>
  </div>

  <div class="mb-4">
    <FwbButton size="xs" @click="showModal">Create</FwbButton>
  </div>

  <CreateTimeslot
    v-if="isShowModal"
    @close="closeModal"
    @submit="handleSubmit"
    :dayIndex="jsDayIndex"
  />
</template>
