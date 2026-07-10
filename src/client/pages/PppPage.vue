<template>

  <v-container id="gallery">
    <v-row v-for="(gall) in galleries" class="gallery-container">
      <SimpleGallery v-if="items[gall]?.length" :images="items[gall]" />
    </v-row>
  </v-container>

  <v-container>
    <v-row>
      <v-btn @click="fsClick">FS</v-btn>
      <v-btn :active="autoplay" @click="apClick">AP</v-btn>
      <v-select label="interval" :items="[3, 5, 7, 10, 15, 30]" :model-value="interval" @update:modelValue="interval = $event" density="compact"></v-select>
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
  const autoplay = ref(false)
  const interval = ref(5)
  let timeout = null

  function fsClick() {
    requestFullScreen(document.documentElement)
  }

  function apClick() {
    autoplay.value = !autoplay.value
  }

  function runAutoplay() {
    if (timeout != null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      const pswp = lightbox.value.pswp
      if (!pswp) return
      pswp.next()
      if (autoplay.value)
        runAutoplay()
    }, interval.value * 1000)
  }

  onMounted(async () => {
    await fetchVideos()
    if (!lightbox.value) {
      lightbox.value = new PhotoSwipeLightbox({
        gallery: '#gallery',
        children: 'a',
        pswpModule: () => import('photoswipe'),
        initialZoomLevel: 'fill',
        secondaryZoomLevel: 1,
        maxZoomLevel: 2,
      })
      lightbox.value.init()
      lightbox.value.on('beforeOpen', () => {
        if (autoplay.value)
          runAutoplay()
      })
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

  function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
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
