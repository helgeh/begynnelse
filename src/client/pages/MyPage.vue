<template>
  <v-card class="mx-auto my-8" elevation="16" max-width="344">
    <v-card-item>
      <v-card-title>{{ isLoggedIn ? 'Hei' : 'logget ut' }} {{ user.email }}</v-card-title>

      <v-card-subtitle></v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p v-if="isLoggedIn">Linker:</p>
      <v-divider class="mt-2 mb-5"></v-divider>
      <ul>
        <li v-for="(link, i) in links" :key="i"><a :href="link.url">{{ link.name }}</a></li>
      </ul>
      <v-divider class="my-5"></v-divider>
      <!-- <v-btn v-if="isLoggedIn" @click="onLogOut" class="me-2">Logg ut</v-btn>
      <v-btn v-if="isLoggedIn" @click="onDeleteMe">Slett meg</v-btn> -->
      <GetAccess @login="onLogin" @logout="onLogout" @verify="onVerify" @delete="onDeleteMe" />
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useUserStore, useLinksStore } from '../stores'

  const userStore = useUserStore()
  const { user, isLoggedIn } = storeToRefs(userStore)
  const linksStore = useLinksStore()
  const { links } = storeToRefs(linksStore)

  async function onGodkjent(usr, pw) {
    await userStore.login(usr, pw)
  }

  async function onLogin(usr, pw) {
    await userStore.login(usr, pw)
  }

  function onLogout() {
    userStore.logout()
    links.value = []
  }

  async function onVerify() {
    await userStore.verify(usr, pw)
  }

  function onDeleteMe() {
    userStore.deleteme()
  }
</script>

<style scoped></style>
