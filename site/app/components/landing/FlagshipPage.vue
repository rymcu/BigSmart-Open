<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const publicAsset = usePublicAsset()
const { locale } = useSiteLocale()
const { content } = useLandingContent()

const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, '')
const zhUrl = `${siteUrl}/`
const enUrl = `${siteUrl}/en`
const canonicalUrl = computed(() => locale.value === 'en' ? enUrl : zhUrl)
const ogImageUrl = `${siteUrl}/images/landing/bigsmart-hero.webp`
const heroImageUrl = publicAsset('/images/landing/bigsmart-hero.webp')

useSeoMeta({
  title: () => content.value.seo.title,
  description: () => content.value.seo.description,
  ogTitle: () => `${content.value.seo.title} | RYMCU`,
  ogDescription: () => content.value.seo.description,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: ogImageUrl,
  ogImageAlt: () => content.value.seo.imageAlt,
  ogLocale: () => content.value.seo.ogLocale,
  twitterTitle: () => `${content.value.seo.title} | RYMCU`,
  twitterDescription: () => content.value.seo.description,
  twitterImage: ogImageUrl,
  twitterImageAlt: () => content.value.seo.imageAlt
})

useHead(() => ({
  titleTemplate: '%s | RYMCU',
  htmlAttrs: {
    lang: content.value.seo.htmlLang
  },
  meta: [
    {
      property: 'og:locale:alternate',
      content: locale.value === 'en' ? 'zh_CN' : 'en_US'
    }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl },
    { rel: 'alternate', hreflang: 'en', href: enUrl },
    { rel: 'alternate', hreflang: 'x-default', href: zhUrl },
    { rel: 'preload', as: 'image', type: 'image/webp', href: heroImageUrl }
  ],
  script: [
    {
      key: 'bigsmart-product',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': 'RYMCU BigSmart',
        'description': content.value.seo.description,
        'inLanguage': content.value.seo.htmlLang,
        'image': ogImageUrl,
        'url': canonicalUrl.value,
        'brand': {
          '@type': 'Brand',
          'name': 'RYMCU'
        },
        'category': content.value.seo.category,
        'sameAs': 'https://github.com/rymcu/BigSmart-Open'
      })
    }
  ]
}))
</script>

<template>
  <div class="flagship-page overflow-clip">
    <LandingFlagshipHero />
    <LandingProofBand />
    <LandingHardwareDetails />
    <LandingAudiencePaths />
    <LandingProjectShowcase />
    <LandingReleaseCta />
  </div>
</template>
