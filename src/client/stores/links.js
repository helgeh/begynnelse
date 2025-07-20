import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useFetch } from '@vueuse/core'

import { attachTokenHeader, useUserStore } from '.'

const url = `/lenker`

export const useLinksStore = defineStore('links', () => {
  const userStore = useUserStore()
  const { isLoggedIn } = storeToRefs(userStore)
  watch(isLoggedIn, (newState, oldState) => {
    if (newState)
      reload()
  })

  const links = ref([])
  async function reload() {
    const { data, error } = await useFetch(url, {
      beforeFetch: attachTokenHeader,
      afterFetch(ctx) {
        ctx.data.forEach(link => {
          if (link.icon && link.icon.startsWith('{'))
            link.icon = JSON.parse(link.icon)
        })
        return ctx
      },
      refetch: true
    }).get().json()

    if (data.value) {
      links.value = data.value
    }
  }

  return { links, reload }
})
