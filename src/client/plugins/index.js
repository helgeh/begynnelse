
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import service from './service'
import podcasts from './podcasts'
import storage from './storage'
import mediasession from './mediasession'
// import router from '../router'

export function registerPlugins (app) {
    loadFonts()
    app
    .use(vuetify)
    .use(service)
    .use(podcasts)
    .use(storage)
    .use(mediasession)
// .use(router)
}
