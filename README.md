# Резюме Михаила Иванова — Nuxt fullstack разработчик

Сайт-резюме, которое одинаково хорошо читают человек, ATS и AI-агент: одна страница
с опытом и проектами плюс машиночитаемые артефакты из одного источника данных.

**Сайт:** https://mikeiv.github.io/resume/
**PDF:** [Ivanov-Mikhail-Nuxt-Fullstack.pdf](./public/Ivanov-Mikhail-Nuxt-Fullstack.pdf)
**DOCX:** [Ivanov-Mikhail-Nuxt-Fullstack.docx](./public/Ivanov-Mikhail-Nuxt-Fullstack.docx)

## Что внутри

Один файл данных — `data/resume.yaml` — превращается в шесть представлений:

| Артефакт                     | Адрес                                 | Для кого                                   |
| ---------------------------- | ------------------------------------- | ------------------------------------------ |
| Сайт (Nuxt 4, SSG)           | `/`                                   | HR, тимлиды, нанимающие менеджеры          |
| Печатный PDF, A4, 2 страницы | `/Ivanov-Mikhail-Nuxt-Fullstack.pdf`  | ATS, парсеры резюме, email                 |
| DOCX без таблиц и колонок    | `/Ivanov-Mikhail-Nuxt-Fullstack.docx` | hh.ru, кадровые системы                    |
| JSON Resume                  | `/resume.json`                        | ATS, HR-боты, импорт в сервисы             |
| Простой текст                | `/resume.txt`                         | LLM-агенты, поиск по ключевым словам       |
| `llms.txt` со ссылками       | `/llms.txt`                           | агенты, которые ищут кандидата по описанию |

Плюс: `schema.org/Person` JSON-LD на странице, sitemap, robots, OG-карточка.

## Команды

```bash
pnpm install            # зависимости + nuxt prepare
pnpm dev                # локальная разработка
pnpm generate           # статическая сборка в .output/public
pnpm verify             # линты + типы + тесты
pnpm build:all          # hh-пакет, og.png, статика, PDF, DOCX, проверка текста PDF
pnpm audit:site         # Lighthouse с порогами (perf/a11y/best/seo)
pnpm screenshot         # скриншоты собранного сайта в .preview/
```

## Требования к артефактам

- PDF — одна колонка, без картинок и иконок, текстовый слой обязателен
  (проверяется `pnpm check:pdf`: разделы и контакты извлекаются текстом).
- PDF не длиннее двух страниц: ATS и рекрутеры редко смотрят дальше.
- JSON Resume соответствует схеме; дополнительно добавлены `meta.canonical`
  и `projects[].keywords` — по ним работают HR-боты.
- Тесты держат данные в рамках: длина заголовка, единственное текущее место
  работы, отсутствие телефона и почты в свободных текстах, сортировка опыта.

## Деплой

GitHub Pages собирается workflow `.github/workflows/deploy.yml`: `nuxt generate`
с `NUXT_APP_BASE_URL=/resume/` и `NUXT_PUBLIC_SITE_URL=https://mikeiv.github.io/resume/`,
затем в CI генерируются PDF/DOCX и публикуется `.output/public`.

## Структура

```
data/resume.yaml          единственный источник данных
shared/schema/resume.ts   zod-схема и типы
shared/utils/exporters.ts генераторы JSON Resume, txt, llms.txt, JSON-LD, hh-пакета
app/                      Nuxt 4: страницы, секции, стили (CSS Modules + SCSS)
server/                   Nitro: /api/resume, /resume.json, /resume.txt, /llms.txt, /ats
scripts/                  генераторы PDF/DOCX/OG, скриншоты, Lighthouse
tests/                    vitest: схема, форматтеры, экспортёры
```

## Для AI-агентов

Начните с [`/llms.txt`](https://mikeiv.github.io/resume/llms.txt) — там карта
файлов и краткое описание профиля. Машинная версия резюме — `resume.json`
(JSON Resume + расширения). Если нужен текст для контекста — `resume.txt`.

## Лицензия

Код — MIT. Данные резюме и тексты — © Михаил Иванов, копирование без разрешения
не допускается.
