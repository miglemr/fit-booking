<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { trpc } from '@/trpc'
import { FwbButton } from 'flowbite-vue'
import ClassCard from '@/components/ClassCard.vue'
import AddClass from '@/components/AddClass.vue'
import { type Sport } from '@fit-booking/server/src/shared/entities'

onBeforeMount(async () => {
  sports.value = await fetchSports()
})

const sports = ref<Sport[]>([])

const isShowModal = ref(false)

const fetchSports = async () => trpc.sport.findAll.query()

async function handleAddSubmit() {
  closeModal()

  sports.value = await fetchSports()
}

async function handleUpdate() {
  sports.value = await fetchSports()
}

function showModal() {
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <ClassCard v-for="sport of sports" :key="sport.id" :sport="sport" @update="handleUpdate" />
  <FwbButton color="dark" @click="showModal">Add</FwbButton>
  <AddClass v-if="isShowModal" @close="closeModal" @submit="handleAddSubmit" />
</template>
