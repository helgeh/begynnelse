<template>
  <v-card 
    :href="link.url" 
    @click="$emit('click', $event, link)" 
    :title="link.name"
  >
    <template v-slot:append v-if="link.icon">
      <v-icon size="32">
        <v-img
          :alt="link.name"
          :src="link.icon[theme] ? link.icon[theme] : link.icon"
        ></v-img>
      </v-icon>
    </template>
  </v-card>
</template>

<script setup>
  defineProps(['link', 'theme'])
  defineEmits(['click'])
</script>
