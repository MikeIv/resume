<script setup lang="ts">
import {
  formatEducation,
  formatPeriod,
  formatSalary,
  formatWorkFormats,
  fullName,
  siteAddress,
  telegramHref,
} from '#shared/utils/resume'

const { data } = await useResume()

if (!data.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Данные резюме недоступны',
  })
}

const resume = data.value
const basics = computed(() => resume.basics)

/** Строка статуса: где, как и за сколько готов работать. */
const statusLine = computed(() =>
  [
    'Открыт к предложениям',
    `${basics.value.location.city}, ${basics.value.location.countryCode}`,
    formatWorkFormats(basics.value.formats),
    formatSalary(basics.value.salary),
  ].join(' · '),
)

/** Контакты одной строкой: парсеры получают непрерывный текст с разделителями. */
const contactLine = computed(() =>
  [
    basics.value.contacts.email,
    basics.value.contacts.telegram ? telegramHref(basics.value.contacts.telegram) : null,
    basics.value.contacts.github,
  ]
    .filter(Boolean)
    .join(' · '),
)

/** Подпись в подвале: адрес сайта берём из данных, без хардкода в шаблоне. */
const siteNote = computed(() => {
  const address = siteAddress(basics.value.contacts.site)
  return address
    ? `PDF, DOCX и машиночитаемый JSON — ${address}`
    : 'PDF, DOCX и машиночитаемый JSON'
})

/** Результаты проекта без повторов «демо на Vercel»: ссылки и так идут строкой ниже. */
function projectResults(results: string[]): string[] {
  return results.filter((result) => !/^Демо на Vercel/.test(result))
}

/** Абзац «о себе» делим на две части, чтобы не было монолита. */ const summaryParts = computed(
  () => {
    const marker = 'Разрабатываю с AI-агентами'
    const index = resume.basics.summary.indexOf(marker)

    if (index < 0) {
      return [resume.basics.summary]
    }

    return [resume.basics.summary.slice(0, index).trim(), resume.basics.summary.slice(index).trim()]
  },
)

useSeoMeta({
  title: `Резюме — ${fullName(resume.basics)} (PDF)`,
  description: resume.seo.description,
  robots: 'noindex, nofollow',
})

useHead({
  htmlAttrs: { lang: 'ru' },
})
</script>

