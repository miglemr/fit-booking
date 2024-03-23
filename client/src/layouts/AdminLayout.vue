<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue'
import StackedLayout from './StackedLayout.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const { logout } = useUserStore()

const links = [
  { label: 'Sessions', name: 'Admin Sessions' },
  { label: 'Schedule', name: 'Schedule' },
  { label: 'Trainers', name: 'Trainers' },
  { label: 'Classes', name: 'Classes' },
]

function logoutUser() {
  logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <StackedLayout :links="links">
    <template #menu>
      <FwbNavbarLink @click.prevent="logoutUser" link="#">Logout</FwbNavbarLink>
    </template>
  </StackedLayout>
</template>
