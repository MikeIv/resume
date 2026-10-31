<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'
import { fullName } from '#shared/utils/resume'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const updated = computed(() => {
  const [year, month, day] = props.resume.meta.updated.split('-')
  return `${day}.${month}.${year}`
})
</script>

<template>
  <footer :class="$style.footer">
    <div :class="$style.inner">
      <p :class="$style.line">
        {{ fullName(props.resume.basics) }} · обновлено {{ updated }} ·
        {{ props.resume.basics.location.city }}
      </p>
      <p :class="$style.line">
        Сайт собран на Nuxt 4, TypeScript и SCSS, отдаётся статикой. Данные — из одного
        <NuxtLink to="/resume.json" :class="$style.link">resume.json</NuxtLink>.
      </p>
      <a href="#top" :class="$style.up">Наверх ↑</a>
    </div>
  </footer>
</template>

<style module lang="scss">
@use 'mixins' as *;

.footer {
  padding-block: 2rem;
  border-top: 1px solid var(--color-line);
  background: var(--color-surface);
}

.inner {
  @include container;

  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
}

.line {
  margin: 0;
}

.link {
  color: inherit;
}

.up {
  align-self: flex-start;
  margin-top: 0.5rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
