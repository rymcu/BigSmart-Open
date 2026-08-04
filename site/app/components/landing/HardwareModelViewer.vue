<script setup lang="ts">
import { useIntersectionObserver, useMediaQuery } from '@vueuse/core'

interface SceneExpose {
  resetView: () => Promise<void>
  rotateView: (direction: -1 | 1) => Promise<void>
  zoomView: (direction: -1 | 1) => Promise<void>
}

const HardwareModelScene = defineAsyncComponent(
  () => import('./HardwareModelScene.client.vue')
)

const publicAsset = usePublicAsset()
const colorMode = useColorMode()
const { content } = useLandingContent()

const root = useTemplateRef<HTMLElement>('root')
const stageWrap = useTemplateRef<HTMLElement>('stageWrap')
const scene = useTemplateRef<SceneExpose>('scene')
const activeId = ref('overview')
const shouldLoad = ref(false)
const sceneReady = ref(false)
const sceneError = ref(false)
const sceneKey = ref(0)
const webglSupported = ref(true)

const compact = useMediaQuery('(max-width: 1023px)')
const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

const explorer = computed(() => content.value.hardware.explorer)
const components = computed(() => explorer.value.components)
const selectedComponent = computed(() => components.value.find(item => item.id === activeId.value))
const activeRef = computed(() => selectedComponent.value?.ref ?? null)
const selectedDetails = computed(() => selectedComponent.value ?? explorer.value.overview)
const clearColor = computed(() => colorMode.value === 'dark' ? '#11161a' : '#edf1f2')
const modelUrl = publicAsset('/models/bigsmart-mainboard.glb')
const fallbackImage = computed(() => publicAsset(content.value.hardware.imageSrc))
const fallbackAlt = computed(() => content.value.hardware.imageAlt)

const selectItems = computed(() => [
  {
    label: explorer.value.overview.name,
    value: 'overview'
  },
  ...components.value.map(component => ({
    label: `${component.ref} · ${component.name}`,
    value: component.id
  }))
])

const statusText = computed(() => {
  if (sceneError.value || !webglSupported.value) return explorer.value.error
  if (sceneReady.value) return explorer.value.status
  return explorer.value.loading
})

const intersection = useIntersectionObserver(
  root,
  ([entry]) => {
    if (!entry?.isIntersecting) return
    shouldLoad.value = true
    intersection.stop()
  },
  { rootMargin: '480px 0px' }
)

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function handleReady(missingRefs: string[]) {
  if (missingRefs.length > 0) {
    handleError()
    return
  }

  sceneReady.value = true
  sceneError.value = false
}

function handleError() {
  sceneReady.value = false
  sceneError.value = true
}

function retryModel() {
  sceneReady.value = false
  sceneError.value = false
  sceneKey.value += 1
  shouldLoad.value = true
}

function selectComponent(id: string) {
  if (id === 'overview' || components.value.some(component => component.id === id)) {
    activeId.value = id
  }
}

// On compact layouts the canvas sits above the controls, so bring it back
// into view whenever the selection changes to keep the 3D feedback visible.
watch(activeId, () => {
  if (!compact.value) return
  stageWrap.value?.scrollIntoView({
    behavior: reducedMotion.value ? 'auto' : 'smooth',
    block: 'nearest'
  })
})

function resetView() {
  activeId.value = 'overview'
  void nextTick(() => scene.value?.resetView())
}

function rotateView(direction: -1 | 1) {
  void scene.value?.rotateView(direction)
}

function zoomView(direction: -1 | 1) {
  void scene.value?.zoomView(direction)
}

onMounted(() => {
  webglSupported.value = supportsWebGL()
  if (!intersection.isSupported.value) shouldLoad.value = true
})
</script>

