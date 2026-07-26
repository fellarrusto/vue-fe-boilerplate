<script setup>
import { computed } from 'vue'
import { rawMenuModel } from '@/router/menu'
import { useUserStore } from '@/stores/user'
import AppMenuItem from './AppMenuItem.vue'

const userStore = useUserStore()

/** Filtra ricorsivamente le voci che l'utente corrente non puo' vedere. */
function filterByRole(items = []) {
  return items
    .filter((item) => userStore.hasRole(item.roles))
    .map((item) => (item.items ? { ...item, items: filterByRole(item.items) } : item))
    .filter((item) => !item.items || item.items.length)
}

const model = computed(() =>
  rawMenuModel.map((section) => ({ ...section, items: filterByRole(section.items) })).filter((section) => section.items.length)
)
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="i">
      <app-menu-item v-if="!item.separator" :item="item" :index="i" />
      <li v-else class="menu-separator"></li>
    </template>
  </ul>
</template>
