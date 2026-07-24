/**
 * Punto unico di lettura delle variabili d'ambiente.
 * REGOLA: nessun file fuori da qui legge `import.meta.env` direttamente.
 */

const bool = (value, fallback = false) => (value === undefined ? fallback : String(value) === 'true')

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Vue Boilerplate'

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

/** Login finto: nessun Firebase, nessun backend. Utile per partire subito. */
export const MOCK_AUTH = bool(import.meta.env.VITE_MOCK_AUTH, true)

/** Service con dati finti in memoria invece delle chiamate HTTP reali. */
export const MOCK_API = bool(import.meta.env.VITE_MOCK_API, true)

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

/** Ruoli conosciuti dall'app. Usati in `meta.roles` delle rotte e nel menu. */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
}
