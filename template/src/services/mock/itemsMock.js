/**
 * Adapter finto per ItemService: dati in memoria, nessuna rete.
 * Serve solo a far girare l'app senza backend (VITE_MOCK_API=true).
 * Quando colleghi le API vere puoi cancellare questo file.
 */

const CATEGORIES = ['Hardware', 'Software', 'Servizi']
const STATUSES = ['active', 'draft', 'archived']

let items = Array.from({ length: 23 }, (_, i) => ({
  id: String(i + 1),
  name: `Articolo ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: Math.round((20 + Math.random() * 480) * 100) / 100,
  status: STATUSES[i % STATUSES.length],
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
}))

let nextId = items.length + 1

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const itemsMock = {
  async list({ search } = {}) {
    await delay()
    if (!search) return [...items]
    const q = search.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
  },

  async get(id) {
    await delay(120)
    return items.find((item) => item.id === id) ?? null
  },

  async create(payload) {
    await delay()
    const created = { ...payload, id: String(nextId++), createdAt: new Date().toISOString() }
    items = [created, ...items]
    return created
  },

  async update(id, payload) {
    await delay()
    items = items.map((item) => (item.id === id ? { ...item, ...payload, id } : item))
    return items.find((item) => item.id === id)
  },

  async remove(id) {
    await delay()
    items = items.filter((item) => item.id !== id)
    return { success: true }
  },
}

export const ITEM_CATEGORIES = CATEGORIES
export const ITEM_STATUSES = STATUSES
