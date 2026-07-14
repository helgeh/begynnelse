<template>

  <div id="gallery">
    <div v-for="(section) in ppp.sections" class="gallery-container">
      <SimpleGallery v-if="ppp.items[section]?.length" :images="ppp.items[section]" />
    </div>
  </div>

  <div>
    <div class="gallery-controls">
      <v-btn :active="ppp.isFullscreen" @click="ppp.fullscreen()">FS</v-btn>
      <v-btn :active="ppp.isAutoplay" @click="ppp.toggleAutoplay()">AP</v-btn>
      <v-btn :active="ppp.isRandom" @click="ppp.toggleRandom()">RND</v-btn>
      <v-select label="interval" :items="[3, 5, 7, 10, 15, 30]" :model-value="ppp.interval" @update:modelValue="ppp.setInterval($event)" density="compact"></v-select>
    </div>
  </div>

</template>

<script setup>
  import { onMounted, onUnmounted } from 'vue'
  import 'photoswipe/style.css'
  import SimpleGallery from '../components/SimpleGallery.vue'
  import { usePppStore } from '../stores/ppp'

  const ppp = usePppStore()

  onMounted(async () => {
    ppp.init()
  })

  onUnmounted(() => {
    ppp.destroy()
  })

</script>

<style scoped>
  .gallery-container {
    display: flex;
    overflow-x: scroll;
    flex-wrap: nowrap;
    &::before {
      content: attr(data-id);
      position: absolute;
      left: 20px;
      width: 20px;
    }
  }
  .gallery-controls {
    display: flex;
    margin-top: 15px;
  }
</style>
