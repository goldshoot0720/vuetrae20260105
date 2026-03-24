<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'

const isSidebarOpen = ref(true)
const isMobile = ref(false)
const route = useRoute()

const checkScreenSize = () => {
  const mobile = window.innerWidth <= 900
  if (isMobile.value !== mobile) {
    isMobile.value = mobile
    isSidebarOpen.value = !mobile
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeMobileMenu = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

const contentStyle = computed(() => ({
  marginLeft: isMobile.value || !isSidebarOpen.value ? '0' : '240px',
  width: isMobile.value || !isSidebarOpen.value ? '100%' : 'calc(100% - 240px)',
}))

const topbarTitle = computed(() => route.meta?.title || 'AI 管理中心')
const topbarEyebrow = computed(() => route.meta?.eyebrow || 'Workspace')
const topbarStatus = computed(() => (isMobile.value ? 'Mobile Adaptive' : 'Desktop Layout'))

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div class="app-shell">
    <div class="mobile-overlay" v-if="isMobile && isSidebarOpen" @click="isSidebarOpen = false"></div>
    <Sidebar :is-open="isSidebarOpen" @close="closeMobileMenu" />
    <div class="content" :style="contentStyle">
      <header class="topbar">
        <button class="menu-toggle" @click="toggleSidebar" title="切換選單">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="topbar-copy">
          <div class="eyebrow">{{ topbarEyebrow }}</div>
          <h1>{{ topbarTitle }}</h1>
        </div>
        <div class="topbar-rail">
          <div class="status-pill">
            <span class="status-dot"></span>
            <span>{{ topbarStatus }}</span>
          </div>
          <div class="status-pill subtle">2026 Interface</div>
        </div>
      </header>
      <main class="main">
        <RouterView v-slot="{ Component, route: currentRoute }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" :key="currentRoute.fullPath" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
  <div class="bg"></div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition:
    margin-left 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  isolation: isolate;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: 5.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem clamp(1rem, 2vw, 2rem) 0.75rem;
  margin: 0 auto;
  width: min(100%, calc(var(--content-width) + 4rem));
  color: var(--color-text-strong);
}

.topbar-copy {
  display: grid;
  gap: 0.2rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  color: var(--color-text-soft);
}

.topbar h1 {
  font-size: clamp(1.15rem, 1rem + 0.8vw, 1.75rem);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.04em;
  text-shadow: 0 0 24px rgba(90, 185, 255, 0.12);
}

.topbar-rail {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.status-pill {
  min-height: 2.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(151, 191, 255, 0.12);
  color: var(--color-text-strong);
  font-size: 0.8rem;
}

.status-pill.subtle {
  color: var(--color-text-soft);
}

.status-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(109, 255, 204, 1), rgba(79, 173, 255, 1));
  box-shadow: 0 0 14px rgba(109, 255, 204, 0.45);
}

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background:
    linear-gradient(180deg, rgba(24, 36, 68, 0.92), rgba(11, 18, 34, 0.92));
  border: 1px solid rgba(136, 177, 255, 0.18);
  color: var(--color-text-strong);
  cursor: pointer;
  padding: 0;
  border-radius: 1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 16px 32px rgba(3, 8, 22, 0.28);
}

.menu-toggle:hover {
  background:
    linear-gradient(180deg, rgba(33, 48, 90, 0.96), rgba(14, 24, 46, 0.96));
  border-color: rgba(126, 207, 255, 0.36);
}

.main {
  width: min(100%, calc(var(--content-width) + 4rem));
  margin: 0 auto;
  padding: 0 clamp(1rem, 2vw, 2rem) 2rem;
}

.main :deep(.page) {
  animation: section-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.bg {
  position: fixed;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(4, 8, 18, 0.96), rgba(6, 10, 20, 0.98)),
    radial-gradient(1200px 800px at 78% 10%, rgba(65, 151, 255, 0.18) 0%, rgba(65, 151, 255, 0) 62%),
    radial-gradient(880px 660px at 18% 12%, rgba(102, 255, 201, 0.12) 0%, rgba(102, 255, 201, 0) 58%);
  z-index: -1;
  overflow: hidden;
}

.bg::before,
.bg::after {
  content: '';
  position: absolute;
  inset: 0;
}

.bg::before {
  background-image:
    linear-gradient(rgba(135, 175, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(135, 175, 255, 0.06) 1px, transparent 1px);
  background-size: 84px 84px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.65), transparent 88%);
}

.bg::after {
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12) 0 1px, transparent 1px),
    radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.1) 0 1px, transparent 1px),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.09) 0 1px, transparent 1px);
  background-size: 240px 240px, 300px 300px, 360px 360px;
  opacity: 0.5;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 18, 0.55);
  z-index: 900;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.28s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes section-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .topbar {
    min-height: 5rem;
    padding: 1rem 1rem 0.5rem;
    flex-wrap: wrap;
  }

  .topbar-rail {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
  }

  .main {
    padding: 0 1rem 1.25rem;
  }
}

@media (max-width: 640px) {
  .topbar-copy {
    width: calc(100% - 4rem);
  }

  .topbar h1 {
    line-height: 1.05;
  }

  .status-pill.subtle {
    display: none;
  }
}

@media (max-width: 375px) {
  .topbar {
    padding: 0.8rem 0.75rem 0.4rem;
    min-height: 4.6rem;
    gap: 0.75rem;
  }

  .topbar h1 {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .topbar-rail {
    gap: 0.5rem;
  }

  .status-pill {
    min-height: 2.2rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.74rem;
  }

  .menu-toggle {
    width: 2.7rem;
    height: 2.7rem;
  }

  .main {
    padding: 0 0.75rem 1rem;
  }
}
</style>
