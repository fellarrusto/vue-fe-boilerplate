<script setup>
import { APP_NAME } from '@/config'
</script>

<template>
  <div class="layout-footer">{{ APP_NAME }} &copy; {{ new Date().getFullYear() }}</div>
</template>
