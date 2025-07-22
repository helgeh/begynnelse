<template>

  <v-list ref="links-list">
    <v-list-item v-for="(link, i) in links" :key="i" @click="editIndex = i">
      <v-container>
        <div v-if="editIndex === i">
          <v-row>
            <v-col>
              <v-text-field label="Navn" variant="outlined" v-model="link.name"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Url" variant="outlined" v-model="link.url"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field label="Kategori" variant="outlined" v-model="link.category"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Tagger" variant="outlined" v-model="link.tags"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field label="Ikon (dark)" variant="outlined" v-model="link.icon.dark"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field label="Ikon (light)" variant="outlined" v-model="link.icon.light"></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-btn @click="update" class="me-2">Lagre</v-btn> 
              <v-icon color="success" v-if="updateOk">mdi-thumb-up</v-icon>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <p>{{ link.name }}</p>
        </div>
      </v-container>
    </v-list-item>
    <v-list-item @click="editIndex = -1">
      <v-container>
        <div v-if="editIndex === -1">
          <v-row dense>
            <v-col>
              <v-text-field label="Navn" variant="outlined" v-model="newLink.name" :autofocus="true" @keypress="onAddNewKeyPress($event, 0)"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Url" variant="outlined" v-model="newLink.url" @keypress="onAddNewKeyPress($event, 1)" ref="newlink-url-input"></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="addError" dense>
            <v-col>
              <v-alert type="error">{{ addError }}</v-alert>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-btn @click.prevent.stop="addNew">Legg til</v-btn>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <p><v-icon>mdi-plus</v-icon></p>
        </div>
      </v-container>
    </v-list-item>
  </v-list>
  
</template>

<script setup>
  import { shallowRef, ref, useTemplateRef } from 'vue'
  import { storeToRefs } from 'pinia'
  import { onClickOutside } from '@vueuse/core'

  import { useLinksStore } from '../stores'

  const newLinkUrlInput = useTemplateRef('newlink-url-input')
  const linksList = useTemplateRef('links-list')
  const linksStore = useLinksStore()
  const { links } = storeToRefs(linksStore)

  const editIndex = shallowRef(-2)
  const newLink = ref({name: '', url: ''})
  const updateOk = shallowRef(false)
  const addError = ref('')

  onClickOutside(linksList, event => {
    editIndex.value = -2
  })

  async function addNew() {
    const result = await linksStore.add(newLink.value)
    if (result?.error) {
      addError.value = result?.error || 'Noe gikk feil!'
      return
    }
    newLink.value.name = ''
    newLink.value.url = ''
    editIndex.value = -2
  }

  async function update() {
    const link = links.value[editIndex.value]
    if (link) {
      const result = await linksStore.update(link)
      if (result.success) {
        updateOk.value = true
        setTimeout(_ => updateOk.value = false, 3000)
      }
    }
  }

  async function onAddNewKeyPress(evt, id) {
    if (evt.code === 'Enter') {
      if (id === 0) 
        newLinkUrlInput.value.focus()
      else if (id === 1)
        addNew()
    }
  }
</script>

<style scoped></style>
