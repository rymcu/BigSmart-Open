<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { header } = useAppConfig()
const { homePath, docsRoot, isDocsRoute, oppositeLocaleLabel, oppositeLocalePath, text } = useSiteLocale()
const menuText = computed(() => ({
  title: text.value.menuTitle,
  description: text.value.menuDescription
}))
const productLinks = computed(() => text.value.productLinks.map(link => ({
  label: link.label,
  to: `${homePath.value}${link.hash}`
})))
</script>

<template>
  <UHeader
    :title="header?.title || 'RYMCU BigSmart'"
    :ui="{ center: 'flex-1' }"
    :to="homePath"
    :menu="menuText"
  >
    <UContentSearchButton
      v-if="isDocsRoute && header?.search"
      :collapsed="false"
      class="w-full"
    />

    <nav
      v-else
      :aria-label="text.productNavigationLabel"
      class="hidden items-center justify-center gap-7 lg:flex"
    >
      <NuxtLink
        v-for="link in productLinks"
        :key="link.to"
        :to="link.to"
        class="text-sm font-medium text-muted transition-colors hover:text-highlighted"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <UContentSearchButton
        v-if="isDocsRoute && header?.search"
        class="lg:hidden"
      />

      <UButton
        v-if="isDocsRoute"
        :to="homePath"
        :label="text.homeLabel"
        icon="i-lucide-house"
        color="neutral"
        variant="ghost"
        class="hidden sm:inline-flex"
      />

      <TemplateMenu />

      <UButton
        v-if="!isDocsRoute"
        :to="docsRoot"
        :label="text.docsLabel"
        icon="i-lucide-book-open"
        color="neutral"
        variant="ghost"
        class="hidden sm:inline-flex"
      />

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <template v-if="isDocsRoute">
        <UContentNavigation
          highlight
          :navigation="navigation"
        />
        <USeparator class="my-3" />
        <UButton
          :to="homePath"
          :label="text.homeLabel"
          icon="i-lucide-house"
          color="neutral"
          variant="ghost"
          class="justify-start"
        />
      </template>

      <nav
        v-else
        :aria-label="text.productNavigationLabel"
        class="flex flex-col gap-1"
      >
        <UButton
          v-for="link in productLinks"
          :key="link.to"
          :to="link.to"
          :label="link.label"
          color="neutral"
          variant="ghost"
          class="justify-start"
        />
        <USeparator class="my-3" />
        <UButton
          :to="docsRoot"
          :label="text.docsLabel"
          icon="i-lucide-book-open"
          color="neutral"
          variant="ghost"
          class="justify-start"
        />
        <UButton
          :to="oppositeLocalePath"
          :label="oppositeLocaleLabel"
          icon="i-lucide-languages"
          color="neutral"
          variant="ghost"
          class="justify-start"
        />
      </nav>
    </template>
  </UHeader>
</template>
