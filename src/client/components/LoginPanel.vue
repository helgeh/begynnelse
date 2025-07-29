<template>
  <my-subscription-form
    @register="onRegister"
    @login="onLogin"
    @logout="onLogout"
    @verify="onVerify"
    @delete="onDeleteMeClick"
  />
  <my-prompt
    ref="remove-prompt"
    confirm-text="Ja, slett meg!"
    cancel-text="Oops, NEI!"
    title="SLETTE BRUKER?"
    @cancel="onDeleteMeCancel"
    @confirm="onDeleteMeConfirm"
  >
    Er du sikker på du vil slette din egen bruker?
  </my-prompt>
</template>

<script setup>
  import { useTemplateRef } from 'vue'

  import { useUserStore } from '../stores'

  const userStore = useUserStore()
  const removePrompt = useTemplateRef('remove-prompt')
  
  async function onRegister(usr, pw) {
    await userStore.register(usr, pw)
  }

  async function onLogin(usr, pw) {
    await userStore.login(usr, pw)
  }

  function onLogout() {
    userStore.logout()
  }

  async function onVerify(usr, pw) {
    await userStore.verify(usr, pw)
  }

  function onDeleteMeClick() {
    removePrompt.value.show()
  }

  function onDeleteMeCancel() {
    removePrompt.value.hide()
  }

  function onDeleteMeConfirm() {
    userStore.deleteme()
      .then(() => {
        removePrompt.value.hide()
      })
  }
</script>
