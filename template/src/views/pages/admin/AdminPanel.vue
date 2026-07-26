<script setup>
/**
 * Esempio di rotta protetta: la rotta ha `meta: { roles: [ROLES.ADMIN] }`
 * e la voce di menu ha lo stesso `roles`. Il menu nasconde, la guard blocca.
 */
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import UserService from '@/services/UserService'
import { ROLES } from '@/config'

const toast = useToast()
const users = ref([])
const loading = ref(false)
const roleOptions = Object.values(ROLES)

onMounted(loadUsers)

async function loadUsers() {
  loading.value = true
  try {
    users.value = await UserService.list()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Errore', detail: 'Caricamento utenti non riuscito', life: 3000 })
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function changeRole(user, role) {
  try {
    await UserService.update(user.id, { role })
    toast.add({ severity: 'success', summary: 'Aggiornato', detail: `${user.name} ora e' ${role}`, life: 3000 })
    await loadUsers()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Errore', detail: 'Aggiornamento non riuscito', life: 3000 })
    console.error(error)
  }
}

async function activate(user) {
  try {
    await UserService.activate(user.id)
    toast.add({ severity: 'success', summary: 'Attivato', detail: `${user.name} puo' accedere`, life: 3000 })
    await loadUsers()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Errore', detail: 'Attivazione non riuscita', life: 3000 })
    console.error(error)
  }
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Utenti</div>

    <DataTable :value="users" :loading="loading" dataKey="id">
      <template #empty>Nessun utente.</template>

      <Column field="name" header="Nome" sortable />
      <Column field="email" header="Email" />
      <Column header="Ruolo" style="width: 12rem">
        <template #body="{ data }">
          <Select :modelValue="data.role" :options="roleOptions" class="w-full" @update:modelValue="changeRole(data, $event)" />
        </template>
      </Column>
      <Column header="Stato" style="width: 10rem">
        <template #body="{ data }">
          <Tag v-if="data.active" value="attivo" severity="success" />
          <Button v-else label="Attiva" size="small" @click="activate(data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
