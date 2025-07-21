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
              <v-textarea label="Ikoner" variant="outlined" v-model="link.icon"></v-textarea>
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

  onClickOutside(linksList, event => {
    editIndex.value = -2
  })

  function addNew() {
    linksStore.add(newLink.value)
    newLink.value.name = ''
    newLink.value.url = ''
    editIndex.value = -2
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
