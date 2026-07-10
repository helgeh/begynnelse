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
      <v-btn :active="random" @click="rndClick">RND</v-btn>
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
  const random = ref(false)
  let randomIndex = 0
  let sequence = []
  let timeout = null

  function fsClick() {
    requestFullScreen(document.documentElement)
  }

  function apClick() {
    autoplay.value = !autoplay.value
  }

  function rndClick() {
    random.value = !random.value
  }

  function runAutoplay() {
    if (timeout != null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      const pswp = lightbox.value.pswp
      if (!pswp) return
      if (!random.value)
        pswp.next()
      else
        pswp.goTo(nextRandom())
      if (autoplay.value)
        runAutoplay()
    }, interval.value * 1000)
  }

  function nextRandom() {
    if (randomIndex >= sequence.length)
      randomIndex = 0
    return sequence[randomIndex++]
  }

  onMounted(async () => {
    await fetchVideos()
    initLightbox()
  })

  onUnmounted(() => {
    if (lightbox.value) {
      lightbox.value.destroy()
      lightbox.value = null
    }
  })

  async function fetchVideos() {
    let tot = 0
    const response = await service.getPppList()
    galleries.value = response.folders
    for (let i = 0; i < galleries.value.length; i++) {
      const files = await service.getPppContents(response.folders[i])
      items.value[galleries.value[i]] = files
      tot += files.length
    }
    sequence = randomSequence(tot)
  }

  function initLightbox() {
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
  }

  function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen

    if (requestMethod) { // Native full screen.
        requestMethod.call(element)
    }
    else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell")
        if (wscript !== null) {
            wscript.SendKeys("{F11}")
        }
    }
  }

  function randomSequence(len) {
    let currentIndex = len
    let i = 1
    const array = Array.from({length: len}, () => i++)
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }
    return array
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
