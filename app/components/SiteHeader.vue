<script setup lang="ts">
interface Props {
  name: string
  role: string
}

const props = defineProps<Props>()

const links = [
  { href: '#about', label: 'О себе' },
  { href: '#experience', label: 'Опыт' },
  { href: '#projects', label: 'Проекты' },
  { href: '#agentic', label: 'AI-агенты' },
  { href: '#contacts', label: 'Контакты' },
] as const
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.inner">
      <a href="#top" :class="$style.brand" :aria-label="`МИ — ${props.name}, к началу страницы`">
        <span :class="$style.mark" aria-hidden="true">МИ</span>
        <span :class="$style.brandText">
          <span :class="$style.brandName">{{ props.name }}</span>
          <span :class="$style.brandRole">{{ props.role }}</span>
        </span>
      </a>

      <nav aria-label="Разделы резюме" :class="$style.nav">
        <ul :class="$style.navList">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" :class="$style.navLink">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <NuxtLink to="/Ivanov-Mikhail-Nuxt-Fullstack.pdf" :class="$style.pdf" download>
        <Icon name="lucide:download" aria-hidden="true" :class="$style.icon" />
        <span>Скачать PDF</span>
      </NuxtLink>
    </div>
  </header>
</template>

<style module lang="scss">
@use 'mixins' as *;

.header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid color-mix(in srgb, var(--color-line) 80%, transparent);
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
  backdrop-filter: blur(12px);
}

.inner {
  @include container;

  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  min-height: 4.25rem;
}

.brand {
  display: inline-flex;
  gap: 0.75rem;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.mark {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--color-dark-ink);
  letter-spacing: 0.02em;
  background: var(--color-dark);
}

.brandText {
  display: none;
  flex-direction: column;
  line-height: 1.2;

  @include up($bp-sm) {
    display: flex;
  }
}

.brandName {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.brandRole {
  font-size: 0.75rem;
  color: var(--color-ink-muted);
}

.nav {
  display: none;

  @include up($bp-lg) {
    display: block;
  }
}

.navList {
  display: flex;
  gap: 1.5rem;
}

.navLink {
  font-size: 0.9rem;
  color: var(--color-ink-muted);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: var(--color-ink);
  }
}

.pdf {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-dark-ink);
  text-decoration: none;
  background: var(--color-dark);
  transition:
    transform 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #fff;
    background: var(--color-accent-strong);
    transform: translateY(-1px);
  }
}

.icon {
  width: 1rem;
  height: 1rem;
}
</style>
