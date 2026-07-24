/**
 * Adapter finto per UserService (VITE_MOCK_API=true).
 * Cancellabile appena colleghi il backend reale.
 */
import { ROLES } from '@/config'

let users = [
  { id: '1', name: 'Mario Rossi', email: 'mario.rossi@example.com', role: ROLES.ADMIN, active: true },
  { id: '2', name: 'Laura Bianchi', email: 'laura.bianchi@example.com', role: ROLES.USER, active: true },
  { id: '3', name: 'Ospite Nuovo', email: 'ospite@example.com', role: ROLES.USER, active: false },
]

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const usersMock = {
  async list() {
    await delay()
    return [...users]
  },

  async update(id, payload) {
    await delay()
    users = users.map((user) => (user.id === id ? { ...user, ...payload, id } : user))
    return users.find((user) => user.id === id)
  },

  async activate(id) {
    return usersMock.update(id, { active: true })
  },
}
