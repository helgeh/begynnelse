<template>

  <v-sheet
    elevation="12"
    max-width="600"
    rounded="lg"
    width="100%"
    class="pa-4 mx-auto"
  >

    <my-header heading="FontReNamR" :version="version"></my-header>

    <my-form 
      ref="form"
      fileLabel="trykk her for å velge font-fil(er)"
      fileErrorLabel="vennligst velg fil(er)"
      nameLabel="trykk her for å skrive nytt navn"
      nameErrorLabel="vennligst skriv nytt navn"
      @submitted="onSubmit"
    ></my-form>
 
    <a href="#" ref="anchor"></a>

    <my-alert ref="alert" @onClose="closeAlert" title="Åh nei!">
      <p>{{ alertMessage }}</p>
      <p>Prøv igjen eller hør med Helge hva som kan være feil...</p>
    </my-alert>

  </v-sheet>

  <my-zip-list 
    ref="zipList"
    @download="downloadZip" 
    @slett="removeZip"
  ></my-zip-list>

  <my-prompt 
    ref="removePrompt" 
    title="Slette"
    cancelText="Nei fader jeg trykte feil!" 
    @cancel="onRemoveCancel" 
    confirmText="Yup, slett!" 
    @confirm="onRemoveConfirm"
  >
    Slette filen <strong>{{ zipToRemove.replace('/zips/', '') }}</strong>?
  </my-prompt>

</template>

<script setup>

  import { ref, inject } from 'vue'
  
  const version = __APP_VERSION__ // defined in vite.config.js

  const service = inject('service')
  const alert = ref(null)
  const alertMessage = ref('')
  const anchor = ref(null)
  const zipList = ref(null)
  const removePrompt = ref(null)
  const zipToRemove = ref('')
  const form = ref(null)


  function onSubmit (data) {
    alert.value.close()
    service.uploadFonts(data)
      .then(data => {
        if (data.downloadUrl) {
          downloadZip(data.downloadUrl)
          form.value.reset()
        }
        zipList.value.reload()
      })
      .catch(showError)
  }

  const closeAlert = () => {
    
  }

  function downloadZip(url) {
    anchor.value.setAttribute('href', url)
    anchor.value.click()
  }

  function removeZip(item) {
    zipToRemove.value = item
    removePrompt.value.show()
  }

  function onRemoveConfirm() {
    removePrompt.value.hide()
    service.removeZip(zipToRemove.value)
      .then(data => {
        zipList.value.reload()
        zipToRemove.value = ''
      })
      .catch(showError)
  }

  function onRemoveCancel() {
    removePrompt.value.hide()
    zipToRemove.value = ''
  }

  function showError(err) {
    alertMessage.value = err.data || ''
    alert.value.show()
  }


</script>
