<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayout } from '@/layout/composables/layout'
import AppConfigurator from './AppConfigurator.vue'
import AuthService from '@/services/AuthService'
import { useUserStore } from '@/stores/user'
import { APP_NAME } from '@/config'

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout()
const userStore = useUserStore()
const router = useRouter()

const userMenu = ref(null)
const userMenuItems = ref([
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: async () => {
      await AuthService.logout()
      userStore.clearUser()
      router.push('/auth/login')
    },
  },
])
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <img src="@/assets/logo/logo.svg" alt="logo" class="w-8 shrink-0 text-primary" />
        <span>{{ APP_NAME }}</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
        <div class="relative">
          <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true,
            }"
            type="button"
            class="layout-topbar-action"
          >
            <i class="pi pi-palette"></i>
          </button>
          <AppConfigurator />
        </div>
      </div>

      <button type="button" class="layout-topbar-action" @click="userMenu.toggle($event)">
        <i class="pi pi-user"></i>
      </button>
      <Menu ref="userMenu" :model="userMenuItems" :popup="true">
        <template #start>
          <div class="px-3 py-2 border-b border-surface">
            <div class="font-medium text-sm">{{ userStore.user?.name || 'Utente' }}</div>
            <div class="text-xs text-muted-color">{{ userStore.user?.email }}</div>
          </div>
        </template>
      </Menu>
    </div>
  </div>
</template>
