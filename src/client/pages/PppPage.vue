<template>

  <v-container>
    <v-row v-for="(gall) in galleries" class="gall-container" :id="gall">
      <SimpleGallery v-if="items[gall]?.length" :galleryID="gall" :images="items[gall]" />
    </v-row>
  </v-container>

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
  .gall-container {
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
