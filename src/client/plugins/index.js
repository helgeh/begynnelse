import { loadFonts } from './webfontloader'
import { createPinia } from 'pinia'
import vuetify from './vuetify'
import service from './service'
import podcasts from './podcasts'
import storage from './storage'
import mediasession from './mediasession'
import router from '../routes'

export function registerPlugins(app) {
  loadFonts()
  app
    .use(vuetify)
    .use(createPinia())
    .use(service)
    .use(podcasts)
    .use(storage)
    .use(mediasession)
    .use(router)
}
