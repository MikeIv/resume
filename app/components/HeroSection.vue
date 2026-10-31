<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'
import {
  formatSalary,
  formatWorkFormats,
  fullName,
  telHref,
  telegramHref,
} from '#shared/utils/resume'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const basics = computed(() => props.resume.basics)

const contacts = computed(() => {
  const { contacts: info } = basics.value
  return [
    { href: `mailto:${info.email}`, label: info.email, icon: 'lucide:mail' },
    { href: telHref(info.phone), label: info.phone, icon: 'lucide:phone' },
    ...(info.telegram
      ? [{ href: telegramHref(info.telegram), label: `@${info.telegram}`, icon: 'lucide:send' }]
      : []),
    { href: info.github, label: 'GitHub', icon: 'lucide:github' },
  ]
})

const artifacts = computed(() => [
  { href: '/resume.json', label: 'resume.json', note: 'JSON Resume' },
  { href: '/resume.txt', label: 'resume.txt', note: 'простой текст' },
  { href: '/llms.txt', label: 'llms.txt', note: 'карта артефактов' },
  { href: '/Ivanov-Mikhail-Nuxt-Fullstack.pdf', label: 'PDF', note: 'для ATS и HR' },
])
</script>

<template>
  <section id="top" :class="$style.hero">
    <div :class="$style.inner">
      <div :class="$style.intro">
        <p :class="$style.status">
          <span :class="$style.dot" aria-hidden="true" />
          Открыт к предложениям · {{ formatWorkFormats(basics.formats) }}
        </p>

        <h1 :class="$style.name">
          {{ fullName(basics) }}
          <span :class="$style.role">{{ basics.label }}</span>
        </h1>

        <p :class="$style.headline">{{ basics.headline }}</p>

        <div :class="$style.actions">
          <NuxtLink to="/Ivanov-Mikhail-Nuxt-Fullstack.pdf" :class="$style.primary" download>
            <Icon name="lucide:download" aria-hidden="true" :class="$style.buttonIcon" />
            Резюме в PDF
          </NuxtLink>
          <a href="#projects" :class="$style.secondary">Проекты</a>
          <a
            v-if="basics.contacts.hh"
            :href="basics.contacts.hh"
            :class="$style.ghost"
            rel="noopener"
          >
            Открыть на hh.ru
          </a>
        </div>

        <ul :class="$style.contacts">
          <li v-for="contact in contacts" :key="contact.href">
            <a :href="contact.href" :class="$style.contactLink" rel="noopener">
              <Icon :name="contact.icon" aria-hidden="true" :class="$style.contactIcon" />
              {{ contact.label }}
            </a>
          </li>
        </ul>
      </div>

      <div :class="$style.side">
        <ul :class="$style.stats">
          <li v-for="stat in basics.stats" :key="stat.label" :class="$style.stat">
            <span :class="$style.statValue">{{ stat.value }}</span>
            <span :class="$style.statLabel">{{ stat.label }}</span>
          </li>
        </ul>

        <aside :class="$style.machine" aria-label="Машиночитаемые версии резюме">
          <p :class="$style.machineTitle">Машиночитаемо</p>
          <ul :class="$style.machineList">
            <li v-for="artifact in artifacts" :key="artifact.href">
              <NuxtLink :to="artifact.href" :class="$style.machineLink">
                {{ artifact.label }}
              </NuxtLink>
              <span :class="$style.machineNote">{{ artifact.note }}</span>
            </li>
          </ul>
          <p :class="$style.salary">Ожидания: {{ formatSalary(basics.salary) }}</p>
        </aside>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'mixins' as *;

.hero {
  padding-block: clamp(2.5rem, 6vw, 5rem);
  color: var(--color-dark-ink);
  background:
    radial-gradient(circle at 15% 0%, rgb(6 122 82 / 22%), transparent 45%),
    radial-gradient(circle at 85% 20%, rgb(36 92 148 / 18%), transparent 40%), var(--color-dark);
}

.inner {
  @include container;

  display: grid;
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: start;

  @include up($bp-md) {
    grid-template-columns: minmax(0, 1.35fr) minmax(16rem, 0.65fr);
  }
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.status {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  width: fit-content;
  padding: 0.35rem 0.8rem;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 999px;
  font-size: 0.8125rem;
  color: var(--color-dark-ink);
  background: rgb(255 255 255 / 6%);
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #37e2a0;
  box-shadow: 0 0 0 4px rgb(55 226 160 / 18%);
}

.name {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: clamp(2.1rem, 1.3rem + 3.2vw, 3.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.role {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  font-weight: 600;
  color: #9de9c6;
  letter-spacing: 0;
}

.headline {
  max-width: 40rem;
  font-size: clamp(1.05rem, 0.98rem + 0.35vw, 1.25rem);
  color: color-mix(in srgb, var(--color-dark-ink) 82%, transparent);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.35rem;
}

.primary,
.secondary,
.ghost {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.7rem 1.15rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.primary {
  color: #04281c;
  background: #37e2a0;

  &:hover {
    color: #04281c;
    background: #5cecb6;
  }
}

.secondary {
  border: 1px solid rgb(255 255 255 / 22%);
  color: var(--color-dark-ink);

  &:hover {
    border-color: rgb(255 255 255 / 45%);
    color: #fff;
  }
}

.ghost {
  color: #9de9c6;
  text-decoration: underline;
  text-underline-offset: 0.25em;

  &:hover {
    color: #fff;
  }
}

.buttonIcon {
  width: 1.05rem;
  height: 1.05rem;
}

.contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-top: 0.4rem;
}

.contactLink {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  font-size: 0.9rem;
  color: color-mix(in srgb, var(--color-dark-ink) 85%, transparent);
  text-decoration: none;

  &:hover {
    color: #fff;
  }
}

.contactIcon {
  width: 0.95rem;
  height: 0.95rem;
  opacity: 0.8;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stats {
  display: grid;
  gap: 0.75rem;

  @include up($bp-sm) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @include down($bp-sm) {
    grid-template-columns: 1fr;
  }
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 4%);
}

.statValue {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.statLabel {
  font-size: 0.8125rem;
  line-height: 1.35;
  color: var(--color-dark-muted);
}

.machine {
  padding: 1.1rem 1.2rem;
  border: 1px dashed rgb(255 255 255 / 22%);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  background: rgb(0 0 0 / 18%);
}

.machineTitle {
  margin-bottom: 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9de9c6;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.machineList {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.machineLink {
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.8125rem;
  color: var(--color-dark-ink);
}

.machineNote {
  margin-left: 0.4rem;
  font-size: 0.75rem;
  color: var(--color-dark-muted);
}

.salary {
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgb(255 255 255 / 12%);
  font-size: 0.8125rem;
  color: var(--color-dark-muted);
}
</style>