<template>
  <article :class="$style.page">
    <header :class="$style.head">
      <h1 :class="$style.name">{{ fullName(basics) }}</h1>
      <p :class="$style.role">{{ basics.label }}</p>
      <p :class="$style.status">{{ statusLine }}</p>
      <p :class="$style.contacts">{{ contactLine }}</p>
    </header>

    <section :class="$style.block">
      <h2 :class="$style.h2">О себе</h2>
      <p v-for="part in summaryParts" :key="part" :class="$style.lead">{{ part }}</p>
    </section>

    <section :class="$style.block">
      <h2 :class="$style.h2">Ключевые навыки</h2>
      <dl :class="$style.skills">
        <template v-for="group in resume.skills" :key="group.group">
          <dt :class="$style.skillLabel">{{ group.group }}</dt>
          <dd :class="$style.skillItems">{{ group.items.join(' · ') }}</dd>
        </template>
      </dl>
    </section>

    <section :class="$style.block">
      <h2 :class="$style.h2">Опыт работы</h2>

      <div v-for="job in resume.experience" :key="job.company + job.from" :class="$style.job">
        <div :class="$style.row">
          <div>
            <p :class="$style.company">
              {{ job.company }}
              <span v-if="job.legalName" :class="$style.legal">({{ job.legalName }})</span>
            </p>
            <p :class="$style.position">
              {{ job.position }}<template v-if="job.location"> · {{ job.location }}</template>
            </p>
          </div>
          <p :class="$style.period">{{ formatPeriod(job.from, job.to) }}</p>
        </div>

        <p :class="$style.text">{{ job.summary }}</p>

        <ul :class="$style.list">
          <li v-for="achievement in job.achievements" :key="achievement">{{ achievement }}</li>
        </ul>

        <p v-if="job.stack.length > 0" :class="$style.stack">
          <span :class="$style.stackLabel">Стек:</span> {{ job.stack.join(' · ') }}
        </p>
      </div>
    </section>

    <section :class="$style.block">
      <h2 :class="$style.h2">Проекты</h2>

      <div v-for="project in resume.projects" :key="project.slug" :class="$style.job">
        <div :class="$style.row">
          <div>
            <p :class="$style.company">{{ project.name }}</p>
            <p :class="$style.position">{{ project.role }}</p>
          </div>
          <p :class="$style.period">{{ project.period }}</p>
        </div>

        <p :class="$style.text">{{ project.summary }}</p>

        <ul v-if="projectResults(project.results).length > 0" :class="$style.list">
          <li v-for="result in projectResults(project.results)" :key="result">{{ result }}</li>
        </ul>

        <p :class="$style.stack">
          <span :class="$style.stackLabel">Стек:</span> {{ project.stack.join(' · ') }}
        </p>

        <p v-if="project.demo || project.code" :class="$style.stack">
          <template v-if="project.demo">
            <span :class="$style.stackLabel">Демо:</span> {{ project.demo }}
          </template>
          <template v-if="project.demo && project.code"> · </template>
          <template v-if="project.code">
            <span :class="$style.stackLabel">Код:</span> {{ project.code }}
          </template>
        </p>
      </div>
    </section>

    <section v-if="resume.agentic.items.length > 0" :class="$style.block">
      <h2 :class="$style.h2">Подход к работе</h2>
      <ul :class="$style.approach">
        <li v-for="item in resume.agentic.items" :key="item.title">
          <strong :class="$style.approachTitle">{{ item.title }}.</strong> {{ item.text }}
        </li>
      </ul>
    </section>

    <section :class="$style.block">
      <h2 :class="$style.h2">Ранний опыт</h2>
      <dl :class="$style.early">
        <template v-for="item in resume.earlyExperience" :key="item.period">
          <dt :class="$style.earlyPeriod">{{ item.period }}</dt>
          <dd :class="$style.earlyText">{{ item.text }}</dd>
        </template>
      </dl>
    </section>

    <section
      v-if="resume.education.length > 0 || resume.languages.length > 0"
      :class="$style.block"
    >
      <h2 :class="$style.h2">Образование и языки</h2>
      <p v-for="item in resume.education" :key="item.institution" :class="$style.text">
        {{ formatEducation(item) }}
      </p>
      <p v-if="resume.languages.length > 0" :class="$style.text">
        {{ resume.languages.map((item) => `${item.name} — ${item.level}`).join(', ') }}
      </p>
    </section>

    <footer :class="$style.footer">
      <span>Обновлено {{ resume.meta.updated }}</span>
      <span>{{ siteNote }}</span>
    </footer>
  </article>
</template>

<style module lang="scss">
.page {
  --print-ink: #14181d;
  --print-muted: #4a5460;
  --print-soft: #6b7684;
  --print-accent: #0b6b4a;
  --print-line: #e2e7ed;

  max-width: 210mm;
  margin-inline: auto;
  padding: 11mm 13mm;
  font-family: var(--font-body);
  font-size: 9.1pt;
  line-height: 1.42;
  color: var(--print-ink);
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ── шапка ─────────────────────────────────────────────────────────────── */

.head {
  padding-bottom: 2.6mm;
  border-bottom: 2px solid var(--print-accent);
}

.name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 24pt;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.015em;
}

.role {
  margin: 1.4mm 0 0;
  font-size: 10.2pt;
  font-weight: 600;
  color: var(--print-accent);
}

.status {
  margin: 1.6mm 0 0;
  font-size: 8.4pt;
  line-height: 1.4;
  color: var(--print-soft);
}

