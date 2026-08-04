<script setup lang="ts">
const publicAsset = usePublicAsset()
const { content, docsPath } = useLandingContent()

const paths = computed(() => content.value.audience.paths.map((path) => {
  if (path.link.type === 'docs') {
    return {
      ...path,
      to: docsPath(path.link.slug),
      target: undefined
    }
  }

  return {
    ...path,
    to: path.link.to,
    target: path.link.target
  }
}))
</script>

<template>
  <section
    id="possibilities"
    class="py-20 sm:py-24"
  >
    <UContainer>
      <div class="max-w-3xl">
        <p class="text-sm font-semibold text-primary">
          {{ content.audience.eyebrow }}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-normal text-highlighted sm:text-4xl">
          {{ content.audience.title }}
        </h2>
        <p class="mt-5 text-base leading-7 text-muted sm:text-lg">
          {{ content.audience.description }}
        </p>
      </div>

      <div class="mt-10 grid gap-4 md:grid-cols-3">
        <figure
          v-for="demo in content.audience.demos"
          :key="demo.title"
          class="overflow-hidden rounded-lg border border-default bg-default"
        >
          <img
            :src="publicAsset(demo.src)"
            :alt="demo.alt"
            width="900"
            height="720"
            loading="lazy"
            class="aspect-[5/4] w-full object-cover"
          >
          <figcaption class="border-t border-default px-5 py-4">
            <p class="font-semibold text-highlighted">
              {{ demo.title }}
            </p>
            <p class="mt-1 text-sm text-muted">
              {{ demo.description }}
            </p>
          </figcaption>
        </figure>
      </div>

      <div class="mt-16 grid gap-px overflow-hidden rounded-lg border border-default bg-default sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="path in paths"
          :key="path.title"
          class="flex min-h-64 flex-col bg-elevated p-6"
        >
          <UIcon
            :name="path.icon"
            class="size-6 text-primary"
          />
          <h3 class="mt-5 text-lg font-semibold text-highlighted">
            {{ path.title }}
          </h3>
          <p class="mt-3 flex-1 text-sm leading-6 text-muted">
            {{ path.description }}
          </p>
          <UButton
            :to="path.to"
            :target="path.target"
            :label="path.label"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="link"
            class="mt-5 justify-start px-0"
          />
        </article>
      </div>
    </UContainer>
  </section>
</template>
