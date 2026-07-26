<script setup>
import { onMounted, ref } from 'vue'
import ItemService from '@/services/ItemService'
import StatsWidget from './components/StatsWidget.vue'
import ItemsChartWidget from './components/ItemsChartWidget.vue'
import RecentItemsWidget from './components/RecentItemsWidget.vue'

const items = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    items.value = await ItemService.list()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="grid grid-cols-12 gap-8">
    <StatsWidget :items="items" />

    <div class="col-span-12 xl:col-span-6">
      <ItemsChartWidget :items="items" />
    </div>
    <div class="col-span-12 xl:col-span-6">
      <RecentItemsWidget :items="items" :loading="loading" />
    </div>
  </div>
</template>
