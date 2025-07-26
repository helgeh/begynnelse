import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import MyPage from './pages/MyPage.vue'
import VerifyEmailPage from './pages/VerifyEmailPage.vue'
import ConfigPage from './pages/ConfigPage.vue'
import CreateManyLinksPage from './pages/CreateManyLinksPage.vue'
import MiraMull from './pages/MiraMull.vue'
import ZipList from './pages/ZipList.vue'
import PodPlayer from './pages/PodPlayer.vue'
import AboutPage from './pages/AboutPage.vue'
import VideoPage from './pages/VideoPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'



// const routes = {
//   '/': HomePage,
//   '/config': ConfigPage,
//   '/zips': ZipList,
//   '/videos': VideoPage,

//   // These are not in the exposed menu and need to come
//   // last to not f up the 'active' state
  
//   '/links': HomePage,
//   '/many-links': CreateManyLinksPage,
//   '/verify': VerifyEmailPage,

//   '/mira': MiraMull,
//   '/player': PodPlayer,
//   '/about': AboutPage,
// }

const routes = [
  { path: '/', component: HomePage },
  { path: '/config', component: ConfigPage },
  { path: '/zips', component: ZipList },
  { path: '/videos', component: VideoPage },
  { path: '/many-links', component: CreateManyLinksPage },
  { path: '/verify', component: VerifyEmailPage },
  { path: '/mira', component: MiraMull },
  { path: '/player', component: PodPlayer },
  { path: '/about', component: AboutPage },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
