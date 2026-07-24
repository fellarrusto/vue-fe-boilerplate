import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ROLES } from '@/config'

/**
 * Utente corrente. Popolato dalla guard del router al primo accesso
 * e svuotato al logout: le pagine lo leggono, non lo ricaricano.
 */
export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const isLogged = computed(() => !!user.value)
  const role = computed(() => user.value?.role ?? null)
  const isAdmin = computed(() => role.value === ROLES.ADMIN)

  function setUser(userData) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  function hasRole(roles) {
    if (!roles?.length) return true
    return roles.includes(role.value)
  }

  return { user, isLogged, role, isAdmin, setUser, clearUser, hasRole }
})
