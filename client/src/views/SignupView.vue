<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'

const { signup } = useUserStore()

const userForm = ref({
  email: '',
  password: '',
  firstName: '',
})

const hasSucceeded = ref(false)

const [submitSignup, errorMessage] = useErrorMessage(async () => {
  await signup(userForm.value)

  hasSucceeded.value = true
})
</script>

<template>
  <section>
    <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <div
        class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
      >
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
          >
            Create new account
          </h1>

          <FwbAlert
            v-if="hasSucceeded"
            data-testid="successMessage"
            type="success"
            class="text-sm font-light text-gray-500 dark:text-gray-400"
          >
            You have successfully signed up! You can now log in.
            <RouterLink
              :to="{ name: 'Login' }"
              class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
              >Go to the login page</RouterLink
            >
          </FwbAlert>

          <FwbAlert v-if="errorMessage" data-testid="errorMessage" type="danger">
            {{ errorMessage }}
          </FwbAlert>

          <form class="space-y-4 md:space-y-6" aria-label="Signup" @submit.prevent="submitSignup">
            <FwbInput
              label="First name"
              type="text"
              placeholder="enter your first name"
              v-model="userForm.firstName"
            />
            <FwbInput
              label="Email"
              type="email"
              placeholder="name@gmail.com"
              v-model="userForm.email"
              :required="true"
            />
            <FwbInput
              label="Password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              placeholder="•••••••"
              v-model="userForm.password"
              :required="true"
            />

            <div class="grid">
              <FwbButton color="default" type="submit" size="lg">Sign up</FwbButton>
            </div>
          </form>

          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?
            <RouterLink
              :to="{ name: 'Login' }"
              class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
              >Sign in</RouterLink
            >
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
