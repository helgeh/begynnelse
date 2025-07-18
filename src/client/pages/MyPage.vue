<template>
  <v-card class="mx-auto my-8" elevation="16" max-width="344" v-if="harTilgang">
    <v-card-item>
      <v-card-title> Card title </v-card-title>

      <v-card-subtitle> Card subtitle secondary text </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
      <v-divider class="my-5"></v-divider>
      <ul>
        <li v-for="link in links"><a :href="link.url">{{ link.name }}</a></li>
      </ul>
      <v-divider class="my-5"></v-divider>
      <v-btn v-if="harTilgang" @click="onLogOut" class="me-2">Logg ut</v-btn>
      <v-btn v-if="harTilgang" @click="onDeleteMe">Slett meg</v-btn>
    </v-card-text>
  </v-card>
  <v-sheet class="mx-auto mt-8 pa-3" max-width="400" rounded="lg" v-else>
    <GetAccess @godkjent="onTommelOpp" />
  </v-sheet>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'

  const links = ref([])
  const harTilgang = ref(false)

  const tilgang = inject('tilgang')

  function finnLenker() {
    tilgang
      .lenker()
      .then(lenker => {
        links.value = lenker
      })
      .catch(err => {
        harTilgang.value = false
        tilgang.hade()
      })
  }

  function onTommelOpp() {
    harTilgang.value = true
    finnLenker()
  }

  function onLogOut() {
    tilgang.hade()
      .then(_ => {
        harTilgang.value = false
      })
  }

  function onDeleteMe() {
    tilgang.slettmeg()
      .then(_ => {
        harTilgang.value = false
      })
  }
</script>

<style scoped></style>
