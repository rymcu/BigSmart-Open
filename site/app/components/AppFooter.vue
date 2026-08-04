<script setup lang="ts">
const { footer } = useAppConfig()
const { text } = useSiteLocale()

const footerLinks = computed(() => {
  return (footer?.links || []).map((link) => {
    if (link.to !== 'https://github.com/rymcu/BigSmart-Open') {
      return link
    }

    return {
      ...link,
      'aria-label': text.value.repositoryLabel
    }
  })
})
</script>

<template>
  <UFooter>
    <template #left>
      {{ footer.credits }}
    </template>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />

      <template v-if="footerLinks.length">
        <UButton
          v-for="(link, index) of footerLinks"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
