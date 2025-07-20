<template>
  <v-card class="mx-auto my-8" elevation="16" max-width="344">
    <v-card-item>
      <v-card-title>{{ isLoggedIn ? 'Hei' : 'logget ut' }} {{ user.email }}</v-card-title>

      <v-card-subtitle></v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <my-subscription-form @register="onRegister" @login="onLogin" @logout="onLogout" @verify="onVerify" @delete="onDeleteMe" />
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  import { useUserStore, useLinksStore } from '../stores'

  const userStore = useUserStore()
  const { user, isLoggedIn } = storeToRefs(userStore)
  const linksStore = useLinksStore()
  const { links } = storeToRefs(linksStore)

  async function onRegister(usr, pw) {
    await userStore.register(usr, pw)
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
