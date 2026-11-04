<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'
import { fullName, telegramHref } from '#shared/utils/resume'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()

const basics = computed(() => props.resume.basics)

const items = computed(() => {
  const { contacts } = basics.value
  return [
    { href: `mailto:${contacts.email}`, label: contacts.email, note: 'Почта', icon: 'lucide:mail' },
    ...(contacts.telegram
      ? [
          {
            href: telegramHref(contacts.telegram),
            label: `@${contacts.telegram}`,
            note: 'Telegram',
            icon: 'lucide:send',
          },
        ]
      : []),
    { href: contacts.github, label: 'github.com/MikeIv', note: 'GitHub', icon: 'lucide:github' },
    ...(contacts.hh
      ? [{ href: contacts.hh, label: 'Профиль hh.ru', note: 'hh.ru', icon: 'lucide:briefcase' }]
      : []),
  ]
})
</script>

<template>
  <section id="contacts" :class="$style.section" aria-labelledby="contacts-title">
    <div :class="$style.inner">
      <SectionHeading
        id="contacts-title"
        eyebrow="Контакты"
        title="Напишите, если ищете Frontend / Nuxt fullstack разработчика"
        lead="Отвечаю в течение дня. Резюме в PDF, машиночитаемый JSON и простой текст — ниже."
      />

      <div :class="$style.grid">
        <ul :class="$style.list">
          <li v-for="item in items" :key="item.href" :class="$style.item">
            <a :href="item.href" :class="$style.link" rel="noopener">
              <span :class="$style.iconWrap" aria-hidden="true">
                <Icon :name="item.icon" :class="$style.icon" />
              </span>
              <span :class="$style.text">
                <span :class="$style.note">{{ item.note }}</span>
                <span :class="$style.label">{{ item.label }}</span>
              </span>
            </a>
          </li>
        </ul>

        <div :class="$style.cta">
          <p :class="$style.ctaText">{{ fullName(basics) }}, {{ basics.location.city }}</p>
          <NuxtLink to="/Ivanov-Mikhail-Nuxt-Fullstack.pdf" :class="$style.download" download>
            <Icon name="lucide:download" aria-hidden="true" :class="$style.icon" />
            Скачать резюме в PDF
          </NuxtLink>
          <NuxtLink to="/Ivanov-Mikhail-Nuxt-Fullstack.docx" :class="$style.secondary" download>
            <Icon name="lucide:file-text" aria-hidden="true" :class="$style.icon" />
            DOCX
          </NuxtLink>
          <p :class="$style.noteSmall">
            Для агентов и ATS:
            <NuxtLink to="/resume.json">resume.json</NuxtLink>,
            <NuxtLink to="/resume.txt">resume.txt</NuxtLink>,
            <NuxtLink to="/llms.txt">llms.txt</NuxtLink>.
          </p>
        </div>
      </div>
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
  gap: clamp(1.5rem, 4vw, 3rem);

  @include up($bp-md) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.link {
  @include card;

  display: flex;
  gap: 0.9rem;
  align-items: center;
  padding: 0.85rem 1rem;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-line));
    transform: translateY(-1px);
  }
}

.iconWrap {
  display: grid;
  flex: none;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-sm);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.icon {
  width: 1.1rem;
  height: 1.1rem;
}

.text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.note {
  font-size: 0.75rem;
  color: var(--color-ink-muted);
}

.label {
  font-weight: 600;
}

.cta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.ctaText {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
}

.download,
.secondary {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.download {
  color: var(--color-dark-ink);
  background: var(--color-dark);

  &:hover {
    color: #fff;
    background: var(--color-accent-strong);
  }
}

.secondary {
  border: 1px solid var(--color-line);
  color: var(--color-ink);
  background: var(--color-surface);
}

.noteSmall {
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
}
</style>
