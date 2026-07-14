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

function requestFullScreen() {
  const element = document.documentElement
  // Supports most browsers and their versions.
  const requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen

  if (requestMethod) { // Native full screen.
      requestMethod.call(element)
  }
  else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
      const wscript = new ActiveXObject("WScript.Shell")
      if (wscript !== null) {
          wscript.SendKeys("{F11}")
      }
  }
}

const fullscreenBtn = '<svg width="32" height="32" viewBox="-4 -4 32 32" aria-hidden="true" class="pswp__icn"><use class="pswp__icn-shadow" xlink:href="#pswp__icn-fullscreen"></use><path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" id="pswp__icn-fullscreen"/></svg>'
const fullscreenBtnActive = '<svg width="32" height="32" viewBox="-4 -4 32 32" aria-hidden="true" class="pswp__icn"><use class="pswp__icn-shadow" xlink:href="#pswp__icn-fullscreen"></use><path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z" id="pswp__icn-fullscreen"/></svg>'
const autoplayBtn = '<svg width="32" height="32" viewBox="-4 -4 32 32" aria-hidden="true" class="pswp__icn"><use class="pswp__icn-shadow" xlink:href="#pswp__icn-autoplay"></use><path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,8V16L15,12L10,8Z" id="pswp__icn-autoplay"/></svg>'
const autoplayBtnActive = '<svg width="32" height="32" viewBox="-4 -4 32 32" aria-hidden="true" class="pswp__icn"><use class="pswp__icn-shadow" xlink:href="#pswp__icn-autoplay"></use><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M13 16V8H15V16H13M9 16V8H11V16H9" id="pswp__icn-autoplay"/></svg>'


export const usePppStore = defineStore('ppp', () => {

  const service = inject('service')
  const sections = ref([])
  const items = ref([])
  const isFullscreen = shallowRef(false)
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
      addLightboxUi(lightbox.value)
      lightbox.value.init()
      lightbox.value.on('beforeOpen', () => {
        if (isAutoplay.value)
          runAutoplay()
      })
    }
  }

  function addLightboxUi(lightbox) {
    lightbox.on('uiRegister', function() {
      lightbox.pswp.ui.registerElement({
        name: 'fullscreen',
        ariaLabel: 'Toggle fullscreen',
        order: 9,
        isButton: true,
        html: fullscreenBtn,
        onClick: (event, el) => {
          toggleFullscreen()
          if (isFullscreen.value)
            el.innerHTML = fullscreenBtnActive
          else
            el.innerHTML = fullscreenBtn
        },
        onInit: (el, pswp) => {
          if (isFullscreen.value) {
            el.innerHTML = fullscreenBtnActive
          }
        },
      })
      lightbox.pswp.ui.registerElement({
        name: 'autoplay',
        ariaLabel: 'Toggle autoplay',
        order: 9,
        isButton: true,
        html: autoplayBtn,
        onClick: (event, el) => {
          isAutoplay.value = !isAutoplay.value
          if (isAutoplay.value) {
            el.innerHTML = autoplayBtnActive
            runAutoplay()
          }
          else {
            el.innerHTML = autoplayBtn
          }
        },
        onInit: (el, pswp) => {
          if (isAutoplay.value) {
            el.innerHTML = autoplayBtnActive
          }
        },
      })
    })
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      isFullscreen.value = false
      document
        .exitFullscreen()
        // .then(() => isFullscreen.value = false)
        .catch((err) => console.error(err));
    } else {
      isFullscreen.value = true
      requestFullScreen()
    }
  }

  function runAutoplay() {
    if (timeout != null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      if (!isAutoplay.value)
        return
      const pswp = lightbox.value.pswp
      if (!pswp) return
      if (!isRandom.value)
        pswp.next()
      else
        pswp.goTo(nextRandom())
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
    isFullscreen,
    isAutoplay,
    isRandom,
    interval,
    toggleAutoplay: () => isAutoplay.value = !isAutoplay.value,
    toggleRandom: () => isRandom.value = !isRandom.value,
    setInterval: (val) => interval.value = val,
    fullscreen: () => {
      toggleFullscreen()
    },
  }
})
