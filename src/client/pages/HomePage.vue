<template>
  <v-container responsive>

    <v-row dense class="mb-5" v-for="(prio, i) in priorities" :key="i">
      <v-col
        v-for="(link, j) in linksStore.prioritize(prio)"
        :key="j"
        cols="6"
        sm="6"
        md="3"
        lg="2"
        xl="1"
      >
        <my-link-card :link="link" @click="onCardClick" :theme="theme"></my-link-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-5">
      <v-col
        v-for="(link, j) in linksStore.getUnprioritized()"
        :key="j"
        cols="6"
        sm="6"
        md="3"
        lg="2"
        xl="1"
      >
        <my-link-card :link="link" @click="onCardClick" :theme="theme"></my-link-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
  import { ref, shallowRef, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useFetch } from '@vueuse/core'
  import { useAppStore, useUserStore, useLinksStore } from '../stores'
  import { attachTokenHeader } from '../stores'
  
  const { app } = useAppStore()
  const userStore = useUserStore()
  const { user, isLoggedIn } = storeToRefs(userStore)
  const linksStore = useLinksStore()
  const { priorities } = storeToRefs(linksStore)
  const theme = shallowRef('dark')

  function onCardClick(event, link) {
    if (link.href === 'void(0)') {
      // overlay.value = true
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }
</script>

<style scoped></style>
