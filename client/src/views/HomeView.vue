<script lang="ts" setup>
import { FwbHeading, FwbButton } from 'flowbite-vue'
</script>

<template>
  <section>
    <div class="ml-16 mt-16 flex px-4 py-8">
      <div class="mr-auto place-self-center">
        <FwbHeading tag="h1" class="mb-11">Booking </FwbHeading>
        <p
          class="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl"
        >
          Manage all your bookings in one platform.
        </p>
        <div class="mt-20">
          <RouterLink :to="{ name: 'Login' }" class="mr-4">
            <FwbButton color="light" size="lg">Sign in</FwbButton>
          </RouterLink>
          <RouterLink :to="{ name: 'Signup' }">
            <FwbButton color="dark" size="lg">Create new account</FwbButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
