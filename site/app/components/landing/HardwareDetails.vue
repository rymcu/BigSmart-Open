<script setup lang="ts">
const publicAsset = usePublicAsset()
const { content, docsPath } = useLandingContent()
</script>

<template>
  <section
    id="hardware"
    class="border-b border-default py-20 sm:py-24"
  >
    <UContainer>
      <div class="max-w-3xl">
        <p class="text-sm font-semibold text-primary">
          {{ content.hardware.eyebrow }}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-normal text-highlighted sm:text-4xl">
          {{ content.hardware.title }}
        </h2>
        <p class="mt-5 text-base leading-7 text-muted sm:text-lg">
          {{ content.hardware.description }}
        </p>
      </div>
    </UContainer>

    <div class="mt-12 border-y border-default bg-elevated/35">
      <UContainer>
        <LandingHardwareModelViewer />
      </UContainer>
    </div>

    <UContainer>
      <div class="mt-14 grid min-w-0 gap-x-10 gap-y-9 md:grid-cols-2 xl:grid-cols-4">
        <section
          v-for="group in content.hardware.groups"
          :key="group.title"
          class="min-w-0 border-t border-default pt-5"
        >
          <h3 class="text-base font-semibold text-highlighted">
            {{ group.title }}
          </h3>

          <dl class="mt-3 divide-y divide-default">
            <div
              v-for="item in group.items"
              :key="item.label"
              class="min-w-0 py-3"
            >
              <dt class="text-sm leading-6 text-muted">
                {{ item.label }}
              </dt>
              <dd class="mt-0.5 min-w-0 text-sm font-medium leading-6 text-highlighted [overflow-wrap:anywhere]">
                {{ item.value }}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div class="mt-10 flex flex-wrap gap-3">
        <UButton
          :to="docsPath('hardware')"
          :label="content.hardware.docsLabel"
          icon="i-lucide-book-open"
          size="lg"
        />
        <UButton
          :to="publicAsset(content.hardware.imageFullSrc)"
          :label="content.hardware.imageOpenLabel"
          icon="i-lucide-maximize-2"
          color="neutral"
          variant="outline"
          size="lg"
          external
          target="_blank"
        />
      </div>
    </UContainer>
  </section>
</template>
