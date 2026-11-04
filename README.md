# Резюме Михаила Иванова — Frontend / Nuxt fullstack разработчик

Сайт-резюме, которое одинаково хорошо читают человек, ATS и AI-агент: одна страница
с опытом и проектами плюс машиночитаемые артефакты из одного источника данных.

**Сайт:** https://mikeiv.github.io/resume/
**PDF:** [Ivanov-Mikhail-Nuxt-Fullstack.pdf](https://mikeiv.github.io/resume/Ivanov-Mikhail-Nuxt-Fullstack.pdf)
**DOCX:** [Ivanov-Mikhail-Nuxt-Fullstack.docx](https://mikeiv.github.io/resume/Ivanov-Mikhail-Nuxt-Fullstack.docx)

PDF и DOCX в репозитории не лежат: их собирает `pnpm build:all`, а на сайте они
появляются после деплоя — ссылки выше ведут на опубликованные файлы.

## Что внутри

Один файл данных — `data/resume.yaml` — превращается в сайт и набор артефактов:

| Артефакт                           | Адрес                                 | Для кого                                   |
| ---------------------------------- | ------------------------------------- | ------------------------------------------ |
| Сайт (Nuxt 4, SSG)                 | `/`                                   | HR, тимлиды, нанимающие менеджеры          |
| ATS-страница — источник PDF и DOCX | `/ats`                                | парсеры, копирование текста, печать        |
| PDF, A4, не больше двух страниц    | `/Ivanov-Mikhail-Nuxt-Fullstack.pdf`  | ATS, парсеры резюме, email                 |
| DOCX без таблиц и колонок          | `/Ivanov-Mikhail-Nuxt-Fullstack.docx` | hh.ru, кадровые системы                    |
| JSON Resume                        | `/resume.json`                        | ATS, HR-боты, импорт в сервисы             |
| Простой текст                      | `/resume.txt`                         | LLM-агенты, поиск по ключевым словам       |
| `llms.txt` со ссылками             | `/llms.txt`                           | агенты, которые ищут кандидата по описанию |
| hh-пакет — поля для формы hh.ru    | `docs/hh-profile-pack.md`             | ручное заполнение профиля на hh.ru         |

Адреса указаны от корня сайта: на GitHub Pages он открывается под префиксом `/resume/`,
локально — от `/`. JSON-LD `schema.org/Person`, sitemap, robots и OG-карточка
собираются автоматически.

## Требования

Node.js 22.19+ (или 24.11+), pnpm 11+.

## Команды

```bash
pnpm install            # зависимости + nuxt prepare
pnpm dev                # локальная разработка
pnpm generate           # статическая сборка в .output/public
pnpm preview            # раздача собранной статики на localhost:3000
pnpm verify             # линты, форматирование, типы и тесты
pnpm test               # только тесты (vitest)
pnpm typecheck          # только типы (nuxt typecheck)
pnpm build:all          # hh-пакет, og.png, статика, PDF, DOCX, проверка текста PDF
pnpm audit:site         # Lighthouse с порогами 95/100/95/95
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

GitHub Pages собирается workflow `.github/workflows/deploy.yml`: OG-карточка и иконки
(`pnpm emit:social`), затем `nuxt generate` с `NUXT_APP_BASE_URL=/resume/` и
`NUXT_PUBLIC_SITE_URL=https://mikeiv.github.io/resume/`, после чего генерируются
PDF и DOCX и проверяется текстовый слой (`pnpm check:pdf`). Публикуется `.output/public`.
Пул-реквесты проверяет `.github/workflows/ci.yml`: `pnpm verify` и `pnpm generate`.

## Структура

```
data/resume.yaml          единственный источник данных
shared/schema/resume.ts   zod-схема и типы
shared/utils/exporters.ts генераторы JSON Resume, txt, llms.txt, JSON-LD, hh-пакета
app/                      Nuxt 4: страницы, секции, стили (CSS Modules + SCSS)
server/                   Nitro: /api/resume, /resume.json, /resume.txt, /llms.txt, sitemap, robots
public/                   статика: иконки, og.png; сюда же собираются PDF и DOCX (в git не идут)
scripts/                  генераторы PDF/DOCX/OG/hh-пакета, скриншоты, Lighthouse
tests/                    vitest: схема, форматтеры, экспортёры
docs/                     hh-пакет и внутренние заметки
```

## Для AI-агентов

Начните с [`/llms.txt`](https://mikeiv.github.io/resume/llms.txt) — там карта
файлов и краткое описание профиля. Машинная версия резюме — `resume.json`
(JSON Resume + расширения). Если нужен текст для контекста — `resume.txt`.

## Лицензия

Код — [MIT](./LICENSE). Данные резюме и тексты — © Михаил Иванов, копирование
без разрешения не допускается.
