<script setup lang="ts">
const { content } = useLandingContent()
</script>

<template>
  <section
    class="border-y border-default bg-elevated"
    :aria-label="content.proof.ariaLabel"
  >
    <UContainer class="grid grid-cols-2 px-0 lg:grid-cols-4">
      <div
        v-for="fact in content.proof.facts"
        :key="fact.value"
        class="border-default px-5 py-6 odd:border-r lg:border-r lg:last:border-r-0"
      >
        <p class="text-xl font-bold tracking-normal text-highlighted">
          {{ fact.value }}
        </p>
        <p class="mt-1 text-sm leading-5 text-muted">
          {{ fact.label }}
        </p>
      </div>
    </UContainer>
  </section>
</template>
