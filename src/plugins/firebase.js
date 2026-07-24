import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { FIREBASE_CONFIG, MOCK_AUTH } from '@/config'

/**
 * In mock mode Firebase non viene nemmeno inizializzato: `auth` resta null
 * e tutta la logica passa dal ramo mock di AuthService.
 */
let auth = null

if (!MOCK_AUTH) {
  if (!FIREBASE_CONFIG.apiKey) {
    throw new Error('[firebase] VITE_FIREBASE_API_KEY mancante. Valorizza il .env oppure imposta VITE_MOCK_AUTH=true.')
  }
  const app = initializeApp(FIREBASE_CONFIG)
  auth = getAuth(app)
}

export { auth }
