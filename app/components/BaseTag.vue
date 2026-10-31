<script setup lang="ts">
interface Props {
  label: string
  tone?: 'default' | 'accent' | 'dark'
}

const props = withDefaults(defineProps<Props>(), { tone: 'default' })
</script>

<template>
  <span
    :class="[
      $style.tag,
      props.tone === 'accent' && $style.accent,
      props.tone === 'dark' && $style.dark,
    ]"
  >
    {{ props.label }}
  </span>
</template>

<style module lang="scss">
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: 999px;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--color-ink-muted);
  white-space: nowrap;
  background: var(--color-surface);
}

.accent {
  border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}

.dark {
  border-color: rgb(255 255 255 / 18%);
  color: var(--color-dark-ink);
  background: rgb(255 255 255 / 6%);
}
</style>