.contacts {
  margin: 0.8mm 0 0;
  font-size: 8.5pt;
  line-height: 1.4;
  color: var(--print-muted);
}

/* ── разделы ───────────────────────────────────────────────────────────── */

.block {
  margin-top: 3.2mm;
}

.h2 {
  margin: 0 0 1mm;
  padding: 0 0 0.8mm;
  border-bottom: 1px solid var(--print-line);
  font-family: var(--font-body);
  font-size: 8.4pt;
  font-weight: 700;
  color: var(--print-accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  break-after: avoid;
}

.lead {
  max-width: 178mm;
  margin: 0 0 1.2mm;
  font-size: 9pt;
  line-height: 1.44;
  color: var(--print-ink);

  &:last-child {
    margin-bottom: 0;
  }
}

.text {
  margin: 0.8mm 0 0;
  color: var(--print-muted);
}

/* ── навыки ────────────────────────────────────────────────────────────── */

.skills,
.early {
  display: grid;
  grid-template-columns: 30mm minmax(0, 1fr);
  gap: 0.6mm 3mm;
  margin: 0;
}

.skillLabel,
.earlyPeriod {
  margin: 0;
  font-size: 8.2pt;
  font-weight: 700;
  color: var(--print-soft);
  letter-spacing: 0.02em;
}

.skillItems,
.earlyText {
  margin: 0;
  font-size: 8.8pt;
  line-height: 1.4;
  color: var(--print-ink);
}

.earlyPeriod {
  color: var(--print-accent);
  font-variant-numeric: tabular-nums;
}

/* ── опыт и проекты ────────────────────────────────────────────────────── */

.job {
  padding-top: 1.2mm;
  break-inside: avoid;

  &:first-of-type {
    padding-top: 0;
  }

  & + & {
    margin-top: 0.4mm;
    border-top: 1px dotted var(--print-line);
  }
}

.row {
  display: flex;
  gap: 4mm;
  align-items: baseline;
  justify-content: space-between;
  break-after: avoid;
}

.approach {
  margin: 0;
  padding-left: 3.6mm;
  font-size: 8.4pt;
  line-height: 1.42;
  color: var(--print-muted);
  list-style: disc;

  li {
    margin-bottom: 0.4mm;

    &::marker {
      color: var(--print-accent);
    }
  }
}

.approachTitle {
  font-weight: 700;
  color: var(--print-ink);
}

.company {
  margin: 0;
  font-family: var(--font-display);
  font-size: 10.6pt;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.legal {
  font-family: var(--font-body);
  font-size: 8.2pt;
  font-weight: 500;
  color: var(--print-soft);
}

.position {
  margin: 0.4mm 0 0;
  font-size: 8.8pt;
  font-weight: 500;
  color: var(--print-muted);
}

.period {
  flex: none;
  margin: 0;
  font-size: 8.2pt;
  font-weight: 700;
  color: var(--print-accent);
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.list {
  margin: 0.8mm 0 0;
  padding-left: 3.6mm;
  font-size: 8.8pt;
  line-height: 1.33;
  list-style: disc;

  li {
    margin-bottom: 0.2mm;

    &::marker {
      color: var(--print-accent);
    }
  }
}

.stack {
  margin: 0.8mm 0 0;
  font-size: 8pt;
  line-height: 1.35;
  color: var(--print-soft);
  overflow-wrap: anywhere;
}

.stackLabel {
  font-weight: 700;
  color: var(--print-muted);
}

/* ── подвал ────────────────────────────────────────────────────────────── */

.footer {
  display: flex;
  gap: 6mm;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 2.6mm;
  padding-top: 1.4mm;
  border-top: 1px solid var(--print-line);
  font-size: 7.8pt;
  color: var(--print-soft);
}

@media print {
  .page {
    max-width: none;
    padding: 8mm 12mm;
  }
}
</style>
