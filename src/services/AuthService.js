import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth'
import api from '@/plugins/axios'
import { auth } from '@/plugins/firebase'
import { GOOGLE_CLIENT_ID, MOCK_AUTH, ROLES } from '@/config'

const MOCK_SESSION_KEY = 'boilerplate:mock-session'

/** Utente finto usato quando VITE_MOCK_AUTH=true. */
function buildMockUser(role = ROLES.ADMIN) {
  return {
    id: 'mock-user',
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com',
    role,
  }
}

function readMockSession() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_SESSION_KEY))
  } catch {
    return null
  }
}

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve()

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Impossibile caricare Google Identity Services'))
    document.head.appendChild(script)
  })
}

const AuthService = {
  /**
   * Risolve con l'utente autenticato (o null) appena Firebase ha ripristinato
   * la sessione. Va sempre atteso prima di decidere un redirect.
   */
  waitForAuth() {
    if (MOCK_AUTH) return Promise.resolve(readMockSession())

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user)
      })
    })
  },

  /** Profilo applicativo (ruolo, permessi, ...) letto dal backend. */
  async fetchProfile() {
    if (MOCK_AUTH) {
      const session = readMockSession()
      return session ?? buildMockUser()
    }

    const { data } = await api.get('/auth/me')
    return data
  },

  async getToken() {
    if (MOCK_AUTH) return 'mock-token'
    return (await auth?.currentUser?.getIdToken()) ?? null
  },

  /**
   * Inizializza il bottone Google e gestisce lo scambio credential -> Firebase -> profilo.
   * @param {(user: object) => void} onSuccess       chiamato con il profilo applicativo
   * @param {(message: string) => void} onNotEnabled chiamato se il backend risponde 401
   */
  async initGoogleLogin(onSuccess, onNotEnabled) {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('[auth] VITE_GOOGLE_CLIENT_ID mancante. Valorizza il .env oppure imposta VITE_MOCK_AUTH=true.')
    }

    await loadGoogleScript()

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const credential = GoogleAuthProvider.credential(response.credential)
        const result = await signInWithCredential(auth, credential)
        const token = await result.user.getIdToken()

        try {
          // skipAuthRedirect: qui il 401 significa "utente non abilitato",
          // non "sessione scaduta": va mostrato, non trasformato in redirect.
          const { data: profile } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
            skipAuthRedirect: true,
          })
          onSuccess?.(profile)
        } catch (error) {
          if (error.response?.status === 401) {
            await signOut(auth)
            onNotEnabled?.(error.response?.data?.error || 'Utente non abilitato')
            return
          }
          throw error
        }
      },
    })
  },

  renderGoogleButton(elementId) {
    window.google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: 'outline',
      size: 'large',
      width: '100%',
    })
  },

  /** Login finto, disponibile solo con VITE_MOCK_AUTH=true. */
  mockLogin(role = ROLES.ADMIN) {
    const user = buildMockUser(role)
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user))
    return user
  },

  async logout() {
    if (MOCK_AUTH) {
      localStorage.removeItem(MOCK_SESSION_KEY)
      return
    }
    await signOut(auth)
  },
}

export default AuthService
