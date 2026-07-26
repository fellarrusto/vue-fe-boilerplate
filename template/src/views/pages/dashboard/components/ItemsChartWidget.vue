<script setup>
/** Esempio di grafico: PrimeVue <Chart> e' un wrapper su chart.js. */
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const chartData = ref(null)
const chartOptions = ref(null)

function buildData() {
  const style = getComputedStyle(document.documentElement)
  const byCategory = props.items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1
    return acc
  }, {})

  chartData.value = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        label: 'Elementi per categoria',
        data: Object.values(byCategory),
        backgroundColor: [
          style.getPropertyValue('--p-primary-400'),
          style.getPropertyValue('--p-primary-300'),
          style.getPropertyValue('--p-primary-200'),
        ],
        borderRadius: 6,
      },
    ],
  }

  chartOptions.value = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: style.getPropertyValue('--text-color-secondary') } },
      y: { beginAtZero: true, ticks: { color: style.getPropertyValue('--text-color-secondary'), precision: 0 } },
    },
  }
}

onMounted(buildData)
watch(() => props.items, buildData, { deep: true })

const hasData = computed(() => !!chartData.value?.labels?.length)
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Elementi per categoria</div>
    <Chart v-if="hasData" type="bar" :data="chartData" :options="chartOptions" class="h-80" />
    <div v-else class="text-muted-color">Nessun dato disponibile.</div>
  </div>
</template>
