<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthService from '@/services/AuthService'
import { useUserStore } from '@/stores/user'
import { APP_NAME, MOCK_AUTH, ROLES } from '@/config'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const errorMessage = ref('')
const mockRole = ref(ROLES.ADMIN)
const roleOptions = Object.values(ROLES)

function goToApp() {
  router.push(route.query.redirect || '/')
}

onMounted(async () => {
  if (MOCK_AUTH) return

  try {
    await AuthService.initGoogleLogin(
      (profile) => {
        userStore.setUser(profile)
        goToApp()
      },
      (message) => {
        errorMessage.value = message || 'Il tuo account non e’ abilitato. Contatta un amministratore.'
      }
    )
    AuthService.renderGoogleButton('google-btn')
  } catch (error) {
    errorMessage.value = error.message
  }
})

function mockLogin() {
  userStore.setUser(AuthService.mockLogin(mockRole.value))
  goToApp()
}
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen p-8">
    <div class="w-full max-w-md bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-sm p-10">
      <div class="text-center mb-8">
        <img src="@/assets/logo/logo.svg" alt="logo" class="mb-6 w-16 mx-auto text-primary" />
        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-2">{{ APP_NAME }}</div>
        <span class="text-muted-color font-medium">Accedi per continuare</span>
      </div>

      <!-- Login reale: bottone Google renderizzato da Google Identity Services -->
      <div v-if="!MOCK_AUTH" class="flex justify-center">
        <div id="google-btn"></div>
      </div>

      <!-- Login finto: attivo solo con VITE_MOCK_AUTH=true -->
      <div v-else class="flex flex-col gap-4">
        <Message severity="info" :closable="false">Mock auth attiva: nessun backend richiesto.</Message>
        <div class="flex flex-col gap-2">
          <label for="role">Entra come</label>
          <Select id="role" v-model="mockRole" :options="roleOptions" />
        </div>
        <Button label="Accedi" icon="pi pi-sign-in" @click="mockLogin" />
      </div>

      <Message v-if="errorMessage" severity="error" class="mt-6" :closable="false">{{ errorMessage }}</Message>
    </div>
  </div>
</template>
