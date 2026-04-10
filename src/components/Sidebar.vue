<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="brand">
      <div class="brand-badge">鋒</div>
      <div class="brand-name">鋒兄AI系統</div>
    </div>
    <nav class="menu">
      <RouterLink to="/" class="item" @click="$emit('close')"><span class="icon">🏠</span>首頁</RouterLink>
      <RouterLink to="/images" class="item" @click="$emit('close')"><span class="icon">🖼️</span>圖片庫</RouterLink>
      <RouterLink to="/videos" class="item" @click="$emit('close')"><span class="icon">🎬</span>影片庫</RouterLink>
      <RouterLink to="/lyrics" class="item" @click="$emit('close')"><span class="icon">🎵</span>鋒兄音樂歌詞</RouterLink>
      <RouterLink to="/subscriptions" class="item" @click="$emit('close')"><span class="icon">📋</span>訂閱管理</RouterLink>
      <RouterLink to="/foods" class="item" @click="$emit('close')"><span class="icon">🍎</span>食品管理</RouterLink>
      <RouterLink to="/settings" class="item" @click="$emit('close')"><span class="icon">⚙️</span>系統設定</RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background:
    linear-gradient(180deg, rgba(15, 21, 27, 0.96), rgba(9, 13, 17, 0.98));
  color: var(--color-text-strong);
  padding: 1.4rem 1rem;
  z-index: 1000;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateX(-100%);
  border-right: 1px solid rgba(123, 161, 152, 0.12);
  backdrop-filter: blur(18px);
  box-shadow:
    inset -1px 0 0 rgba(255, 255, 255, 0.04),
    30px 0 80px rgba(1, 6, 18, 0.32);
  overflow: hidden;
}
.sidebar::before,
.sidebar::after {
  content: '';
  position: absolute;
  pointer-events: none;
}
.sidebar.open {
  transform: translateX(0);
}
.sidebar::before {
  inset: 1rem 1rem auto;
  height: 8rem;
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top left, rgba(58, 186, 157, 0.18), transparent 58%);
  opacity: 0.8;
}
.sidebar::after {
  inset: auto auto 3rem -3rem;
  width: 11rem;
  height: 11rem;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(99, 145, 222, 0.1), transparent 66%);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.6rem;
  padding: 0.55rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(123, 161, 152, 0.1);
  position: relative;
  z-index: 1;
}
.brand-badge {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background:
    linear-gradient(145deg, rgba(84, 228, 188, 0.96), rgba(36, 139, 114, 0.86));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #05101f;
  box-shadow: 0 12px 32px rgba(28, 124, 102, 0.34);
}
.brand-name {
  font-size: 0.96rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
}
.item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.92rem 0.95rem;
  border-radius: 1rem;
  color: var(--color-text);
  border: 1px solid transparent;
  background: transparent;
  font-weight: 600;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;
}
.item::before {
  content: '';
  position: absolute;
  inset: auto auto auto 0.4rem;
  width: 0.2rem;
  height: calc(100% - 1rem);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(84, 228, 188, 1), rgba(46, 154, 129, 0.72));
  transform: scaleY(0);
  transition: transform 0.25s ease;
  transform-origin: center;
}
.item:hover {
  color: var(--color-text-strong);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(83, 200, 166, 0.16);
}
.item.router-link-active {
  color: var(--color-text-strong);
  background:
    linear-gradient(135deg, rgba(31, 103, 88, 0.42), rgba(18, 34, 31, 0.72));
  border-color: rgba(83, 200, 166, 0.24);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 16px 28px rgba(3, 8, 22, 0.22);
}
.item.router-link-active::before {
  transform: scaleY(1);
}
.icon {
  width: 22px;
  text-align: center;
  opacity: 0.9;
}

@media (max-width: 375px) {
  .sidebar {
    width: 80vw;
    max-width: 300px;
    padding: 1rem 0.75rem;
  }
  .brand {
    margin-bottom: 1rem;
  }
  .item {
    padding: 0.95rem 0.85rem;
  }
}
</style>
