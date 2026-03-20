<script setup>
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const isSidebarOpen = ref(true)
const isMobile = ref(false)

const checkScreenSize = () => {
  const mobile = window.innerWidth <= 900
  if (isMobile.value !== mobile) {
    isMobile.value = mobile
    // Auto-close on mobile, auto-open on desktop when switching
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

// Dynamic content style
const contentStyle = computed(() => ({
  marginLeft: isMobile.value || !isSidebarOpen.value ? '0' : '240px',
  width: isMobile.value || !isSidebarOpen.value ? '100%' : 'calc(100% - 240px)'
}))

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
        <h1>歡迎使用鋒兄AI資訊系統</h1>
      </header>
      <main class="main">
        <RouterView />
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
.topbar h1 {
  font-size: clamp(1.15rem, 1rem + 0.8vw, 1.75rem);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.04em;
  text-shadow: 0 0 24px rgba(90, 185, 255, 0.12);
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

@media (max-width: 900px) {
  .topbar {
    min-height: 5rem;
    padding: 1rem 1rem 0.5rem;
  }
  .main {
    padding: 0 1rem 1.25rem;
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
  .menu-toggle {
    width: 2.7rem;
    height: 2.7rem;
  }
  .main {
    padding: 0 0.75rem 1rem;
  }
}
</style>
