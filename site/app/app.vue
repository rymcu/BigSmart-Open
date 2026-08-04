<script setup lang="ts">
const { seo } = useAppConfig()
const { locale, htmlLang, uiLocale, text, isDocsRoute } = useSiteLocale()
const runtimeConfig = useRuntimeConfig()

const faviconUrl = `${runtimeConfig.app.baseURL}favicon.ico`

const { data: zhNavigation } = await useAsyncData('navigation-zh', () => queryCollectionNavigation('docsZh'))
const { data: enNavigation } = await useAsyncData('navigation-en', () => queryCollectionNavigation('docsEn'))
const { data: zhFiles } = useLazyAsyncData('search-zh', () => queryCollectionSearchSections('docsZh'), {
  server: false
})
const { data: enFiles } = useLazyAsyncData('search-en', () => queryCollectionSearchSections('docsEn'), {
  server: false
})
const navigation = computed(() => {
  const localizedNavigation = locale.value === 'en' ? enNavigation.value : zhNavigation.value

  if (locale.value === 'en' && localizedNavigation?.length === 1 && localizedNavigation[0]?.path === '/en') {
    return localizedNavigation[0].children || []
  }

  return localizedNavigation
})
const files = computed(() => locale.value === 'en' ? enFiles.value : zhFiles.value)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: faviconUrl }
  ],
  htmlAttrs: {
    lang: htmlLang
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        v-if="isDocsRoute"
        :files="files"
        :navigation="navigation"
        :title="text.searchTitle"
        :description="text.searchDescription"
        :placeholder="text.searchPlaceholder"
      />
    </ClientOnly>
  </UApp>
</template>
