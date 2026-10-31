<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()
</script>

<template>
  <section id="experience" :class="$style.section" aria-labelledby="experience-title">
    <div :class="$style.inner">
      <SectionHeading
        id="experience-title"
        eyebrow="Опыт"
        title="Где работал и что делал"
        lead="Хронология по трудовой книжке. Внутри — задачи и результаты, которые можно проверить."
      />

      <ol :class="$style.timeline">
        <li
          v-for="job in props.resume.experience"
          :key="job.company + job.from"
          :class="$style.item"
        >
          <div :class="$style.period">
            <span :class="$style.periodText">{{ formatPeriod(job.from, job.to) }}</span>
            <span v-if="job.to === null" :class="$style.current">сейчас</span>
          </div>

          <article :class="$style.card">
            <header :class="$style.cardHead">
              <h3 :class="$style.company">{{ job.company }}</h3>
              <p :class="$style.position">
                {{ job.position }}
                <span v-if="job.legalName" :class="$style.legal">· {{ job.legalName }}</span>
              </p>
              <p v-if="job.location" :class="$style.location">{{ job.location }}</p>
            </header>

            <p :class="$style.summary">{{ job.summary }}</p>

            <ul :class="$style.achievements">
              <li
                v-for="achievement in job.achievements"
                :key="achievement"
                :class="$style.achievement"
              >
                {{ achievement }}
              </li>
            </ul>

            <ul v-if="job.stack.length > 0" :class="$style.stack" aria-label="Стек">
              <li v-for="item in job.stack" :key="item">
                <BaseTag :label="item" />
              </li>
            </ul>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'mixins' as *;

.section {
  padding-block: clamp(2.5rem, 5vw, 4.5rem);
  background: var(--color-surface);
  border-block: 1px solid var(--color-line);
}

.inner {
  @include container;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.item {
  display: grid;
  gap: 0.75rem;

  @include up($bp-md) {
    grid-template-columns: 10.5rem minmax(0, 1fr);
    gap: 1.5rem;
  }
}

.period {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: baseline;

  @include up($bp-md) {
    position: sticky;
    top: 5.5rem;
    align-self: start;
  }
}

.periodText {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink-muted);
  white-space: nowrap;
}

.current {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-accent-strong);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--color-accent-soft);
}

.card {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: clamp(1.1rem, 2.5vw, 1.6rem);
  box-shadow: var(--shadow-card);
}

.cardHead {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.company {
  font-size: 1.2rem;
  font-weight: 800;
}

.position {
  font-size: 0.9375rem;
  font-weight: 600;
}

.legal {
  font-weight: 400;
  color: var(--color-ink-muted);
}

.location {
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
}

.summary {
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
}

.achievements {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.achievement {
  position: relative;
  padding-left: 1.1rem;
  font-size: 0.9375rem;

  &::before {
    position: absolute;
    top: 0.55em;
    left: 0;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: var(--color-accent);
    content: '';
  }
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
