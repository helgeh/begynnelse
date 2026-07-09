<template>

  <div v-for="(gall) in galleries">
    <p>{{ gall }}</p>
    <SimpleGallery v-if="items[gall]?.length" :galleryID="gall" :images="items[gall]" />
  </div>

</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'

  import SimpleGallery from '../components/SimpleGallery.vue'

  const service = inject('service')
  const galleries = ref([])
  const items = ref([])

  async function fetchVideos() {
    const response = await service.getPppList()
    galleries.value = response.folders
    for (let i = 0; i < galleries.value.length; i++) {
      const files = await service.getPppContents(response.folders[i])
      items.value[galleries.value[i]] = files
    }
  }

  onMounted(() => {
    fetchVideos()
  })
</script>

<style scoped>
  iframe {
    border: none;
  }
</style>
