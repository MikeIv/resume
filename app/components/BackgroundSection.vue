<script setup lang="ts">
import type { Resume } from '#shared/schema/resume'
import { formatEducation } from '#shared/utils/resume'

interface Props {
  resume: Resume
}

const props = defineProps<Props>()
</script>

<template>
  <section id="background" :class="$style.section" aria-labelledby="background-title">
    <div :class="$style.inner">
      <SectionHeading
        id="background-title"
        eyebrow="Фундамент"
        title="Образование и ранний опыт"
        lead="Дизайн и полиграфия дали вкус к типографике и внимание к деталям — это до сих пор видно в интерфейсах."
      />

      <div :class="$style.grid">
        <div :class="$style.block">
          <h3 :class="$style.blockTitle">До веб-разработки</h3>
          <ul :class="$style.list">
            <li
              v-for="item in props.resume.earlyExperience"
              :key="item.period"
              :class="$style.item"
            >
              <span :class="$style.period">{{ item.period }}</span>
              <span :class="$style.text">{{ item.text }}</span>
            </li>
          </ul>
        </div>

        <div :class="$style.column">
          <div v-if="props.resume.education.length > 0" :class="$style.block">
            <h3 :class="$style.blockTitle">Образование</h3>
            <ul :class="$style.list">
              <li
                v-for="item in props.resume.education"
                :key="item.institution"
                :class="$style.item"
              >
                <span :class="$style.text">{{ formatEducation(item) }}</span>
              </li>
            </ul>
          </div>

          <div v-if="props.resume.languages.length > 0" :class="$style.block">
            <h3 :class="$style.blockTitle">Языки</h3>
            <ul :class="$style.list">
              <li v-for="item in props.resume.languages" :key="item.name" :class="$style.item">
                <span :class="$style.text">{{ item.name }} — {{ item.level }}</span>
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
  background: var(--color-surface);
  border-block: 1px solid var(--color-line);
}

.inner {
  @include container;
}

.grid {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);

  @include up($bp-md) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  }
}

.block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  & + & {
    margin-top: 1.5rem;
  }
}

.column {
  display: flex;
  flex-direction: column;
}

.blockTitle {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-left: 0.9rem;
  border-left: 2px solid var(--color-line);
}

.period {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-accent-strong);
}

.text {
  font-size: 0.9375rem;
  color: var(--color-ink-muted);
}
</style>
