<template>
  <h3>{{ isLoggedIn ? '' : 'logget ut' }} {{ user.email }}</h3>
  <!-- <v-card-subtitle>{{ user.name }}</v-card-subtitle> -->
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  import { useUserStore } from '../stores'
  
  const userStore = useUserStore()
  const { user, isLoggedIn } = storeToRefs(userStore)
</script>
