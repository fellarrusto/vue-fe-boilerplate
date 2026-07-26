<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const recent = computed(() => [...props.items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5))

const formatDate = (value) => dayjs(value).format('DD/MM/YYYY')
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Ultimi inserimenti</div>
    <DataTable :value="recent" :loading="loading" dataKey="id">
      <template #empty>Nessun elemento.</template>
      <Column field="name" header="Nome" />
      <Column field="category" header="Categoria" />
      <Column field="createdAt" header="Data">
        <template #body="{ data }">{{ formatDate(data.createdAt) }}</template>
      </Column>
    </DataTable>
  </div>
</template>
