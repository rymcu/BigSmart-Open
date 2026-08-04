<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { docsPathFor, docsSlugFromPath } from '#shared/utils/siteRoutes'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { locale, ogLocale, text } = useSiteLocale()
const runtimeConfig = useRuntimeConfig()
const docsSlug = docsSlugFromPath(route.path)

if (docsSlug === null) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: page } = await useAsyncData(route.path, () => {
  return locale.value === 'en'
    ? queryCollection('docsEn').path(route.path).first()
    : queryCollection('docsZh').path(route.path).first()
})
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return locale.value === 'en'
    ? queryCollectionItemSurroundings('docsEn', route.path, { fields: ['description'] })
    : queryCollectionItemSurroundings('docsZh', route.path, { fields: ['description'] })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description
const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, '')
const canonicalUrl = `${siteUrl}${route.path}`
const zhUrl = `${siteUrl}${docsPathFor('zh', docsSlug)}`
const enUrl = `${siteUrl}${docsPathFor('en', docsSlug)}`

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: canonicalUrl,
  ogLocale
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl },
    { rel: 'alternate', hreflang: 'en', href: enUrl },
    { rel: 'alternate', hreflang: 'x-default', href: zhUrl }
  ],
  meta: [
    {
      property: 'og:locale:alternate',
      content: locale.value === 'en' ? 'zh_CN' : 'en_US'
    }
  ]
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))
const pageLinks = computed(() => {
  return (page.value?.links || []).filter(link => link.icon !== 'i-lucide-languages')
})

const editSourcePath = computed(() => {
  const stem = page.value?.stem
  const extension = page.value?.extension

  if (!stem || !extension) {
    return null
  }

  const publicStemPrefix = `${docsPathFor(locale.value).slice(1)}/`
  if (!stem.startsWith(publicStemPrefix)) {
    return null
  }

  const sourceDirectory = locale.value === 'en' ? '2.en' : '1.zh'
  return `${sourceDirectory}/${stem.slice(publicStemPrefix.length)}.${extension}`
})

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit && editSourcePath.value) {
    links.push({
      icon: 'i-lucide-external-link',
      label: text.value.editThisPage,
      to: `${toc.bottom.edit.replace(/\/$/, '')}/${editSourcePath.value}`,
      target: '_blank'
    })
  }

  const projectLinks = (toc?.bottom?.links || []).map((link) => {
    if (link.to !== 'https://github.com/rymcu/BigSmart-Open') {
      return link
    }

    return {
      ...link,
      label: text.value.repositoryLabel
    }
  })

  return [...links, ...projectLinks].filter(Boolean)
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in pageLinks"
          :key="index"
          v-bind="link"
        />

        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :title="text.tocTitle"
        :links="page.body?.toc?.links"
      >
        <template
          v-if="toc?.bottom"
          #bottom
        >
          <div
            class="hidden lg:block space-y-6"
            :class="{ 'mt-6!': page.body?.toc?.links?.length }"
          >
            <USeparator
              v-if="page.body?.toc?.links?.length"
              type="dashed"
            />

            <UPageLinks
              :title="text.projectLinksTitle"
              :links="links"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
