<template>
  <section class="home">
    <div class="hero">
      <div class="logo">鋒</div>
      <h1 class="title">鋒兄AI資訊系統</h1>
      <p class="subtitle">智能管理您的影片和圖片收藏 · 支援智能分類和快速搜尋</p>
      <div class="copyright">鋒兄塗哥公關資訊© 版權所有 2025 ~ 2125</div>
      <div class="tech">
        <div class="card">
          <div class="card-title">⚡ 前端技術</div>
          <ul class="list">
            <li>Vue 3 (Vite)</li>
            <li>網頁存放於 Local</li>
            <li>響應式設計 + CSS</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-title">🚀 後端技術</div>
          <ul class="list">
            <li>Back4app（Parse）</li>
            <li>資料存放於 Back4app</li>
            <li>RESTful API + Parse SDK</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="dashboard">
      <div class="panel">
        <div class="panel-title">🧾 訂閱管理</div>
        <div class="stats">
          <div class="stat">
            <div class="label">項目數</div>
            <div class="value">{{ subscriptionTotal }}</div>
          </div>
          <div class="stat">
            <div class="label">7天提醒</div>
            <div class="value">{{ subscription7 }}</div>
            <div class="hint">最近：{{ subscription7Date }}</div>
          </div>
          <div class="stat">
            <div class="label">30天提醒</div>
            <div class="value">{{ subscription30 }}</div>
            <div class="hint">最近：{{ subscription30Date }}</div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">🍎 食品管理</div>
        <div class="stats">
          <div class="stat">
            <div class="label">項目數</div>
            <div class="value">{{ foodTotal }}</div>
          </div>
          <div class="stat">
            <div class="label">3天提醒</div>
            <div class="value">{{ food3 }}</div>
            <div class="hint">最近：{{ food3Date }}</div>
          </div>
          <div class="stat">
            <div class="label">7天提醒</div>
            <div class="value">{{ food7 }}</div>
            <div class="hint">最近：{{ food7Date }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-title">☀️ 系統功能選單</div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Parse from '../services/parse';

const subscriptionTotal = ref(0);
const subscription7 = ref(0);
const subscription30 = ref(0);
const subscription7Date = ref('-');
const subscription30Date = ref('-');
const foodTotal = ref(0);
const food3 = ref(0);
const food7 = ref(0);
const food3Date = ref('-');
const food7Date = ref('-');
let sleepReminderTimer = null;

const SLEEP_REMINDER_SLOTS = [
  { hour: 0, minute: 0 },
  { hour: 0, minute: 30 },
  { hour: 1, minute: 0 },
  { hour: 1, minute: 30 },
  { hour: 2, minute: 0 },
  { hour: 2, minute: 15 },
  { hour: 2, minute: 30 },
  { hour: 2, minute: 45 },
  { hour: 3, minute: 0 },
  { hour: 3, minute: 15 },
  { hour: 3, minute: 30 },
  { hour: 3, minute: 45 },
  { hour: 4, minute: 0 }
];

const addDays = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const formatDate = (d) => {
  if (!d) return '-';
  const x = new Date(d);
  return x.toLocaleDateString();
};

const formatDateTime = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
};

const getSleepReminderKey = (date, slot) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(slot.hour).padStart(2, '0');
  const mm = String(slot.minute).padStart(2, '0');
  return `sleep-reminder:${y}-${m}-${d}:${hh}${mm}`;
};

const maybeShowSleepReminder = () => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let index = 0; index < SLEEP_REMINDER_SLOTS.length; index += 1) {
    const slot = SLEEP_REMINDER_SLOTS[index];
    const slotMinutes = slot.hour * 60 + slot.minute;
    if (currentMinutes < slotMinutes) {
      break;
    }

    const storageKey = getSleepReminderKey(now, slot);
    if (localStorage.getItem(storageKey)) {
      continue;
    }

    const message = [
      '睡眠提示',
      `今天日期與現在時刻：${formatDateTime(now)}`,
      `提示次數：第 ${index + 1} 次 / 共 ${SLEEP_REMINDER_SLOTS.length} 次`,
      '該休息睡覺了。'
    ].join('\n');

    alert(message);
    localStorage.setItem(storageKey, String(now.getTime()));
    break;
  }
};

