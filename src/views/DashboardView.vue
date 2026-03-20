<template>
  <section class="page">
    <div class="header">
      <div class="badge">📊</div>
      <h2>系統儀表板</h2>
      <div class="actions">
        <button class="btn">刷新數據</button>
      </div>
    </div>
    <div class="grid">
      <div class="tile">
        <div class="kpi">24</div>
        <div class="label">訂閱總數</div>
      </div>
      <div class="tile">
        <div class="kpi">13</div>
        <div class="label">食品總數</div>
      </div>
      <div class="tile">
        <div class="kpi">2</div>
        <div class="label">30天內到期</div>
      </div>
    </div>
  </section>
</template>

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
  margin: 0;
  font-size: clamp(1.45rem, 1.2rem + 0.8vw, 2.25rem);
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
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.tile {
  background: var(--panel-bg);
  border-radius: var(--radius-xl);
  padding: 1.35rem;
  text-align: left;
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}
.kpi {
  font-size: clamp(2rem, 1.65rem + 1vw, 3rem);
  font-weight: 700;
  color: var(--color-text-strong);
}
.label {
  margin-top: 0.45rem;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
}
@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
