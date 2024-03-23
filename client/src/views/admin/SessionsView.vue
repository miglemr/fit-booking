<script lang="ts" setup>
import { ref, watch, onBeforeMount, computed } from 'vue'
import { trpc } from '@/trpc'
import { FwbHeading, FwbButton, FwbTabs, FwbTab } from 'flowbite-vue'
import SessionCard from '@/components/SessionCard.vue'
import CreateSession from '@/components/CreateSession.vue'
import ScheduleSessionsView from './ScheduleSessionsView.vue'
import { type Session } from '@fit-booking/server/src/shared/entities'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

onBeforeMount(async () => {
  date.value = new Date()
})

const date = ref()
const dateISO = computed(() => {
  const offset = date.value.getTimezoneOffset() * 60 * 1000

  const tLocal = new Date(date.value - offset)

  return tLocal.toISOString()
})

const isPastDate = computed(() => date.value.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))

const activeTab = ref('first')

const sessions = ref<Session[]>([])

const isShowModal = ref(false)

watch(date, async () => {
  sessions.value = await fetchSessions(dateISO.value)
})

const fetchSessions = async (date: string) => trpc.session.findByDate.query({ date })

async function cancelSession(id: number) {
  await trpc.session.cancel.mutate({ id })

  sessions.value = await fetchSessions(dateISO.value)
}

async function handleSubmit() {
  closeModal()
  sessions.value = await fetchSessions(dateISO.value)
}

function showModal() {
  isShowModal.value = true
}

function closeModal() {
  isShowModal.value = false
}
</script>

<template>
  <header class="mx-auto mb-6">
    <FwbHeading>Sessions</FwbHeading>
  </header>
  <section>
    <FwbTabs v-model="activeTab" class="md:p-5">
      <FwbTab name="first" title="Sessions">
        <div class="mx-auto flex flex-col md:flex-row">
          <div class="mb-6 flex flex-col">
            <VueDatePicker inline auto-apply :enable-time-picker="false" v-model="date" />
            <div class="mt-4">
              <FwbButton v-if="!isPastDate" @click="showModal">Create</FwbButton>
            </div>
          </div>

          <div class="md:mx-4">
            <SessionCard
              v-for="session in sessions"
              :key="session.id"
              :session="session"
              :isPastDate="isPastDate"
              @cancel="cancelSession"
            >
              <p>Are you sure you want to cancel the session?</p>
            </SessionCard>
          </div>
        </div>

        <CreateSession
          v-if="isShowModal"
          @close="closeModal"
          @submit="handleSubmit"
          :dateISO="dateISO"
        />
      </FwbTab>
      <FwbTab name="second" title="Schedule sessions"><ScheduleSessionsView /></FwbTab>
    </FwbTabs>
  </section>
</template>