const fetchDashboard = async () => {
  const now = new Date();

  const Subscription = Parse.Object.extend('subscription');
  const Food = Parse.Object.extend('food');

  const subTotalQuery = new Parse.Query(Subscription);
  subscriptionTotal.value = await subTotalQuery.count();

  const sub7Query = new Parse.Query(Subscription);
  sub7Query.greaterThanOrEqualTo('nextdate', now);
  sub7Query.lessThanOrEqualTo('nextdate', addDays(now, 7));
  subscription7.value = await sub7Query.count();
  sub7Query.ascending('nextdate');
  const s7 = await sub7Query.first();
  subscription7Date.value = s7 ? formatDate(s7.get('nextdate')) : '-';

  const sub30Query = new Parse.Query(Subscription);
  sub30Query.greaterThanOrEqualTo('nextdate', now);
  sub30Query.lessThanOrEqualTo('nextdate', addDays(now, 30));
  subscription30.value = await sub30Query.count();
  sub30Query.ascending('nextdate');
  const s30 = await sub30Query.first();
  subscription30Date.value = s30 ? formatDate(s30.get('nextdate')) : '-';

  const foodTotalQuery = new Parse.Query(Food);
  foodTotal.value = await foodTotalQuery.count();

  const food3Query = new Parse.Query(Food);
  food3Query.greaterThanOrEqualTo('todate', now);
  food3Query.lessThanOrEqualTo('todate', addDays(now, 3));
  food3.value = await food3Query.count();
  food3Query.ascending('todate');
  const f3 = await food3Query.first();
  food3Date.value = f3 ? formatDate(f3.get('todate')) : '-';

  const food7Query = new Parse.Query(Food);
  food7Query.greaterThanOrEqualTo('todate', now);
  food7Query.lessThanOrEqualTo('todate', addDays(now, 7));
  food7.value = await food7Query.count();
  food7Query.ascending('todate');
  const f7 = await food7Query.first();
  food7Date.value = f7 ? formatDate(f7.get('todate')) : '-';
};

onMounted(() => {
  fetchDashboard();
  maybeShowSleepReminder();
  sleepReminderTimer = window.setInterval(maybeShowSleepReminder, 30 * 1000);
});

onUnmounted(() => {
  if (sleepReminderTimer) {
    window.clearInterval(sleepReminderTimer);
  }
});
</script>

<style scoped>
.home {
  color: var(--color-text);
  display: grid;
  gap: 1.35rem;
}
.hero {
  position: relative;
  overflow: hidden;
  background: var(--panel-bg-strong);
  border-radius: var(--radius-xl);
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
  padding: clamp(1.5rem, 2vw, 2.4rem);
  text-align: left;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(60, 171, 145, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(95, 143, 218, 0.08), transparent 48%);
  pointer-events: none;
}
.hero > * {
  position: relative;
}
.logo {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 1.35rem;
  background:
    linear-gradient(145deg, rgba(84, 228, 188, 1), rgba(36, 139, 114, 0.86));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #03101f;
  box-shadow: 0 24px 45px rgba(30, 122, 101, 0.28);
}
.title {
  font-size: clamp(2rem, 1.5rem + 2vw, 3.7rem);
  line-height: 0.95;
  margin-bottom: 0.75rem;
  max-width: 11ch;
}
.subtitle {
  max-width: 58rem;
  color: var(--color-text);
  font-size: clamp(0.98rem, 0.92rem + 0.35vw, 1.15rem);
  margin-bottom: 0.55rem;
}
.copyright {
  display: inline-flex;
  align-items: center;
  min-height: 2.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.82rem;
  color: var(--color-text-soft);
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(123, 161, 152, 0.14);
}
.tech {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  text-align: left;
  border: 1px solid rgba(123, 161, 152, 0.12);
  backdrop-filter: blur(10px);
}
.card-title {
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: var(--color-text-strong);
}
.list {
  padding-left: 1.1rem;
  color: var(--color-text);
  display: grid;
  gap: 0.35rem;
}
.section-title {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.76rem;
  color: var(--color-text-soft);
  padding-left: 0.2rem;
}
.dashboard {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.panel {
  background: var(--panel-bg);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}
.panel-title {
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text-strong);
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}
.stat {
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: 1rem;
  text-align: left;
  border: 1px solid rgba(123, 161, 152, 0.12);
}
.stat .label {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-soft);
}
.stat .value {
  margin-top: 0.45rem;
  font-size: clamp(1.8rem, 1.2rem + 1vw, 2.4rem);
  font-weight: 700;
  color: var(--color-text-strong);
}
.stat .hint {
  margin-top: 0.4rem;
  font-size: 0.78rem;
  color: var(--accent-strong);
}
@media (max-width: 680px) {
  .tech,
  .dashboard {
    grid-template-columns: 1fr;
  }
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
