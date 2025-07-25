<template>
  <div class="px-1 pb-16">
    <v-sheet
      elevation="12"
      :max-width="compact ? 600 : '80%'"
      rounded="lg"
      width="100%"
      color="rgb(54, 62, 70)"
      class="pa-4 mx-auto my-5"
    >
      <v-audio-player
        ref="player"
        :src="currentTrack"
        :track-title="showTitle"
        :track-subtitle="currentTitle"
        allow-previous
        allow-next
        :compact="compact"
        :autoplay="false"
        :start-time="startTime"
        :start-volume="vol"
        :album-art="albumArt"
        @next-audio="nextSrc()"
        @previous-audio="prevSrc()"
        @time-update="onTimeUpdate"
        @volume-change="onVolumeChange"
        @play-started="onPlayStarted"
      ></v-audio-player>
    </v-sheet>

    <v-sheet
      elevation="12"
      :max-width="compact ? 600 : '80%'"
      rounded="lg"
      width="100%"
      color="rgb(54, 62, 70)"
      class="pa-4 mx-auto my-5"
    >
      <my-file-list
        ref="fileList"
        v-if="showFileList"
        :activeIndex="curIndex"
        @clicked="onFileClicked"
      ></my-file-list>

      <v-btn
        class="my-4 mr-4"
        size="large"
        icon
        v-for="show in shows"
        :elevation="show.slug === showSlug ? '8' : '0'"
        :variant="show.slug === showSlug ? 'elevated' : 'outlined'"
        @click="setShow(show.slug)"
        :title="show.title"
      >
        <v-icon size="30">{{ show.icon }}</v-icon>
      </v-btn>
    </v-sheet>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import { useDisplay } from 'vuetify'

  const { mdAndDown } = useDisplay()
  const storage = inject('storage')
  const podcasts = inject('podcasts')
  const mediasession = inject('mediasession')

  mediasession.setCallback('play', () => {
    player.value.play()
  })

  mediasession.setCallback('pause', () => {
    player.value.pause()
  })

  mediasession.setCallback('previoustrack', () => {
    prevSrc()
  })

  mediasession.setCallback('nexttrack', () => {
    nextSrc()
  })

  mediasession.setCallback('seekbackward', () => {
    player.value.skip(-5)
  })

  mediasession.setCallback('seekforward', () => {
    player.value.skip(15)
  })

  const shows = ref([])
  const showSlug = ref('spt')
  const showTitle = ref('')
  const episodes = ref([])
  const player = ref(null)
  const startTime = ref(0)
  const vol = ref(0)
  const albumArt = ref('/gif/loading.gif')
  const compact = ref(mdAndDown)
  const curIndex = ref(0)
  const fileList = ref(null)
  const showFileList = ref(true)
  const anchor = ref(null)

  let initShow = ''
  const currentPath = window.location.hash.slice(1)
  if (currentPath.startsWith('/player/')) {
    initShow = currentPath.substr('/player/'.length)
    if (initShow && initShow.length > 0) storage.setStoredShow(initShow)
  }

  const currentTrack = computed(() => {
    if (!episodes.value[curIndex.value]) return ''
    updateAlbumArt()
    return episodes.value[curIndex.value].url
  })

  const currentTitle = computed(() => {
    if (!episodes.value[curIndex.value]) return '-'
    return episodes.value[curIndex.value].title
  })

  function updateAlbumArt() {
    const trackImage = episodes.value[curIndex.value].image
    // console.log('img', trackImage)
    if (trackImage && trackImage.length > 0) albumArt.value = trackImage
  }

  async function loadShows() {
    shows.value = await podcasts.getShows().then((shows) => {
      return podcasts.getRss().then((rss) => shows.concat(rss))
    })
    setShow(showSlug.value)
  }

  function setShow(slug) {
    var show = shows.value.find((s) => s.slug === slug)
    if (show) {
      storage.setStoredShow(show.slug)
      showSlug.value = show.slug
      showTitle.value = show.title
      updateWindowTitle()
      if (!show.isRss) albumArt.value = `/jpg/${show.slug}.jpg`
      podcasts.getEpisodes(show.slug, show.isRss).then((files) => {
        episodes.value = files
        fileList.value.load(files.map((ep) => ({ text: ep.title })))
        loadLocalStorageSettings()
        updateAlbumArt()
        updateWindowTitle()
      })
    }
  }

  function nextSrc() {
    const newVal = Math.min(curIndex.value + 1, episodes.value.length - 1)
    if (newVal !== curIndex.value) {
      curIndex.value = newVal
      startTime.value = 0
      storage.setStoredEpisode(curIndex.value)
      storage.setStoredTime(0)
      updateWindowTitle()
    }
  }

  function prevSrc() {
    const newVal = Math.max(0, curIndex.value - 1)
    if (newVal !== curIndex.value) {
      curIndex.value = newVal
      startTime.value = 0
      storage.setStoredEpisode(curIndex.value)
      storage.setStoredTime(0)
      updateWindowTitle()
    }
  }

  function onFileClicked(data) {
    curIndex.value = data.index
    startTime.value = 0
    storage.setStoredEpisode(curIndex.value)
    storage.setStoredTime(0)
    updateWindowTitle()
  }

  function onTimeUpdate(time) {
    if (time > 1) storage.setStoredTime(time)
  }

  function onVolumeChange(val) {
    storage.setStoredVolume(val)
  }

  function onPlayStarted() {
    mediasession.setMetadata({
      title: currentTitle.value,
      artist: showTitle.value,
    })
  }

  function loadLocalStorageSettings() {
    storage.convertIfFresh(showSlug.value)
    var settings = storage.getPodSettings()
    if (!settings.showSlug) return
    showSlug.value = settings.showSlug
    vol.value = settings.volume
    const values = storage.getPodShowValues(showSlug.value)
    if (values.episode !== NaN) curIndex.value = values.episode
    if (values.time !== NaN) {
      startTime.value = values.time
    }
  }

  function updateWindowTitle() {
    if (currentTitle.value === '-')
      return (window.document.title = 'podcast-begy.nnel.se')
    const title = `${currentTitle.value} (${showTitle.value}) | podcast-begy.nnel.se`
    window.document.title = title
  }

  onMounted(() => {
    loadLocalStorageSettings()
    loadShows()
    updateWindowTitle()
  })
</script>

<style></style>
