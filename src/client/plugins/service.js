import axios from 'axios'
import { shallowRef } from 'vue'

import GetAccess from '../components/GetAccess.vue'
import MyHeader from '../components/MyHeader.vue'
import MyForm from '../components/MyForm.vue'
import MyFileList from '../components/MyFileList.vue'
import MyAlert from '../components/MyAlert.vue'
import MyPrompt from '../components/MyPrompt.vue'
import VuetifyAudioPlayer from '../components/VuetifyAudioPlayer.vue'
import MyLinksList from '../components/MyLinksList.vue'
import MyLinksArea from '../components/MyLinksArea.vue'
import MyLink from '../components/MyLink.vue'
import MyLinkCard from '../components/MyLinkCard.vue'
import EditLinks from '../components/EditLinks.vue'
import MySubscriptionForm from '../components/MySubscriptionForm.vue'
import GreeterPanel from '../components/GreeterPanel.vue'
import LoginPanel from '../components/LoginPanel.vue'
import CatTax from '../components/CatTax.vue'

const addAuthHeader = (data) => {
  data = data || {}
  data.headers = data.headers || {}
  const token = localStorage.getItem('mitt-merke')
  if (token)
    data.headers.Authorization = 'Bearer ' + localStorage.getItem('mitt-merke')
  return data
}

export default {
  install(app, options) {
    
    app
      .component('GetAccess', GetAccess)
      .component('MyHeader', MyHeader)
      .component('MyForm', MyForm)
      .component('MyFileList', MyFileList)
      .component('MyAlert', MyAlert)
      .component('MyPrompt', MyPrompt)
      .component('VAudioPlayer', VuetifyAudioPlayer)
      .component('MyLinksList', MyLinksList)
      .component('MyLinksArea', MyLinksArea)
      .component('MyLink', MyLink)
      .component('MyLinkCard', MyLinkCard)
      .component('EditLinks', EditLinks)
      .component('MySubscriptionForm', MySubscriptionForm)
      .component('GreeterPanel', GreeterPanel)
      .component('LoginPanel', LoginPanel)
      .component('CatTax', CatTax)

    app.provide('service', {
      getZipList: () =>
        fetch('/ziplist', addAuthHeader())
          .then((res) => {
            if (!res.ok) throw new Error('Sorry, not allowed!')
            else return res.json()
          })
          .then((json) =>
            json.files.map((file) => ({
              key: Date.now(),
              text: file.fileName,
              value: file.path,
            })),
          ),

      getVideoList: () =>
        fetch('/videolist')
          .then((res) => res.json())
          .then((json) =>
            json.files.map((file) => {
              return {
                key: Date.now(),
                text: file.fileName,
                value: file.path,
              }
            }),
          ),

      miraSay: (data) => {
        return new Promise((resolve, reject) => {
          axios({
            url: '/mirasay',
            method: 'post',
            data: data,
          })
            .then((response) => {
              if (response && response.data) {
                resolve(response.data)
              } else resolve({})
            })
            .catch((err) => {
              reject((err && err.response) || {})
              if (err && err.response) {
                if (err.response.data instanceof Blob) {
                  const reader = new FileReader()
                  reader.onload = function () {
                    console.log(reader.result)
                  }
                  reader.readAsText(err.response.data)
                }
              }
            })
        })
      },

      uploadFonts: (data) => {
        return new Promise((resolve, reject) => {
          axios({
            url: '/upload',
            method: 'post',
            data,
          })
            .then((response) => {
              if (response && response.data) {
                resolve(response.data)
              } else resolve({})
            })
            .catch((err) => {
              reject((err && err.response) || {})
              if (err && err.response) {
                if (err.response.data instanceof Blob) {
                  const reader = new FileReader()
                  reader.onload = function () {
                    console.log(reader.result)
                  }
                  reader.readAsText(err.response.data)
                }
              }
            })
        })
      },

      removeZip: (path) => {
        return new Promise((resolve, reject) => {
          axios({
            url: '/removeZip',
            method: 'get',
            params: {
              zipName: path.replace('/zips/', '').replace('.zip', ''),
            },
          })
            .then((response) => {
              if (response && response.data) {
                resolve(response.data)
              } else resolve({})
            })
            .catch((err) => {
              reject((err && err.response) || {})
              if (err && err.response) {
                if (err.response.data instanceof Blob) {
                  const reader = new FileReader()
                  reader.onload = function () {
                    console.log(reader.result)
                  }
                  reader.readAsText(err.response.data)
                }
              }
            })
        })
      },
    })
  },
}
