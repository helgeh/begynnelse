import { createWebHistory, createRouter } from 'vue-router'

import BottomNav from '../components/BottomNav.vue'
import HomePage from '../pages/HomePage.vue'
import MyPage from '../pages/MyPage.vue'
import VerifyEmailPage from '../pages/VerifyEmailPage.vue'
import ConfigPage from '../pages/ConfigPage.vue'
import CreateManyLinksPage from '../pages/CreateManyLinksPage.vue'
import MiraMull from '../pages/MiraMull.vue'
import ZipList from '../pages/ZipList.vue'
import PodPlayer from '../pages/PodPlayer.vue'
import AboutPage from '../pages/AboutPage.vue'
import VideoPage from '../pages/VideoPage.vue'
import PppPage from '../pages/PppPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

import { useUserStore } from '../stores'

const routes = [
  {
    path: '/',
    name: 'home',
    components: {
      default: HomePage,
      bottom: BottomNav,
    },
    meta: { requiresAuth: true },
  },
  {
    path: '/config',
    name: 'config',
    components: {
      default: ConfigPage,
      bottom: BottomNav,
    },
  },
  {
    path: '/zips',
    name: 'zips',
    components: {
      default: ZipList,
      bottom: BottomNav,
    },
  },
  {
    path: '/videos',
    name: 'videos',
    components: {
      default: VideoPage,
      bottom: BottomNav,
    },
  },
  { path: '/many-links', name: 'many-links', component: CreateManyLinksPage },
  { path: '/verify', name: 'verify', component: VerifyEmailPage },
  { path: '/mira', name: 'mira', component: MiraMull },
  { path: '/player', name: 'player', component: PodPlayer },
  { path: '/ppp', name: 'ppp', component: PppPage, meta: { requiresAuth: true } },
  { path: '/about', name: 'about', component: AboutPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  if (!to.meta.requiresAuth) {
    return next()
  }
  const err = await store.loadme()
  if (err && !store.isLoggedIn) next({ name: 'config' })
  else next()
})

export default router
