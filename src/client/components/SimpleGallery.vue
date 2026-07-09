<template>
  
  <a
    v-for="(image, key) in imagesData"
    :key="key"
    :href="image.largeURL"
    :data-pswp-width="image.width"
    :data-pswp-height="image.height"
    target="_blank"
    rel="noreferrer"
    class="image-thumb"
  >
    <v-img width="150" :src="image.thumbnailURL" alt="" />
  </a>

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
