<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()
</script>

<template>
  <section id="about" :class="$style.section" aria-labelledby="about-title">
    <div :class="$style.inner">
      <SectionHeading
        id="about-title"
        eyebrow="Профиль"
        title="Коротко о себе"
        lead="Что умею, чем это подтверждается и что ищу."
      />

      <div :class="$style.grid">
        <div :class="$style.summary">
          <p :class="$style.text">{{ props.resume.basics.summary }}</p>

          <dl :class="$style.facts">
            <div :class="$style.fact">
              <dt>Локация</dt>
              <dd>
                {{ props.resume.basics.location.city }},
                {{ props.resume.basics.location.countryCode }}
              </dd>
            </div>
            <div :class="$style.fact">
              <dt>Формат</dt>
              <dd>{{ formatWorkFormats(props.resume.basics.formats) }}</dd>
            </div>
            <div :class="$style.fact">
              <dt>Ожидания</dt>
              <dd>{{ formatSalary(props.resume.basics.salary) }}</dd>
            </div>
            <div v-if="props.resume.languages.length > 0" :class="$style.fact">
              <dt>Языки</dt>
              <dd>
                {{
                  props.resume.languages.map((item) => `${item.name} — ${item.level}`).join(', ')
                }}
              </dd>
            </div>
          </dl>
        </div>

        <div :class="$style.skills">
          <div v-for="group in props.resume.skills" :key="group.group" :class="$style.group">
            <h3 :class="$style.groupTitle">{{ group.group }}</h3>
            <ul :class="$style.tags">
              <li v-for="item in group.items" :key="item">
                <BaseTag :label="item" />
              </li>
            </ul>
          </div>
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

.summary {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.text {
  font-size: 1.05rem;
  color: var(--color-ink-muted);
}

.facts {
  display: grid;
  gap: 0.6rem;
  margin: 0;
}

.fact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--color-line);

  dt {
    min-width: 7.5rem;
    font-size: 0.875rem;
    color: var(--color-ink-muted);
  }

  dd {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 500;
  }
}

.skills {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.groupTitle {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
