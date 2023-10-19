<template>

  <my-zip-list 
    ref="zipList"
    v-if="showZiplist"
    :canRemove="canRemoveItems"
    @download="downloadZip" 
  ></my-zip-list>

  <a href="#" ref="anchor"></a>

</template>

<script setup>
  import { ref, inject } from 'vue'

  const showZiplist = ref(true)
  const canRemoveItems = ref(false)
  const anchor = ref(null)

  function downloadZip(url) {
    anchor.value.setAttribute('href', url)
    anchor.value.click()
  }

</script>

<style scoped></style>