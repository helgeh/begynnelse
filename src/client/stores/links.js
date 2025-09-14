import { shallowRef, ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useFetch } from '@vueuse/core'

import { attachTokenHeader, useUserStore } from '.'

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
  const categories = ref([
    {
      "name": "*",
      "title": "*Alle"
    },
  ])
  const curCat = shallowRef(0)
  const priorities = ref(['pri1', 'pri2', 'pri3', 'pri4', 'pri5', 'pri6']) // <-- later get from localStorage

  function prioritize(prio) {
    const curSec = categories.value[curCat.value]?.name
    return links.value.filter(link => {
      return (curSec === '*' || link.category === curSec) && link.tags?.indexOf(prio) >= 0
    })
  }

  function getUnprioritized() {
    const curSec = categories.value[curCat.value]?.name
    return links.value.filter(link => {
      const inPrios = priorities.value.some(prio => link.tags?.indexOf(prio) >= 0)
      return (curSec === '*' || link.category === curSec) && !inPrios
    })
  }

  async function reload() {
    await reloadCategories()
    await reloadLinks()
  }

  async function reloadCategories() {
    const { data, error } = await useFetch('/kategorier', {
      beforeFetch: attachTokenHeader,
      refetch: true
    }).get().json()

    if (data.value) {
      categories.value.push(...data.value)
    }
  }

  async function reloadLinks() {
    const { data, error } = await useFetch('/lenker', {
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
      return { error: 'Kunne ikke opprette ny link' }
    }
    if (data?.value?.success) {
      links.value.push({ name: link.name, url: link.url, id: data.value.linkId, category: null, tags: null, icon: {} })
      return { success: true }
    }
  }

  async function addMany(links) {
    const { data, error, statusCode } = await useFetch('/mange-lenker', {
        beforeFetch: attachTokenHeader
      })
      .post(links)
      .json()
    if (error.value) {
      return { error: 'Kunne ikke opprette mange nye linker' }
    }
    if (data?.value?.success) {
      return await reload()
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
      return { error: 'Kunne ikke oppdatere linken :(' }
    }
    return { success: true }
  }

  async function remove(id) {
    const { data, error, statusCode } = await useFetch(`/lenker/${id}`, {
        beforeFetch: attachTokenHeader
      })
      .delete()
    if (error?.value) {
      return { error: 'Kunne ikke slette linken :(' }
    }
    links.value.splice(links.value.findIndex(l => l.id === id), 1)
    return { success: true }
  }

  return {

    // state
    categories,
    links,
    priorities,

    // methods
    prioritize,
    getUnprioritized,
    reload,
    add,
    addMany,
    update,
    remove
  }
})
