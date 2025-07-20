<template>

  <v-list>
    <v-list-item v-for="link in links">{{ link.name }}</v-list-item>
  </v-list>
  
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  import { useLinksStore } from '../stores'

  const linksStore = useLinksStore()
  const { links } = storeToRefs(linksStore)
</script>

<style scoped></style>
