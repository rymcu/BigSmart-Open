<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { locale, htmlLang, uiLocale, homePath, docsRoot, isDocsRoute, text } = useSiteLocale()
const localizedError = computed(() => ({
  ...props.error,
  message: text.value.pageNotFoundDescription,
  statusMessage: props.error.statusCode === 404 ? text.value.pageNotFoundTitle : props.error.statusMessage
}))

useHead({
  htmlAttrs: {
    lang: htmlLang
  }
})

useSeoMeta({
  title: text.value.pageNotFoundTitle,
  description: text.value.pageNotFoundDescription
})

const { data: zhNavigation } = await useAsyncData('error-navigation-zh', () => queryCollectionNavigation('docsZh'))
const { data: enNavigation } = await useAsyncData('error-navigation-en', () => queryCollectionNavigation('docsEn'))
const { data: zhFiles } = useLazyAsyncData('error-search-zh', () => queryCollectionSearchSections('docsZh'), {
  server: false
})
const { data: enFiles } = useLazyAsyncData('error-search-en', () => queryCollectionSearchSections('docsEn'), {
  server: false
})
const navigation = computed(() => locale.value === 'en' ? enNavigation.value : zhNavigation.value)
const files = computed(() => locale.value === 'en' ? enFiles.value : zhFiles.value)
const redirectPath = computed(() => isDocsRoute.value ? docsRoot.value : homePath.value)

provide('navigation', navigation)
</script>

<template>
  <UApp :locale="uiLocale">
    <AppHeader />

    <UError
      :error="localizedError"
      :redirect="redirectPath"
    />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :title="text.searchTitle"
        :description="text.searchDescription"
        :placeholder="text.searchPlaceholder"
      />
    </ClientOnly>
  </UApp>
</template>
