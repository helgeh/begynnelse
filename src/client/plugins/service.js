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
      .component('CatTax', CatTax)

    const ikkeGodkjent = shallowRef(false)
    app.provide('ikkeGodkjent', ikkeGodkjent)
    app.provide('tilgang', {
      blimed: async (epost, passord) => {
        try {
          ikkeGodkjent.value = false
          const result = await axios.post('/blimed', { usr: epost, pw: passord })
          // if (result.data.success) {
          //   console.log('heck yes, registered')
          // }
          return result.data.success
        }
        catch (err) {
          if (err.response.data.code !== undefined) {
            if (err.response.data.code === 0) {
              return Promise.reject('Passordet må være lenger (minimum 8, helst 11)')
            }
            if (err.response.data.code < 3) {
              return Promise.reject('Passordet må ha være mer komplekst... Prøv store/små bokstaver, tall, tegn og/eller lengde på mer enn 11 tegn.')
            }
          }
        }
      },
      godkjenn: async (epost, passord) => {
        try {
          ikkeGodkjent.value = false
          const result = await axios.post('/blimed/godkjenn', { usr: epost, pw: passord })
          // if (result.data.success)
          //   console.log('new email should have been sent')
          return result.data
        }
        catch (err) {
          // console.log('kunne ikke sende epost eller noe?')
          return false
        }
      },
      godkjennHemmelighet: async (epost, hemmelighet) => {
        try {
          const response = await axios.get(`/blimed/godkjenn/${epost}/${hemmelighet}`)
          return response.data
        }
        catch (err) {
          // console.log('feil under godkjenning', err)
          // throw new Error('Kunne ikke godkjenne')
          return Promise.reject('Kunne ikke godkjenne')
        }
      },
      heisann: async (epost, passord) => {
        try {
          ikkeGodkjent.value = false
          const response = await axios.post(`/heisann`, {
            usr: epost,
            pw: passord,
          })
          if (response.status !== 200) {
            throw new Error('Ikke greit')
          }
          const token = response.data.token

          // document.cookie = `token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`
          localStorage.setItem('mitt-merke', token)

          return token
        } catch (error) {
          console.warn('Feil ved innlogging: ', error)
          if (error.response.status === 403)
            ikkeGodkjent.value = true
          throw new Error(error?.response?.data?.error || 'Sorry, innlogging feilet!')
        }
      },
      lenker: async () => {
        try {
          const response = await fetch('/lenker', addAuthHeader())
          return await response.json()
        }
        catch (error) {
          // console.log('feil ved henting av lenker', error.message)
          throw new Error('Sorry, kunne ikke hente lenker!')
        }
      },
      hade: () => {
        // document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        return new Promise((res, rej) => {
          localStorage.removeItem('mitt-merke')
          res()
        })
      },
      allerede: () => {
        const merke = localStorage.getItem('mitt-merke')
        return merke != null
      },
      slettmeg: async () => {
        try {
          const response = await fetch('/slettmeg', addAuthHeader({method: 'POST'}))
          localStorage.removeItem('mitt-merke')
          return true
        }
        catch (err) {
          console.log('feil ved sletting', err)
          return false
        }
      }
    })

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
