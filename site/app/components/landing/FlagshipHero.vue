<script setup lang="ts">
const publicAsset = usePublicAsset()
const { content, docsPath } = useLandingContent()
</script>

<template>
  <section
    class="flagship-hero relative isolate overflow-hidden text-white"
    aria-labelledby="flagship-title"
  >
    <img
      :src="publicAsset('/images/landing/bigsmart-hero.webp')"
      :alt="content.hero.imageAlt"
      width="1440"
      height="1152"
      fetchpriority="high"
      class="hero-product absolute"
    >
    <div class="absolute inset-0 bg-black/20" />
    <div class="hero-panel absolute inset-0" />

    <UContainer class="relative z-10 flex min-h-[inherit] items-center py-3 sm:py-16">
      <div class="max-w-2xl">
        <p class="mb-5 flex items-center gap-2 text-sm font-semibold text-orange-300">
          <span class="size-2 rounded-full bg-orange-400" />
          {{ content.hero.eyebrow }}
        </p>

        <h1
          id="flagship-title"
          class="max-w-xl text-4xl font-bold tracking-normal text-balance sm:text-5xl lg:text-6xl"
        >
          {{ content.hero.title }}
        </h1>

        <p class="mt-6 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg sm:leading-8">
          {{ content.hero.description }}
        </p>

        <div class="mt-4 flex flex-wrap gap-3 sm:mt-8">
          <UButton
            :to="docsPath('quick-start')"
            :label="content.hero.quickStartLabel"
            icon="i-lucide-rocket"
            size="xl"
          />
          <UButton
            :to="docsPath('hardware')"
            :label="content.hero.hardwareLabel"
            icon="i-lucide-cpu"
            color="neutral"
            variant="solid"
            size="xl"
          />
          <UButton
            to="https://github.com/rymcu/BigSmart-Open"
            target="_blank"
            :label="content.hero.repositoryLabel"
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            size="xl"
            class="hidden text-white hover:bg-white/10 sm:inline-flex"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.flagship-hero {
  min-height: clamp(33rem, calc(100svh - 6rem), 45rem);
  background: #111214;
}

.hero-product {
  right: -3%;
  bottom: -8%;
  width: min(67vw, 66rem);
  height: 112%;
  object-fit: contain;
  object-position: right center;
  opacity: 0.9;
}

.hero-panel {
  background: #111214;
  clip-path: polygon(0 0, 62% 0, 48% 100%, 0 100%);
}

@media (max-width: 767px) {
  .hero-product {
    right: -17%;
    bottom: -9%;
    width: 115%;
    height: 64%;
    object-position: center bottom;
    opacity: 0.48;
  }

  .hero-panel {
    background: rgb(17 18 20 / 58%);
    clip-path: none;
  }
}
</style>
