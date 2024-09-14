
import axios from 'axios'

import MyHeader from '../components/MyHeader.vue'
import MyForm from '../components/MyForm.vue'
import MyFileList from '../components/MyFileList.vue'
import MyAlert from '../components/MyAlert.vue'
import MyPrompt from '../components/MyPrompt.vue'
import VuetifyAudioPlayer from '../components/VuetifyAudioPlayer.vue'
import CatTax from '../components/CatTax.vue'


export default {
    install(app, options) {
        app
        .component('MyHeader', MyHeader)
        .component('MyForm', MyForm)
        .component('MyFileList', MyFileList)
        .component('MyAlert', MyAlert)
        .component('MyPrompt', MyPrompt)
        .component('VAudioPlayer', VuetifyAudioPlayer)
        .component('CatTax', CatTax)

        app.provide('service', {

            getZipList: () => fetch('/ziplist')
            .then(res => res.json())
            .then(json => json.files.map(file => {
                return {
                    key: Date.now(),
                    text: file.fileName,
                    value: file.path
                }
            })
            ),

            getVideoList: () => fetch('/videolist')
            .then(res => res.json())
            .then(json => json.files.map(file => {
                return {
                    key: Date.now(),
                    text: file.fileName,
                    value: file.path
                }
            })
            ),

            miraSay: (data) => {
                return new Promise((resolve, reject) => {
                    axios({
                        url: '/mirasay',
                        method: 'post',
                        data: data
                    })
                    .then(response => {
                        if (response && response.data) {
                            resolve(response.data)
                        }
                        else resolve({})
                    })
                    .catch(err => {
                        reject(err && err.response || {})
                        if (err && err.response) {
                            if (err.response.data instanceof Blob) {
                                const reader = new FileReader()
                                reader.onload = function() {
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
                        data
                    })
                    .then(response => {
                        if (response && response.data) {
                            resolve(response.data)
                        }
                        else resolve({})
                    })
                    .catch(err => {
                        reject(err && err.response || {})
                        if (err && err.response) {
                            if (err.response.data instanceof Blob) {
                                const reader = new FileReader()
                                reader.onload = function() {
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
                            zipName: path.replace('/zips/', '').replace('.zip', '')
                        }
                    })
                    .then(response => {
                        if (response && response.data) {
                            resolve(response.data)
                        }
                        else resolve({})
                    })
                    .catch(err => {
                        reject(err && err.response || {})
                        if (err && err.response) {
                            if (err.response.data instanceof Blob) {
                                const reader = new FileReader()
                                reader.onload = function() {
                                    console.log(reader.result)
                                }
                                reader.readAsText(err.response.data)
                            }
                        }
                    })
                })
            }
        })
    }
}