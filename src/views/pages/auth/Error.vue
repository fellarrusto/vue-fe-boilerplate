<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen p-8">
    <div class="w-full max-w-md bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-sm p-10 text-center">
      <i class="pi pi-exclamation-triangle text-5xl text-red-500 mb-6"></i>
      <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-2">Qualcosa e' andato storto</div>
      <p class="text-muted-color mb-8">Riprova tra qualche istante o contatta il supporto.</p>
      <Button label="Torna alla home" @click="router.push('/')" />
    </div>
  </div>
</template>
