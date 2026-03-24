<template>
  <section class="page">
    <div class="header">
      <div class="badge">🖼️</div>
      <h2>鋒兄圖片庫</h2>
      <div class="actions">
        <button class="btn">重新整理</button>
        <button class="btn primary">新增圖片</button>
      </div>
    </div>
    <div class="toolbar">
      <input class="search" placeholder="搜尋圖片名稱或檔案名..." />
      <button class="btn">🔍 搜尋</button>
    </div>
    <div class="cards">
      <div class="card" v-for="(image, index) in images" :key="index">
        <div class="thumb">
          <img :src="image.url" :alt="image.name" loading="lazy" />
        </div>
        <div class="meta">
          <div class="name">{{ image.name }}</div>
          <div class="info">圖片</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const images = ref([
  {
    name: 'Gemini_Generated_Image_xfh0ydxfh0ydxfh0.png',
    url: 'https://api.stormkit.io/volumes/file/gap1-6tSw0ODx7aPBf43-fC7jyc03ArlfMTchJm4n95BBFsbLg=='
  },
  {
    name: 'ChatGPT Image 2025年12月17日 上午02_32_07.png',
    url: 'https://api.stormkit.io/volumes/file/aE3KdUzM5uQCapPEwc2ENdblXjTI-_z45kmSwLi2qZBJjH83DQ=='
  },
  {
    name: 'Gemini_Generated_Image_azcmkgazcmkgazcm.png',
    url: 'https://api.stormkit.io/volumes/file/JgJJ8FalPKGTV-gQ4Iu_0ua58zxS-63nG-fsoIG62kCSrVD09A=='
  },
  {
    name: 'Gemini_Generated_Image_1xs3cf1xs3cf1xs3.png',
    url: 'https://api.stormkit.io/volumes/file/b1UR3hTAE7VgoAIB9b7XJ_33XuNnx68ELU-RAqadifAicJpimA=='
  },
  {
    name: 'ChatGPT Image 2025年12月17日 下午01_53_56.png',
    url: 'https://api.stormkit.io/volumes/file/MxvjfAg6NxY3U7AKH7UZwrqLl3GXXBghU1mU4EMmUdN63wDClg=='
  },
  {
    name: 'ChatGPT Image 2025年11月13日 下午09_18_36.png',
    url: 'https://api.stormkit.io/volumes/file/mWurWCUmhSwcd0H46bR1iwd4fXfXLVSRuUpJ7Tj_a2IC3C_VrA=='
  },
  {
    name: 'ChatGPT Image 2025年11月10日 下午07_29.png',
    url: 'https://api.stormkit.io/volumes/file/OSZIyC1Y4GLX4RYdP1ueqbB0-iFrhQHtieAsE5CapuaZzG4quQ=='
  },
  {
    name: '20240917_183326-removebg.png',
    url: 'https://api.stormkit.io/volumes/file/ZRAvElyZKFEc88GoumPKCa3ObNTwcUwraXsy1J9LuDOnAPhqLA=='
  },
  {
    name: '248adc66-2260-491b-b5a9-91ca01099528.png',
    url: 'https://api.stormkit.io/volumes/file/7sHSgGLcaRxW4-S2Z6I0LTQa0aJoiAkh9nbmPe7QxjcdVlzFUQ=='
  },
  {
    name: '41debbc7-e26c-402d-8d29-7fa1b06441b7.png',
    url: 'https://api.stormkit.io/volumes/file/cvY-Jmd9245LpX_WfCT-317uR9iE4qWcoZI4aJJAB6f6Lbp98Q=='
  },
  {
    name: '717994e4-a0a9-4e7b-b8b5-9f12474f4c47--1-.png',
    url: 'https://api.stormkit.io/volumes/file/rbXLjtTUSn9ZSLfjOVk526i2dzcvxL91CG0uLNgCn4ouI7hV-g=='
  },
  {
    name: '50a2f658-0691-4694-a692-7c53a73c175f.jpg',
    url: 'https://api.stormkit.io/volumes/file/eJc5G5fMxd95qoO9H3Ubv9DhQ7rpUAWYXzXgHekU7f9k3MU8Ew=='
  },
  {
    name: 'MindVideo_20251130234020_916.jpg',
    url: 'https://api.stormkit.io/volumes/file/2Yb_8JrF1ocBccxIjawpduv5-MC0WW3afYEq7OQTAwJP5EbW2w=='
  },
  {
    name: 'Screenshot 2025-10-27 at 15-51-27 cf076046-e3a72956.mp4.png',
    url: 'https://api.stormkit.io/volumes/file/90h-vsFaDcxNUSBvQEogte3Ff6MuNM_cJBo_fco2P_oJ8pWEXw=='
  },
  {
    name: 'Screenshot 2025-12-05 at 00-22-42 .png',
    url: 'https://api.stormkit.io/volumes/file/58QmNQG-GbL0B1KdMRD2i3-4Ysw7HwS_C3ewcdlumFSzFE-3og=='
  },
  {
    name: 'Gemini_Generated_Image_d85lksd85lksd85l.png',
    url: 'https://api.stormkit.io/volumes/file/rEqTrChUI1FqQkkpVJojEU7mjC3LcIVrKr82s5HTDyYD7Bq2Fw=='
  },
  {
    name: '未命名 LiveDoc(1).png',
    url: 'https://api.stormkit.io/volumes/file/7HFry2TvX-jb6ZDBikDATQjem2kyYcxBckOLzO-l7kri_oM8Ig=='
  },
  {
    name: 'IMG_0032.jpg',
    url: 'https://api.stormkit.io/volumes/file/bOVXLOWqEzyw4um4BqTIeeXDEvsiU738I3yHGSckZEug-dbtXg=='
  },
  {
    name: 'MindVideo_20251031144254_102.jpeg',
    url: 'https://api.stormkit.io/volumes/file/hZLdSA3mi2DGSVy-9jnygBO4fMM5kNEAp46_YT8hmoerdO9V-g=='
  },
  {
    name: 'Gemini_Generated_Image_p8s78p8s78p8s78p.png',
    url: 'https://api.stormkit.io/volumes/file/_Trco9wR84Jwin6iKQfaeUkxKMGyB3Kjvm9To9ipvlH1RIVD-A=='
  },
  {
    name: 'Gemini_Generated_Image_a7lvpba7lvpba7lv.png',
    url: 'https://api.stormkit.io/volumes/file/z36wOUaB6hiGksTA_q4IL2C6JQyrpeBcmbP3VMjrdg0pfpMjVA=='
  },
  {
    name: 'Gemini_Generated_Image_76qn2776qn2776qn.png',
    url: 'https://api.stormkit.io/volumes/file/FBfvBWsg-FYahMXv89RbGWJVJadvSPDb6jDRsjJWXf1hofnK6g=='
  },
  {
    name: 'Gemini_Generated_Image_5ecqar5ecqar5ecq.png',
    url: 'https://api.stormkit.io/volumes/file/IR1Re38erdqr6bEYerrhlwYJxeeo80dpccKgf5LS941tnP1mQw=='
  },
  {
    name: 'Gemini_Generated_Image_8d9fxe8d9fxe8d9f.png',
    url: 'https://api.stormkit.io/volumes/file/dhTDSMnJY3Sa7sv2lv1pbde9xvLH4YxmYRIqz1l3lRRuELn8Fg=='
  },
  {
    name: 'Gemini_Generated_Image_4iscnp4iscnp4isc.png',
    url: 'https://api.stormkit.io/volumes/file/asDvFBtvSDMmF6Sm17QC7gpdGzuGm_kJIrMsEDOBQCQVZ6Th0Q=='
  },
  {
    name: 'ChatGPT Image 2025年12月17日 下午01_37_16.png',
    url: 'https://api.stormkit.io/volumes/file/gqbufESVKOmfBLJT7Y7ETDZ7ATNJCR5jPBWga6re5jMUswK-2g=='
  },
  {
    name: 'ChatGPT Image 2025年12月17日 下午01_28_57.png',
    url: 'https://api.stormkit.io/volumes/file/LUrucK0Ue2ZALNJJBeKJlTzinuuQgb6Kh48p-f-DTa_l6iy5aw=='
  },
  {
    name: 'ChatGPT Image 2025年12月17日 下午01_23_17.png',
    url: 'https://api.stormkit.io/volumes/file/0bBbRpTkjrj7qVFKeqahDm9MfeM1bowQSIv1fipFULvR45X3-A=='
  },
  {
    name: 'ChatGPT Image 2025年12月17日 下午01_23_52.png',
    url: 'https://api.stormkit.io/volumes/file/9FiZX2xfrdIMlutyfr2FX9EBf8E8CVdHHIxeI3on-0q0LXVNyA=='
  },
  {
    name: 'ChatGPT Image 2025年11月13日 下午09_10_45.png',
    url: 'https://api.stormkit.io/volumes/file/jUjSF3DRTOeNl7KSWV6VUDa3_11p0V3cnSF2u8RGfaAu127uXw=='
  },
  {
    name: 'ChatGPT Image 2025年10月26日 下午07_45_30.png',
    url: 'https://api.stormkit.io/volumes/file/qrUGZiG4u7BI0U-xR5oXRZrRZtSIH48DqMpTtEwNs0JQxrUFtA=='
  },
  {
    name: 'ChatGPT Image 2025年10月26日 下午07_44_21.png',
    url: 'https://api.stormkit.io/volumes/file/kMKp7WdJgD2rlegoleXGH6WGIyVwYvAYNkxc93ZOy5KXk5yUxA=='
  },
  {
    name: 'ChatGPT Image 2025年10月26日 下午07_37_12.png',
    url: 'https://api.stormkit.io/volumes/file/ueDG5TemPbfwOl9Rw70HUJ-7bgplu_WTaeepBrfWEQW4S05_vg=='
  },
  {
    name: 'ChatGPT Image 2025年10月26日 下午07_21_51.png',
    url: 'https://api.stormkit.io/volumes/file/9J_2F1zjKbdMcDekDV1xmLtxo4y3usLZLsPsEkVtQe3w-OYO0Q=='
  },
  {
    name: '1761405934-74814b15-9720-44af-a88e-91f4933748c3.jpeg',
    url: 'https://api.stormkit.io/volumes/file/1kr_XnA7kCFWMLH421nv868YxAB0AzV224-QmQ4cTkFjIBMVWQ=='
  },
  {
    name: '1761405863-3ca40781-b24f-4c48-9795-7bc061f58ed6.jpeg',
    url: 'https://api.stormkit.io/volumes/file/sfpyLqy6SreOU4caInlBbGHEXPws3eIcWcGh0NdHzZA1JP1vfA=='
  },
  {
    name: '1761405813-e8acecce-a968-4409-a254-d493d54e8c53.jpeg',
    url: 'https://api.stormkit.io/volumes/file/d2PBETIU3Ekpda_Fl8ZyHyDsnTfR0HhB4l9pNZ8BTatmErjKOw=='
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
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.9rem;
  padding: 1.25rem 1.3rem;
  border-radius: var(--radius-xl);
  background: var(--panel-bg);
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}
.header h2 {
  margin: 0;
  font-size: clamp(1.45rem, 1.15rem + 0.8vw, 2.2rem);
}
.badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(101, 216, 255, 1), rgba(63, 103, 255, 0.82));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #04111f;
  box-shadow: 0 18px 36px rgba(47, 113, 255, 0.22);
}
.actions {
  display: flex;
  gap: 0.6rem;
}
.actions .btn,
.toolbar .btn {
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
  gap: 0.8rem;
  padding: 1rem 1.15rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(151, 191, 255, 0.1);
}
.search {
  flex: 1;
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
  background: rgba(7, 12, 26, 0.72);
  color: var(--color-text-strong);
}
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.card {
  background: var(--panel-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  border: 1px solid rgba(151, 191, 255, 0.12);
  box-shadow: var(--panel-shadow);
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(120, 217, 255, 0.28);
}
.card:active {
  transform: translateY(-1px) scale(0.995);
}
.thumb {
  height: 200px;
  background: linear-gradient(135deg, rgba(79, 114, 204, 0.38), rgba(11, 16, 31, 0.12));
  overflow: hidden;
  position: relative;
}
.thumb::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 45%;
  background: linear-gradient(180deg, transparent, rgba(3, 7, 18, 0.55));
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}
.card:hover .thumb img {
  transform: scale(1.06);
}
.meta {
  padding: 1rem 1rem 1.1rem;
}
.name {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.35rem;
  color: var(--color-text-strong);
}
.info {
  font-size: 0.76rem;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
@media (max-width: 1200px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 800px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 500px) {
  .cards {
    grid-template-columns: 1fr;
  }
  .header {
    display: flex;
    flex-wrap: wrap;
  }
  .header h2 {
    flex: 1;
    margin-left: 8px;
    font-size: 1.2rem;
  }
  .actions {
    width: 100%;
    margin-top: 0.5rem;
    display: flex;
    gap: 8px;
  }
  .actions .btn {
    flex: 1;
  }
  .toolbar {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .page {
    gap: 0.85rem;
  }

  .header,
  .toolbar {
    padding: 0.95rem;
  }

  .cards {
    gap: 0.85rem;
  }

  .thumb {
    height: 220px;
  }

  .meta {
    padding: 0.9rem 0.9rem 1rem;
  }
}
</style>
