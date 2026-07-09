<template>
  
  <div
    v-for="(image, key) in imagesData"
    :key="key"
    :id="galleryID"
  >
    <a
      :href="image.largeURL"
      :data-pswp-width="image.width"
      :data-pswp-height="image.height"
      target="_blank"
      rel="noreferrer"
    >
      <v-img width="150" :src="image.thumbnailURL" alt="" />
    </a>
  </div>

</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  import PhotoSwipeLightbox from 'photoswipe/lightbox';
  import 'photoswipe/style.css';

  const props = defineProps([
    'galleryID', 'images'
  ])
  const imagesData = ref(props.images)
  const lightbox = ref(null)

  onMounted(() => {
    if (!lightbox.value) {
      lightbox.value = new PhotoSwipeLightbox({
        gallery: '#' + props.galleryID,
        children: 'a',
        pswpModule: () => import('photoswipe'),
      });
      lightbox.value.init();
    }
  })

  onUnmounted(() => {
    if (lightbox.value) {
      lightbox.value.destroy();
      lightbox.value = null;
    }
  })
</script>

<style scoped>
  /*.gallery {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(auto-fill, 1fr);
    gap: 8px;
  }*/
</style>
