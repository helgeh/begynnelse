import { defineStore } from 'pinia'
import { ref, shallowRef, inject } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'

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

export const usePppStore = defineStore('ppp', () => {

  const service = inject('service')
  const sections = ref([])
  const items = ref([])
  const isAutoplay = shallowRef(false)
  const isRandom = shallowRef(false)
  const interval = ref(5)
  const lightbox = ref(null)
  let sequence = []
  let randomIndex = 0
  let timeout = null

  async function init() {
    await fetchItems()
    initLightbox()
  }

  function destroy() {
    if (lightbox.value) {
      lightbox.value.destroy()
      lightbox.value = null
    }
    sections.value = []
    items.value = []
    sequence = []
  }

  async function fetchItems() {
    let tot = 0
    const response = await service.getPppList()
    sections.value = response.folders
    for (let i = 0; i < sections.value.length; i++) {
      const files = await service.getPppContents(response.folders[i])
      items.value[sections.value[i]] = files
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
        if (isAutoplay.value)
          runAutoplay()
      })
    }
  }

  function runAutoplay() {
    if (timeout != null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      const pswp = lightbox.value.pswp
      if (!pswp) return
      if (!isRandom.value)
        pswp.next()
      else
        pswp.goTo(nextRandom())
      if (isAutoplay.value)
        runAutoplay()
    }, interval.value * 1000)
  }

  function nextRandom() {
    if (randomIndex >= sequence.length)
      randomIndex = 0
    return sequence[randomIndex++]
  }

  return {
    init,
    destroy,
    sections,
    items,
    isAutoplay,
    isRandom,
    interval,
    toggleAutoplay: () => isAutoplay.value = !isAutoplay.value,
    toggleRandom: () => isRandom.value = !isRandom.value,
    setInterval: (val) => interval.value = val,
    fullscreen: () => {
      if (document.fullscreenElement) {
        document
          .exitFullscreen()
          // .then(() => console.log("Document Exited from Full screen mode"))
          .catch((err) => console.error(err));
      } else {
        requestFullScreen(document.documentElement)
      }
    },
  }
})
