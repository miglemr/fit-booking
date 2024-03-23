<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton } from 'flowbite-vue'
import TrainerCard from '@/components/TrainerCard.vue'
import AddTrainer from '@/components/AddTrainer.vue'
import { type Trainer } from '@fit-booking/server/src/shared/entities'

onBeforeMount(async () => {
  trainers.value = await fetchTrainers()
})

const trainers = ref<Trainer[]>([])

const isShowModal = ref(false)

const fetchTrainers = async () => trpc.trainer.findAll.query()

async function handleAddSubmit() {
  closeModal()

  trainers.value = await fetchTrainers()
}

async function handleUpdate() {
  trainers.value = await fetchTrainers()
}

function showModal() {
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <TrainerCard
    v-for="trainer of trainers"
    :key="trainer.id"
    :trainer="trainer"
    @update="handleUpdate"
  />
  <FwbButton color="dark" @click="showModal">Add</FwbButton>
  <AddTrainer v-if="isShowModal" @close="closeModal" @submit="handleAddSubmit" />
</template>
