<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const totalValue = computed(() => props.items.reduce((sum, item) => sum + (item.price ?? 0), 0))
const activeCount = computed(() => props.items.filter((item) => item.status === 'active').length)
const draftCount = computed(() => props.items.filter((item) => item.status === 'draft').length)

// classi Tailwind scritte per esteso: le stringhe interpolate verrebbero eliminate dal purge
const cards = computed(() => [
  { label: 'Elementi', value: props.items.length, icon: 'pi pi-list', iconClass: 'bg-blue-100 dark:bg-blue-400/10 text-blue-500' },
  { label: 'Attivi', value: activeCount.value, icon: 'pi pi-check-circle', iconClass: 'bg-green-100 dark:bg-green-400/10 text-green-500' },
  { label: 'Bozze', value: draftCount.value, icon: 'pi pi-pencil', iconClass: 'bg-orange-100 dark:bg-orange-400/10 text-orange-500' },
  {
    label: 'Valore totale',
    value: new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalValue.value),
    icon: 'pi pi-euro',
    iconClass: 'bg-purple-100 dark:bg-purple-400/10 text-purple-500',
  },
])
</script>

<template>
  <div v-for="card in cards" :key="card.label" class="col-span-12 lg:col-span-6 xl:col-span-3">
    <div class="card mb-0">
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">{{ card.label }}</span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ card.value }}</div>
        </div>
        <div class="flex items-center justify-center rounded-border" :class="card.iconClass" style="width: 2.5rem; height: 2.5rem">
          <i :class="card.icon" class="text-xl"></i>
        </div>
      </div>
    </div>
  </div>
</template>
