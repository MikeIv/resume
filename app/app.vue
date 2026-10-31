<template>
  <div :class="$style.app">
    <a href="#main" :class="$style.skip">К содержанию</a>
    <NuxtPage />
  </div>
</template>

<style module lang="scss">
.app {
  min-height: 100vh;
}

.skip {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 100;
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-sm);
  color: var(--color-dark-ink);
  text-decoration: none;
  background: var(--color-dark);
  transition: transform 0.15s ease;
  transform: translateY(-160%);

  &:focus-visible {
    transform: translateY(0);
  }
}
</style>
