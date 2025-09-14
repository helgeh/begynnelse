import { createWebHistory, createRouter } from 'vue-router'

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
import NotFoundPage from '../pages/NotFoundPage.vue'

import { useUserStore } from '../stores'

const routes = [
  { path: '/', name: 'home', component: HomePage, meta: { requiresAuth: true }, },
  { path: '/config', name: 'config', component: ConfigPage },
  { path: '/zips', name: 'zips', component: ZipList },
  { path: '/videos', name: 'videos', component: VideoPage },
  { path: '/many-links', name: 'many-links', component: CreateManyLinksPage },
  { path: '/verify', name: 'verify', component: VerifyEmailPage },
  { path: '/mira', name: 'mira', component: MiraMull },
  { path: '/player', name: 'player', component: PodPlayer },
  { path: '/about', name: 'about', component: AboutPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const store = useUserStore()
  if (to.meta.requiresAuth && !store.isLoggedIn) return '/config'
})

export default router
