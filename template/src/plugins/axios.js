import axios from 'axios'
import { API_BASE_URL, MOCK_AUTH } from '@/config'
import { auth } from '@/plugins/firebase'

/**
 * Istanza HTTP unica dell'app. Ogni service importa questa, mai `axios` diretto.
 * NOTA: qui non si importa AuthService, altrimenti si crea un ciclo di import.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Inietta un token fresco a ogni richiesta (Firebase li ruota ogni ora)
api.interceptors.request.use(async (config) => {
  if (MOCK_AUTH) {
    config.headers.Authorization = 'Bearer mock-token'
    return config
  }

  const user = auth?.currentUser
  if (user) {
    config.headers.Authorization = `Bearer ${await user.getIdToken()}`
  }
  return config
})

// 401 => sessione scaduta o utente non autorizzato: torna al login.
// Usa `skipAuthRedirect: true` sulla singola richiesta per gestire il 401 a mano.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
