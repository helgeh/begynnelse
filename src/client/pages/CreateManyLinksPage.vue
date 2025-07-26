<template>
  <v-textarea v-model="json"></v-textarea>
  <v-btn @click="send">SEnd</v-btn>
  <div>
    <pre>
      <code>
        {{ response }}
      </code>
    </pre>
  </div>
</template>

<script setup>
  import { shallowRef } from 'vue'
  import { useLinksStore } from '../stores'

  const linksStore = useLinksStore()
  const json = shallowRef('')
  const response = shallowRef('')

  async function send() {
    try {
      console.log('sending...', JSON.parse(json.value))
      linksStore.addMany(JSON.parse(json.value))
    }
    catch (err) {
      response.value = err.message
    }
  }
  
</script>
