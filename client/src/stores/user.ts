import {
  clearStoredAccessToken,
  getIsAdminValueFromToken,
  getStoredAccessToken,
  getUserIdFromToken,
  storeAccessToken,
} from '@/utils/auth'
import { trpc } from '@/trpc'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const authToken = ref(getStoredAccessToken(localStorage))

  const authUserId = computed(() => (authToken.value ? getUserIdFromToken(authToken.value) : null))

  const isAdmin = computed(() =>
    authToken.value ? getIsAdminValueFromToken(authToken.value) : null
  )

  const isLoggedIn = computed(() => !!authToken.value)

  async function login(userLogin: { email: string; password: string }) {
    const { accessToken } = await trpc.user.login.mutate(userLogin)

    authToken.value = accessToken
    storeAccessToken(localStorage, accessToken)
  }

  function logout() {
    authToken.value = null
    clearStoredAccessToken(localStorage)
  }

  async function signup(userSignup: { email: string; password: string; firstName: string }) {
    await trpc.user.signup.mutate(userSignup)
  }

  return { authUserId, isLoggedIn, isAdmin, login, logout, signup }
})
