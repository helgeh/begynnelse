<template>
  <h4 v-if="!isLoggedIn">logget ut</h4>
  <h3 v-else>
    {{ user.name ? user.name : user.email }} 
    <span class="text-subtitle-1" v-if="user.name">({{ user.email }})</span>
  </h3>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  import { useUserStore } from '../stores'
  
  const userStore = useUserStore()
  const { user, isLoggedIn } = storeToRefs(userStore)
</script>
