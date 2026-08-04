<script setup lang="ts">
const { content, docsPath } = useLandingContent()
</script>

<template>
  <section
    id="start"
    class="border-t border-default bg-elevated py-16 sm:py-20"
  >
    <UContainer>
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
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

        <div class="grid w-full gap-3 sm:w-auto sm:min-w-[22rem] sm:grid-cols-2 lg:justify-self-end">
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
