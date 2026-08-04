<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { joinURL } from 'ufo'

const route = useRoute()
const toast = useToast()
const { text } = useSiteLocale()
const { copy, copied } = useClipboard()
const runtimeConfig = useRuntimeConfig()
const { app } = runtimeConfig
const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, '')

const rawPath = computed(() => joinURL(app.baseURL, `raw${route.path}.md`))
const mdPath = computed(() => joinURL(siteUrl, `raw${route.path}.md`))

const items = computed(() => [
  {
    label: text.value.copyMarkdownLink,
    icon: 'i-lucide-link',
    onSelect() {
      copy(mdPath.value)
      toast.add({
        title: text.value.copiedToClipboard,
        icon: 'i-lucide-check-circle'
      })
    }
  },
  {
    label: text.value.viewAsMarkdown,
    icon: 'i-simple-icons:markdown',
    target: '_blank',
    to: rawPath.value
  },
  {
    label: text.value.openInChatGPT,
    icon: 'i-simple-icons:openai',
    target: '_blank',
    to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(text.value.readInAiPrompt(mdPath.value))}`
  },
  {
    label: text.value.openInClaude,
    icon: 'i-simple-icons:anthropic',
    target: '_blank',
    to: `https://claude.ai/new?q=${encodeURIComponent(text.value.readInAiPrompt(mdPath.value))}`
  }
])

async function copyPage() {
  copy(await $fetch<string>(rawPath.value))
}
</script>

<template>
  <UFieldGroup size="sm">
    <UButton
      :label="text.copyPage"
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      color="neutral"
      variant="outline"
      :ui="{
        leadingIcon: copied ? 'text-primary' : 'text-neutral'
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <UButton
        icon="i-lucide-chevron-down"
        color="neutral"
        variant="outline"
        :aria-label="text.copyActions"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
