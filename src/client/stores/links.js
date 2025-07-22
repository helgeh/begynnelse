import { shallowRef, ref, computed, watch } from 'vue'
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
    else
      links.value = []
  })

  const links = ref([])
  async function reload() {
    const { data, error } = await useFetch(url, {
      beforeFetch: attachTokenHeader,
      afterFetch(ctx) {
        ctx.data.forEach(link => {
          if (link.icon && link.icon.trim().startsWith('{')) {
            link.icon = JSON.parse(link.icon)
          }
          else {
            link.icon = { dark: link.icon }
          }
        })
        return ctx
      },
      refetch: true
    }).get().json()

    if (data.value) {
      links.value = data.value
    }
  }

  async function add(link) {
    const { data, error, statusCode } = await useFetch('/lenker', {
        beforeFetch: attachTokenHeader
      })
      .post(link)
      .json()
    if (error.value) {
      return { error: 'Kunne ikke opprett ny link' }
    }
    if (data?.value?.success) {
      links.value.push({ name: link.name, url: link.url, id: data.value.linkId, category: null, tags: null, icon: {} })
      return { success: true }
    }
  }

  async function update(link) {
    const { name, url, icon, category, tags } = link
    const { data, error, statusCode } = await useFetch(`/lenker/${link.id}`, {
        beforeFetch: attachTokenHeader
      })
      .put({
        name, url, category, tags, 
        icon: JSON.stringify(icon),
      })
    if (error?.value) {
      return { error: 'Kunne ikke oppdatere linken :('}
    }
    return { success: true }
  }

  async function remove(id) {
    const { data, error, statusCode } = await useFetch(`/lenker/${id}`, {
        beforeFetch: attachTokenHeader
      })
      .delete()
    if (error?.value) {
      return { error: 'Kunne ikke slette linken :('}
    }
    links.value.splice(links.value.findIndex(l => l.id === id), 1)
    return { success: true }
  }

  return { links, reload, add, update, remove }
})
