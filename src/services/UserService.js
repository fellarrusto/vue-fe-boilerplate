import api from '@/plugins/axios'
import { MOCK_API } from '@/config'
import { usersMock } from './mock/usersMock'

/** Gestione utenti e ruoli (pagina admin). */
const UserService = {
  async list() {
    if (MOCK_API) return usersMock.list()
    const { data } = await api.get('/auth/users')
    return data
  },

  async update(userId, payload) {
    if (MOCK_API) return usersMock.update(userId, payload)
    const { data } = await api.patch(`/auth/users/${userId}`, payload)
    return data
  },

  async activate(userId) {
    if (MOCK_API) return usersMock.activate(userId)
    const { data } = await api.patch(`/auth/users/${userId}/activate`)
    return data
  },
}

export default UserService
