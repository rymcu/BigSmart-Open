<script setup lang="ts">
const { content, docsPath } = useLandingContent()
</script>

<template>
  <section
    id="start"
    class="border-t border-default bg-elevated py-16 sm:py-20"
  >
    <UContainer>
      <div class="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold text-primary">
            {{ content.release.eyebrow }}
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-normal text-highlighted sm:text-4xl">
            {{ content.release.title }}
          </h2>
          <p class="mt-5 text-base leading-7 text-muted">
            {{ content.release.description }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3 lg:justify-end">
          <UButton
            :to="docsPath('quick-start')"
            :label="content.release.quickStartLabel"
            icon="i-lucide-rocket"
            size="xl"
          />
          <UButton
            :to="docsPath('firmware')"
            :label="content.release.firmwareLabel"
            icon="i-lucide-hard-drive-download"
            color="neutral"
            variant="outline"
            size="xl"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>
