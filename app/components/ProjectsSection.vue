<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const ordered = computed(() => {
  const list = [...props.resume.projects]
  return list.sort((a, b) => Number(b.featured) - Number(a.featured))
})
</script>

<template>
  <section id="projects" :class="$style.section" aria-labelledby="projects-title">
    <div :class="$style.inner">
      <SectionHeading
        id="projects-title"
        eyebrow="Проекты"
        title="Что можно открыть и посмотреть"
        lead="Коммерческие и открытые проекты: демо, репозитории и то, что внутри сделано мной."
      />

      <ul :class="$style.grid">
        <li v-for="project in ordered" :key="project.slug">
          <article :class="[$style.card, project.featured && $style.featured]">
            <header :class="$style.head">
              <div :class="$style.titleRow">
                <h3 :class="$style.name">{{ project.name }}</h3>
                <span :class="$style.period">{{ project.period }}</span>
              </div>
              <p :class="$style.tagline">{{ project.tagline }}</p>
              <p :class="$style.role">{{ project.role }}</p>
            </header>

            <p :class="$style.summary">{{ project.summary }}</p>

            <ul :class="$style.results">
              <li v-for="result in project.results" :key="result">{{ result }}</li>
            </ul>

            <ul :class="$style.stack" aria-label="Стек">
              <li v-for="item in project.stack" :key="item">
                <BaseTag :label="item" tone="accent" />
              </li>
            </ul>

            <div :class="$style.links">
              <a
                v-if="project.demo"
                :href="project.demo"
                :class="$style.link"
                rel="noopener"
                target="_blank"
              >
                <Icon name="lucide:external-link" aria-hidden="true" :class="$style.icon" />
                Сайт
              </a>
              <a
                v-if="project.code"
                :href="project.code"
                :class="$style.link"
                rel="noopener"
                target="_blank"
              >
                <Icon name="lucide:github" aria-hidden="true" :class="$style.icon" />
                Код
              </a>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'mixins' as *;

.section {
  padding-block: clamp(2.5rem, 5vw, 4.5rem);
}

.inner {
  @include container;
}

.grid {
  display: grid;
  gap: 1.15rem;

  @include up($bp-md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.card {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  height: 100%;
  padding: clamp(1.1rem, 2.4vw, 1.5rem);
  transition:
    border-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-line));
    box-shadow: var(--shadow-card);
    transform: translateY(-2px);
  }
}

.featured {
  border-color: color-mix(in srgb, var(--color-accent) 28%, var(--color-line));
}

.head {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.titleRow {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: baseline;
  justify-content: space-between;
}

.name {
  font-size: 1.1rem;
  font-weight: 800;
}

.period {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink-muted);
  white-space: nowrap;
}

.tagline {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent-strong);
}

.role {
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
}

.summary {
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
}

.results {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.875rem;

  li {
    position: relative;
    padding-left: 1rem;

    &::before {
      position: absolute;
      top: 0.5em;
      left: 0;
      width: 0.35rem;
      height: 0.35rem;
      border-radius: 50%;
      background: var(--color-accent);
      content: '';
    }
  }
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.4rem;
}

.link {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.icon {
  width: 0.95rem;
  height: 0.95rem;
}
</style>
