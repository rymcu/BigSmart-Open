<script setup lang="ts">
const { oppositeLocaleLabel, oppositeLocalePath } = useSiteLocale()
</script>

<template>
  <UButton
    :to="oppositeLocalePath"
    :label="oppositeLocaleLabel"
    icon="i-lucide-languages"
    color="neutral"
    variant="ghost"
  />
</template>