<template>
  <div
    ref="root"
    class="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_25rem]"
  >
    <div
      ref="stageWrap"
      class="relative h-[clamp(25rem,62svh,34rem)] min-w-0 overflow-hidden lg:h-[clamp(34rem,64vh,44rem)]"
    >
      <NuxtImg
        v-if="!sceneReady"
        :src="fallbackImage"
        :alt="fallbackAlt"
        width="1600"
        height="900"
        sizes="100vw lg:70vw"
        loading="lazy"
        class="absolute inset-0 size-full object-contain p-4 sm:p-8 lg:p-10"
      />

      <component
        :is="HardwareModelScene"
        v-if="shouldLoad && webglSupported && !sceneError"
        :key="sceneKey"
        ref="scene"
        :model-url="modelUrl"
        :active-ref="activeRef"
        :components="components"
        :clear-color="clearColor"
        :compact="compact"
        :reduced-motion="reducedMotion"
        class="absolute inset-0 transition-opacity duration-300"
        :class="sceneReady ? 'opacity-100' : 'pointer-events-none opacity-0'"
        @ready="handleReady"
        @error="handleError"
        @select="selectComponent"
      />

      <div
        v-if="!sceneReady && !sceneError && webglSupported"
        class="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center"
        role="status"
      >
        <span class="inline-flex items-center gap-2 rounded-md border border-default bg-default/90 px-3 py-2 text-sm font-medium text-muted shadow-sm">
          <UIcon
            name="i-lucide-loader-circle"
            class="size-4 animate-spin"
          />
          {{ explorer.loading }}
        </span>
      </div>

      <div
        v-if="sceneError || !webglSupported"
        class="absolute inset-x-4 bottom-5 flex flex-wrap items-center justify-between gap-3 border border-default bg-default/95 px-4 py-3 shadow-sm sm:inset-x-5"
        role="alert"
      >
        <p class="text-sm font-medium text-highlighted">
          {{ explorer.error }}
        </p>
        <UButton
          :label="explorer.retry"
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="sm"
          :disabled="!webglSupported"
          @click="retryModel"
        />
      </div>

      <p
        v-if="sceneReady"
        class="absolute bottom-3 left-3 rounded-md border border-default bg-default/92 px-2.5 py-1.5 text-xs text-muted lg:hidden"
      >
        {{ explorer.gestureHint }}
      </p>

      <div
        v-if="sceneReady"
        class="absolute right-3 top-3 flex h-10 items-center gap-0.5 rounded-md border border-default bg-default/92 p-1 shadow-sm sm:right-4 sm:top-4"
      >
        <UTooltip :text="explorer.controls.reset">
          <UButton
            icon="i-lucide-scan"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="explorer.controls.reset"
            @click="resetView"
          />
        </UTooltip>
        <UTooltip :text="explorer.controls.rotateLeft">
          <UButton
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="explorer.controls.rotateLeft"
            @click="rotateView(-1)"
          />
        </UTooltip>
        <UTooltip :text="explorer.controls.rotateRight">
          <UButton
            icon="i-lucide-rotate-cw"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="explorer.controls.rotateRight"
            @click="rotateView(1)"
          />
        </UTooltip>
        <UTooltip :text="explorer.controls.zoomIn">
          <UButton
            icon="i-lucide-zoom-in"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="explorer.controls.zoomIn"
            @click="zoomView(1)"
          />
        </UTooltip>
        <UTooltip :text="explorer.controls.zoomOut">
          <UButton
            icon="i-lucide-zoom-out"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="explorer.controls.zoomOut"
            @click="zoomView(-1)"
          />
        </UTooltip>
      </div>
    </div>

    <aside class="min-w-0 border-t border-default px-5 py-6 sm:px-7 lg:h-[clamp(34rem,64vh,44rem)] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-7 lg:py-8">
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-base font-semibold text-highlighted">
          {{ explorer.title }}
        </h3>
        <UTooltip :text="statusText">
          <span
            class="size-2 shrink-0 rounded-full"
            :class="sceneReady ? 'bg-success' : sceneError ? 'bg-error' : 'bg-warning'"
            aria-hidden="true"
          />
        </UTooltip>
      </div>

      <p
        class="sr-only"
        aria-live="polite"
      >
        {{ statusText }}
      </p>

      <USelect
        v-model="activeId"
        :items="selectItems"
        value-key="value"
        :aria-label="explorer.componentSelectAria"
        class="mt-5 w-full lg:hidden"
      />

      <nav
        :aria-label="explorer.componentSelectAria"
        class="mt-5 hidden lg:block"
      >
        <button
          type="button"
          class="flex min-h-11 w-full items-center justify-between gap-4 border-b border-default px-2 py-2.5 text-left transition-colors focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
          :class="activeId === 'overview' ? 'bg-elevated text-highlighted' : 'text-muted hover:bg-elevated/60 hover:text-highlighted'"
          :aria-pressed="activeId === 'overview'"
          @click="selectComponent('overview')"
        >
          <span class="text-sm font-medium">{{ explorer.overview.name }}</span>
          <UIcon
            name="i-lucide-circuit-board"
            class="size-4 shrink-0"
          />
        </button>

        <button
          v-for="componentItem in components"
          :key="componentItem.id"
          type="button"
          class="grid min-h-11 w-full grid-cols-[3.5rem_minmax(0,1fr)] items-center border-b border-default px-2 py-2.5 text-left transition-colors focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
          :class="activeId === componentItem.id ? 'bg-elevated text-highlighted' : 'text-muted hover:bg-elevated/60 hover:text-highlighted'"
          :aria-pressed="activeId === componentItem.id"
          @click="selectComponent(componentItem.id)"
        >
          <code class="text-xs font-semibold text-primary">{{ componentItem.ref }}</code>
          <span class="truncate text-sm font-medium">{{ componentItem.name }}</span>
        </button>
      </nav>

      <section
        class="mt-6 border-t border-default pt-5"
        aria-live="polite"
      >
        <div class="flex min-w-0 items-baseline gap-3">
          <code
            v-if="selectedComponent"
            class="shrink-0 text-xs font-semibold text-primary"
          >{{ selectedComponent.ref }}</code>
          <h4 class="min-w-0 text-lg font-semibold text-highlighted">
            {{ selectedDetails.name }}
          </h4>
        </div>

        <dl class="mt-4 divide-y divide-default">
          <div class="grid gap-1 py-3 sm:grid-cols-[6rem_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[6rem_minmax(0,1fr)]">
            <dt class="text-xs font-medium uppercase text-dimmed">
              {{ explorer.fields.model }}
            </dt>
            <dd class="min-w-0 text-sm font-medium text-highlighted [overflow-wrap:anywhere]">
              {{ selectedDetails.model }}
            </dd>
          </div>
          <div class="grid gap-1 py-3 sm:grid-cols-[6rem_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[6rem_minmax(0,1fr)]">
            <dt class="text-xs font-medium uppercase text-dimmed">
              {{ explorer.fields.role }}
            </dt>
            <dd class="min-w-0 text-sm leading-6 text-muted">
              {{ selectedDetails.role }}
            </dd>
          </div>
          <div class="grid gap-1 py-3 sm:grid-cols-[6rem_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[6rem_minmax(0,1fr)]">
            <dt class="text-xs font-medium uppercase text-dimmed">
              {{ explorer.fields.interface }}
            </dt>
            <dd class="min-w-0 text-sm leading-6 text-muted [overflow-wrap:anywhere]">
              {{ selectedDetails.interface }}
            </dd>
          </div>
        </dl>
      </section>
    </aside>
  </div>
</template>
