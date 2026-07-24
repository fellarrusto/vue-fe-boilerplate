<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen p-8">
    <div class="w-full max-w-md bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-sm p-10 text-center">
      <i class="pi pi-lock text-5xl text-primary mb-6"></i>
      <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-2">Accesso negato</div>
      <p class="text-muted-color mb-8">Non hai i permessi necessari per questa sezione.</p>
      <Button label="Torna alla home" @click="router.push('/')" />
    </div>
  </div>
</template>
