<template>
  <v-container>
    <h1 :title="ver ? 'Version ' + ver : ''">The About Page</h1>
  </v-container>
</template>

<script setup>
  import { shallowRef } from 'vue'

  const ver = shallowRef(__APP_VERSION__)
</script>

<style scoped></style>
