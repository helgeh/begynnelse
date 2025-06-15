<template>
  <v-sheet class="mx-auto mt-8" max-width="400" rounded="lg">
    <my-file-list
      ref="videoList"
      v-if="showVideolist"
      @clicked="showVideo"
      @alt-clicked="downloadVideo"
    ></my-file-list>
  </v-sheet>

  <a href="#" ref="anchor"></a>

  <v-dialog v-model="videoVisible" transition="dialog-bottom-transition">
    <v-sheet class="bg-primary pa-2" min-height="500px" rounded>
      <v-icon
        @click="videoVisible = false"
        icon="mdi-close"
        class="position-absolute top-0 right-0 me-4 mt-4 pa-4 bg-black"
        style="z-index: 999"
      />
      <iframe :src="videoUrl" width="100%" height="500px"></iframe>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'

  const service = inject('service')
  const videoList = ref(null)
  const showVideolist = ref(true)
  const canRemoveItems = ref(false)
  const anchor = ref(null)
  const items = ref([])
  const videoVisible = ref(false)
  const videoUrl = ref('')
  const isAdmin = true

  function showVideo(data) {
    const item = items.value[data.index]
    videoUrl.value = item.value
    videoVisible.value = true
  }

  function downloadVideo(data) {
    const item = items.value[data.index]
    anchor.value.setAttribute('href', item.value)
    anchor.value.setAttribute(
      'download',
      item.value.substr(item.value.lastIndexOf('/') + 1),
    )
    anchor.value.click()
  }

  function fetchVideos() {
    service.getVideoList().then((files) => {
      if (isAdmin)
        files.forEach(
          (item) => (item.alt = true) && (item.altIcon = 'mdi-download'),
        )
      items.value = files
      videoList.value.load(items.value)
    })
  }

  // onMounted(() => {
  fetchVideos()
  // })
</script>

<style scoped>
  iframe {
    border: none;
  }
</style>
