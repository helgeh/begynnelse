<template>
  <v-sheet
    elevation="12"
    max-width="600"
    rounded="lg"
    width="100%"
    class="pa-4 mx-auto mt-5"
  >
    <my-header heading="MiraMull" :version="version"></my-header>

    <v-divider class="mb-4"></v-divider>

    <my-form
      ref="form"
      nameLabel="hva sier mira?"
      nameErrorLabel="du kan skrive noe her som Mira skal si i discord :)"
      @submitted="onSubmit"
    ></my-form>

    <my-alert ref="alert" @onClose="closeAlert" title="Åh nei!">
      <p>{{ alertMessage }}</p>
      <p>Prøv igjen eller hør med Helge hva som kan være feil...</p>
    </my-alert>
  </v-sheet>
</template>

<script setup>
  import { ref, inject } from 'vue'

  const service = inject('service')
  const alert = ref(null)
  const alertMessage = ref('')
  const form = ref(null)

  const version = __APP_VERSION__ // defined in vite.config.js

  function onSubmit(data) {
    alert.value.close()
    service
      .miraSay(data)
      .then((data) => {
        form.value.reset()
      })
      .catch(showError)
  }

  const closeAlert = () => {}

  function showError(err) {
    alertMessage.value = err.data || ''
    alert.value.show()
  }
</script>

<style scoped></style>
