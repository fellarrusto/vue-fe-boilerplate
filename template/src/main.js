import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

import '@/assets/styles.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      // la dark mode si attiva aggiungendo .app-dark su <html> (vedi composables/layout.js)
      darkModeSelector: '.app-dark',
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
