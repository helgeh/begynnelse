
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import service from './service'
// import router from '../router'

export function registerPlugins (app) {
  loadFonts()
  app
    .use(vuetify)
    .use(service)
    // .use(router)
}
