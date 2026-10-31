<script setup lang="ts">
interface Props {
  id: string
  title: string
  eyebrow?: string
  lead?: string
}

const props = defineProps<Props>()
</script>

<template>
  <header :class="$style.heading">
    <p v-if="props.eyebrow" :class="$style.eyebrow">{{ props.eyebrow }}</p>
    <h2 :id="props.id" :class="$style.title">{{ props.title }}</h2>
    <p v-if="props.lead" :class="$style.lead">{{ props.lead }}</p>
  </header>
</template>

<style module lang="scss">
@use 'mixins' as *;

.heading {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-width: 46rem;
  margin-bottom: 2rem;
}

.eyebrow {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.title {
  font-size: clamp(1.6rem, 1.1rem + 1.8vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.lead {
  font-size: clamp(1rem, 0.95rem + 0.2vw, 1.1rem);
  color: var(--color-ink-muted);
}
</style>
