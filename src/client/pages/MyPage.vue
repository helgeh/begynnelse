<template>
  <v-card class="mx-auto my-8" elevation="16" max-width="344" v-if="harTilgang">
    <v-card-item>
      <v-card-title> Card title </v-card-title>

      <v-card-subtitle> Card subtitle secondary text </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </v-card-text>
  </v-card>
  <v-sheet class="mx-auto mt-8 pa-3" max-width="400" rounded="lg" v-else>
    <GetAccess @godkjent="onTommelOpp" />
  </v-sheet>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'

  const harTilgang = ref(false)

  function onTommelOpp() {
    harTilgang.value = true
  }
</script>

<style scoped></style>
