<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style scoped>
.about {
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  border-radius: var(--radius-xl);
  background: var(--panel-bg);
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}

.about h1 {
  font-size: clamp(2rem, 1.4rem + 2vw, 3.6rem);
  text-align: center;
}
</style>
