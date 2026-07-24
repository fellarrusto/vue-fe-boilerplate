import api from '@/plugins/axios'
import { MOCK_API } from '@/config'
import { itemsMock } from './mock/itemsMock'

/**
 * SERVICE DI RIFERIMENTO — copia questo file per ogni nuova entita'.
 *
 * Regole:
 * - un file per entita': `[Entita]Service.js`
 * - metodi CRUD: list / get / create / update / remove
 * - si importa sempre `@/plugins/axios`, mai `axios` diretto
 * - si ritorna sempre `response.data`, mai la response intera
 * - nessun `try/catch` qui: l'errore lo gestisce la pagina (toast)
 *
 * Il ramo MOCK_API serve solo a far girare la demo senza backend:
 * quando colleghi le API vere, togli l'if e il relativo import.
 */
const ItemService = {
  async list(params = {}) {
    if (MOCK_API) return itemsMock.list(params)
    const { data } = await api.get('/items', { params })
    return data
  },

  async get(id) {
    if (MOCK_API) return itemsMock.get(id)
    const { data } = await api.get(`/items/${id}`)
    return data
  },

  async create(payload) {
    if (MOCK_API) return itemsMock.create(payload)
    const { data } = await api.post('/items', payload)
    return data
  },

  async update(id, payload) {
    if (MOCK_API) return itemsMock.update(id, payload)
    const { data } = await api.put(`/items/${id}`, payload)
    return data
  },

  async remove(id) {
    if (MOCK_API) return itemsMock.remove(id)
    const { data } = await api.delete(`/items/${id}`)
    return data
  },
}

export default ItemService
