<template>
  <section class="page">
    <div class="header">
      <div class="badge">🎞️</div>
      <h2>鋒兄影片庫</h2>
    </div>
    <div class="cards">
      <div class="card" v-for="video in videos" :key="video.name">
        <div class="video-container">
          <video controls :src="video.url" preload="metadata"></video>
        </div>
        <div class="meta">
          <div class="name">{{ video.name }}</div>
          <div class="info">MP4 · 影片連結</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const videos = ref([
  {
    name: '鋒兄進化Show🔥',
    url: 'https://api.stormkit.io/volumes/file/3JuhcYl49BXMV77YR4ttg9tpGn7MQabiRMONbblmNa8OQHqGiQ=='
  },
  {
    name: '鋒兄的傳奇人生',
    url: 'https://api.stormkit.io/volumes/file/ZeShsHQ7zp0qfCNCnTjhcIiLL3wd0sLK27DHYEsPw2v0JXzRIA=='
  }
]);
</script>

<style scoped>
.page {
  color: var(--color-text);
  display: grid;
  gap: 1rem;
}
.header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  padding: 1.25rem 1.3rem;
  border-radius: var(--radius-xl);
  background: var(--panel-bg);
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}
.header h2 {
  flex: 1;
  min-width: 120px;
  margin: 0;
  font-size: clamp(1.45rem, 1.15rem + 0.8vw, 2.2rem);
}
.actions {
  display: flex;
  gap: 0.8rem;
}
.badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(101, 216, 255, 1), rgba(63, 103, 255, 0.82));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #04111f;
  box-shadow: 0 18px 36px rgba(47, 113, 255, 0.22);
}
.actions .btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(151, 191, 255, 0.12);
  color: var(--color-text-strong);
  padding: 0.82rem 1rem;
  border-radius: 999px;
}
.actions .primary {
  background: linear-gradient(135deg, rgba(72, 166, 255, 0.3), rgba(78, 255, 199, 0.18));
  border-color: rgba(120, 217, 255, 0.28);
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.search {
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.card {
  background: var(--panel-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(151, 191, 255, 0.12);
  box-shadow: var(--panel-shadow);
}
.card:active {
  transform: scale(0.995);
}
.video-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: radial-gradient(circle at top, rgba(69, 129, 255, 0.28), rgba(4, 8, 18, 0.94));
}
.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.thumb.video {
  height: 140px;
  background: linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
}
.meta {
  padding: 1rem 1rem 1.15rem;
}
.name {
  font-weight: 700;
  color: var(--color-text-strong);
}
.info {
  margin-top: 0.35rem;
  font-size: 0.76rem;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
@media (max-width: 800px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page {
    gap: 0.85rem;
  }

  .header {
    padding: 0.95rem;
  }

  .meta {
    padding: 0.9rem 0.9rem 1rem;
  }
}
</style>
