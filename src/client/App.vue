<template>
  <!-- <v-app class="throw-ups"> -->
  <v-app class="">
    <!-- <CatTax /> -->

    <div class="page-content">
      <component :is="currentView" />
    </div>

    <v-bottom-navigation :modelValue="route" @update:modelValue="() => {}" mode="shift" color="primary">
      <v-btn href="#/">
        <v-icon>mdi-list-box</v-icon>
        <span>Links</span>
      </v-btn>

      <v-btn href="#/config">
        <v-icon>mdi-playlist-edit</v-icon>
        <span>Config</span>
      </v-btn>

      <!-- <v-btn href="#/mira">
        <v-icon>mdi-dog</v-icon>
        <span>Mira</span>
      </v-btn> -->

      <v-btn href="#/zips">
        <v-icon>mdi-folder-zip</v-icon>
        <span>Zips</span>
      </v-btn>

      <v-btn href="#/videos">
        <v-icon>mdi-movie</v-icon>
        <span>Movies</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
  import { ref, computed } from 'vue'

  import HomePage from './pages/HomePage.vue'
  import MyPage from './pages/MyPage.vue'
  import VerifyEmailPage from './pages/VerifyEmailPage.vue'
  import ConfigPage from './pages/ConfigPage.vue'
  import CreateManyLinksPage from './pages/CreateManyLinksPage.vue'
  import MiraMull from './pages/MiraMull.vue'
  import ZipList from './pages/ZipList.vue'
  import PodPlayer from './pages/PodPlayer.vue'
  import AboutPage from './pages/AboutPage.vue'
  import VideoPage from './pages/VideoPage.vue'
  import NotFoundPage from './pages/NotFoundPage.vue'

  const routes = {
    '/': HomePage,
    '/config': ConfigPage,
    '/zips': ZipList,
    '/videos': VideoPage,

    // These are not in the exposed menu and need to come
    // last to not f up the 'active' state
    
    '/links': HomePage,
    '/many-links': CreateManyLinksPage,
    '/verify': VerifyEmailPage,

    '/mira': MiraMull,
    '/player': PodPlayer,
    '/about': AboutPage,
  }

  const currentPath = ref(window.location.hash.slice(1))
  const route = ref(getRouteIndex())

  const currentView = computed(() => {
    let index = currentPath.value || '/'
    if (index.substr(1).indexOf('/') >= 0) {
      index = index.substr(0, index.substr(1).indexOf('/') + 1)
    }
    return routes[index] || NotFoundPage
  })

  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash.slice(1)
    route.value = getRouteIndex()
  })

  function getRouteIndex() {
    return Object.keys(routes).indexOf(currentPath.value || '/')
  }
</script>

<style scoped>
  .page-content {
    position: relative;
    margin-bottom: 50px;
  }

  /*.logo {
height: 6em;
padding: 1.5em;
will-change: filter;
transition: filter 300ms;
}
.logo:hover {
filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
filter: drop-shadow(0 0 2em #42b883aa);
}*/
</style>
