<script setup lang="ts">
import { toJsonLd } from '#shared/utils/exporters'
import { shortName } from '#shared/utils/resume'

const { data } = await useResume()

if (!data.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Данные резюме недоступны',
  })
}

const resume = data.value
const config = useRuntimeConfig()
const site = (config.public.siteUrl as string).replace(/\/?$/, '/')
const base = config.app.baseURL.replace(/\/?$/, '/')

/** Путь к статике с учётом базового URL (GitHub Pages: `/resume/`). */
const asset = (path: string): string => `${base}${path.replace(/^\//, '')}`
/** Абсолютный адрес — для canonical, sitemap и JSON-LD. */
const absolute = (path: string): string => `${site}${path.replace(/^\//, '')}`

useSeoMeta({
  title: resume.seo.title,
  description: resume.seo.description,
  ogTitle: resume.seo.title,
  ogDescription: resume.seo.description,
  ogType: 'profile',
  ogLocale: 'ru_RU',
  ogUrl: site,
  ogImage: absolute('og.png'),
  ogImageAlt: `${resume.basics.firstName} ${resume.basics.lastName} — ${resume.basics.label}`,
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
})

useHead({
  titleTemplate: (title) => (title ? `${title}` : resume.seo.title),
  link: [
    { rel: 'canonical', href: site },
    {
      rel: 'alternate',
      type: 'application/json',
      href: asset('resume.json'),
      title: 'JSON Resume',
    },
    {
      rel: 'alternate',
      type: 'text/plain',
      href: asset('resume.txt'),
      title: 'Резюме простым текстом',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(toJsonLd(resume, site)),
    },
  ],
})
</script>

<template>
  <div>
    <SiteHeader :name="shortName(resume.basics)" :role="resume.basics.label" />

    <main id="main">
      <HeroSection :resume="resume" />
      <AboutSection :resume="resume" />
      <ExperienceSection :resume="resume" />
      <ProjectsSection :resume="resume" />
      <AgenticSection :agentic="resume.agentic" />
      <BackgroundSection :resume="resume" />
      <ContactSection :resume="resume" />
    </main>

    <SiteFooter :resume="resume" />
  </div>
</template>
