<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'

interface Props {
  agentic: Resume['agentic']
}

const props = defineProps<Props>()
</script>

<template>
  <section id="agentic" :class="$style.section" aria-labelledby="agentic-title">
    <div :class="$style.inner">
      <SectionHeading
        id="agentic-title"
        :eyebrow="'Процесс'"
        :title="props.agentic.heading"
        :lead="props.agentic.lead"
      />

      <ul :class="$style.grid">
        <li v-for="(item, index) in props.agentic.items" :key="item.title" :class="$style.card">
          <span :class="$style.index" aria-hidden="true">{{
            String(index + 1).padStart(2, '0')
          }}</span>
          <h3 :class="$style.title">{{ item.title }}</h3>
          <p :class="$style.text">{{ item.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'mixins' as *;

.section {
  padding-block: clamp(2.5rem, 5vw, 4.5rem);
  color: var(--color-dark-ink);
  background:
    radial-gradient(circle at 90% 10%, rgb(6 122 82 / 16%), transparent 45%), var(--color-dark);
}

.inner {
  @include container;
}

.grid {
  display: grid;
  gap: 1rem;

  @include up($bp-md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 4%);
}

.index {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 800;
  color: #37e2a0;
  letter-spacing: 0.1em;
}

.title {
  font-size: 1.05rem;
  font-weight: 700;
}

.text {
  font-size: 0.9375rem;
  color: color-mix(in srgb, var(--color-dark-ink) 78%, transparent);
}

.section :global(a) {
  color: #9de9c6;
}

.section :global(a:hover) {
  color: #fff;
}

.section :global(h2) {
  color: var(--color-dark-ink);
}

.section :global(p) {
  color: color-mix(in srgb, var(--color-dark-ink) 82%, transparent);
}
</style>
