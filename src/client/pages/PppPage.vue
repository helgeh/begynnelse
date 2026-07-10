<template>

  <v-container id="gallery">
    <v-row v-for="(gall) in galleries" class="gallery-container">
      <SimpleGallery v-if="items[gall]?.length" :images="items[gall]" />
    </v-row>
  </v-container>

</template>

<script setup>
  import { ref, inject, onMounted, onUnmounted } from 'vue'
  import PhotoSwipeLightbox from 'photoswipe/lightbox'
  import 'photoswipe/style.css'
  import SimpleGallery from '../components/SimpleGallery.vue'

  const service = inject('service')
  const galleries = ref([])
  const items = ref([])
  const lightbox = ref(null)

  onMounted(async () => {
    await fetchVideos()
    if (!lightbox.value) {
      lightbox.value = new PhotoSwipeLightbox({
        gallery: '#gallery',
        children: 'a',
        pswpModule: () => import('photoswipe'),
        // initialZoomLevel: 'fill',
        // secondaryZoomLevel: 1,
        // maxZoomLevel: 2,
      })
      lightbox.value.init()
    }
  })

  onUnmounted(() => {
    if (lightbox.value) {
      lightbox.value.destroy()
      lightbox.value = null
    }
  })

  async function fetchVideos() {
    const response = await service.getPppList()
    galleries.value = response.folders
    for (let i = 0; i < galleries.value.length; i++) {
      const files = await service.getPppContents(response.folders[i])
      items.value[galleries.value[i]] = files
    }
  }
</script>

<style scoped>
  .gallery-container {
    overflow-x: scroll;
    flex-wrap: nowrap;
    &::before {
      content: attr(data-id);
      position: absolute;
      left: 20px;
      width: 20px;
    }
  }
</style>
