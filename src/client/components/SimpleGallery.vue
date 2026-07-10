<template>
  
  <a
    v-for="(image, key) in images"
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
  defineProps(['images'])
</script>
