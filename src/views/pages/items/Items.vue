<script setup>
/**
 * PAGINA DI RIFERIMENTO — copia questa cartella per ogni nuova feature.
 *
 * Convenzione: ogni feature e' self-contained sotto `src/views/pages/<feature>/`
 *   <Feature>.vue          -> stato, chiamate al service, toast
 *   components/*.vue       -> sotto-componenti usati solo qui
 *   composables/use*.js    -> logica riusabile (opzionale)
 *
 * La pagina orchestra; i componenti figli ricevono props ed emettono eventi.
 */
import { computed, onMounted, ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ItemService from '@/services/ItemService'
import ItemDialog from './components/ItemDialog.vue'

const toast = useToast()
const confirm = useConfirm()

const items = ref([])
const loading = ref(false)
const search = ref('')
const dialogVisible = ref(false)
const selectedItem = ref(null)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter((item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
})

onMounted(loadData)

async function loadData() {
  loading.value = true
  try {
    items.value = await ItemService.list()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Errore', detail: 'Caricamento non riuscito', life: 3000 })
    console.error(error)
  } finally {
    loading.value = false
  }
}

function openNew() {
  selectedItem.value = null
  dialogVisible.value = true
}

function openEdit(item) {
  selectedItem.value = { ...item }
  dialogVisible.value = true
}

async function saveItem(payload) {
  try {
    if (payload.id) {
      await ItemService.update(payload.id, payload)
      toast.add({ severity: 'success', summary: 'Salvato', detail: 'Elemento aggiornato', life: 3000 })
    } else {
      await ItemService.create(payload)
      toast.add({ severity: 'success', summary: 'Creato', detail: 'Elemento creato', life: 3000 })
    }
    dialogVisible.value = false
    await loadData()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Errore', detail: 'Salvataggio non riuscito', life: 3000 })
    console.error(error)
  }
}

function confirmDelete(item) {
  confirm.require({
    message: `Eliminare "${item.name}"?`,
    header: 'Conferma eliminazione',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Annulla',
    acceptLabel: 'Elimina',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await ItemService.remove(item.id)
        toast.add({ severity: 'success', summary: 'Eliminato', detail: 'Elemento rimosso', life: 3000 })
        await loadData()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Errore', detail: 'Eliminazione non riuscita', life: 3000 })
        console.error(error)
      }
    },
  })
}

const statusSeverity = { active: 'success', draft: 'warn', archived: 'secondary' }

const formatPrice = (value) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value ?? 0)
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Items</div>

    <Toolbar class="mb-4">
      <template #start>
        <Button label="Nuovo" icon="pi pi-plus" @click="openNew" />
      </template>
      <template #end>
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" placeholder="Cerca..." />
        </IconField>
      </template>
    </Toolbar>

    <DataTable :value="filteredItems" :loading="loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[10, 25, 50]" removableSort>
      <template #empty>Nessun elemento trovato.</template>

      <Column field="name" header="Nome" sortable />
      <Column field="category" header="Categoria" sortable />
      <Column field="price" header="Prezzo" sortable>
        <template #body="{ data }">{{ formatPrice(data.price) }}</template>
      </Column>
      <Column field="status" header="Stato" sortable>
        <template #body="{ data }">
          <Tag :value="data.status" :severity="statusSeverity[data.status]" />
        </template>
      </Column>
      <Column header="Azioni" style="width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" text rounded @click="openEdit(data)" />
            <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <ItemDialog v-model:visible="dialogVisible" :item="selectedItem" @save="saveItem" />
    <ConfirmDialog />
  </div>
</template>
