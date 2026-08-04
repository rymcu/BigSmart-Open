<script setup lang="ts">
const publicAsset = usePublicAsset()
const { content, docsPath } = useLandingContent()
</script>

<template>
  <section
    id="open-hardware"
    class="bg-[#0b3566] py-20 text-white sm:py-24"
  >
    <UContainer class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
      <div>
        <p class="text-sm font-semibold text-sky-200">
          {{ content.project.resourcesEyebrow }}
        </p>
        <h2 class="mt-3 max-w-2xl text-3xl font-bold tracking-normal sm:text-4xl">
          {{ content.project.resourcesTitle }}
        </h2>
        <p class="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
          {{ content.project.resourcesDescription }}
        </p>

        <ul class="mt-8 grid gap-4 sm:grid-cols-2">
          <li
            v-for="resource in content.project.resources"
            :key="resource"
            class="flex items-start gap-3 text-sm leading-6 text-blue-50"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="mt-0.5 size-5 shrink-0 text-emerald-300"
            />
            {{ resource }}
          </li>
        </ul>

        <div class="mt-9 flex flex-wrap gap-3">
          <UButton
            to="https://github.com/rymcu/BigSmart-Open/tree/main/hardware"
            target="_blank"
            :label="content.project.hardwareDirectoryLabel"
            icon="i-simple-icons-github"
            size="lg"
          />
          <UButton
            to="https://github.com/rymcu/BigSmart-Open/tree/main/enclosure"
            target="_blank"
            :label="content.project.enclosureDirectoryLabel"
            icon="i-lucide-box"
            color="neutral"
            variant="outline"
            size="lg"
            class="btn-on-dark-outline"
          />
          <UButton
            :to="docsPath('hardware')"
            :label="content.project.hardwareDocsLabel"
            icon="i-lucide-book-open"
            color="neutral"
            variant="ghost"
            size="lg"
            class="btn-on-dark-ghost"
          />
        </div>
      </div>

      <div class="flex min-h-96 items-center justify-center lg:min-h-[34rem]">
        <img
          :src="publicAsset('/images/landing/mainboard.webp')"
          :alt="content.project.boardImageAlt"
          width="1231"
          height="1400"
          loading="lazy"
          class="max-h-[34rem] w-auto max-w-full object-contain drop-shadow-2xl"
        >
      </div>
    </UContainer>
  </section>

  <section
    id="ecosystem"
    class="py-20 sm:py-24"
  >
    <UContainer>
      <div class="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div>
          <p class="text-sm font-semibold text-primary">
            {{ content.project.upstreamEyebrow }}
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-normal text-highlighted sm:text-4xl">
            {{ content.project.upstreamTitle }}
          </h2>
          <p class="mt-5 text-base leading-7 text-muted">
            {{ content.project.upstreamDescription }}
          </p>
        </div>

        <div class="divide-y divide-default border-y border-default">
          <article
            v-for="upstream in content.project.upstreams"
            :key="upstream.project"
            class="grid gap-5 py-7 sm:grid-cols-[1fr_auto] sm:items-center"
          >
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <UIcon
                  name="i-lucide-git-merge"
                  class="size-5 text-emerald-500"
                />
                <h3 class="font-mono text-base font-semibold text-highlighted">
                  {{ upstream.project }}
                </h3>
                <UBadge
                  :label="content.project.mergedLabel"
                  color="success"
                  variant="subtle"
                />
              </div>
              <p class="mt-3 text-sm leading-6 text-muted">
                {{ upstream.description }}
              </p>
            </div>
            <UButton
              :to="upstream.to"
              target="_blank"
              :label="upstream.pr"
              trailing-icon="i-lucide-external-link"
              color="neutral"
              variant="outline"
            />
          </article>
        </div>
      </div>
    </UContainer>
  </section>
</template>
