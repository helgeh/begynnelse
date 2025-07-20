<template>
  <my-subscription-form @register="onRegister" @login="onLogin" @logout="onLogout" @verify="onVerify" @delete="onDeleteMe" />
</template>

<script setup>
  import { useUserStore } from '../stores'

  const userStore = useUserStore()
  
  async function onRegister(usr, pw) {
    await userStore.register(usr, pw)
  }

  async function onLogin(usr, pw) {
    await userStore.login(usr, pw)
  }

  function onLogout() {
    userStore.logout()
  }

  async function onVerify() {
    await userStore.verify(usr, pw)
  }

  function onDeleteMe() {
    userStore.deleteme()
  }
</script>
