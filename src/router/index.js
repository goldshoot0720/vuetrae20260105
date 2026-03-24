import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import ImagesView from '../views/ImagesView.vue'
import VideosView from '../views/VideosView.vue'
import LyricsView from '../views/LyricsView.vue'
import SubscriptionsView from '../views/SubscriptionsView.vue'
import FoodsView from '../views/FoodsView.vue'
import SettingsView from '../views/SettingsView.vue'

const appName = 'vuetrae20260105'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首頁',
        eyebrow: 'Command Center',
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: '儀表板',
        eyebrow: 'Overview',
      },
    },
    {
      path: '/images',
      name: 'images',
      component: ImagesView,
      meta: {
        title: '圖片資料庫',
        eyebrow: 'Media Grid',
      },
    },
    {
      path: '/videos',
      name: 'videos',
      component: VideosView,
      meta: {
        title: '影片資料庫',
        eyebrow: 'Playback',
      },
    },
    {
      path: '/lyrics',
      name: 'lyrics',
      component: LyricsView,
      meta: {
        title: '歌詞資料庫',
        eyebrow: 'Lyrics Lab',
      },
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: SubscriptionsView,
      meta: {
        title: '訂閱管理',
        eyebrow: 'Finance Track',
      },
    },
    {
      path: '/foods',
      name: 'foods',
      component: FoodsView,
      meta: {
        title: '食品管理',
        eyebrow: 'Storage Watch',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        title: '系統設定',
        eyebrow: 'Configuration',
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About',
        eyebrow: 'Info',
      },
    },
  ],
})

router.afterEach((to) => {
  const pageTitle = to.meta?.title ? `${to.meta.title} | ${appName}` : appName
  document.title = pageTitle
})

export default router
