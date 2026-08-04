<script setup lang="ts">
import { Edges, Html } from '@tresjs/cientos'
import { TresCanvas, type TresPointerEvent } from '@tresjs/core'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'
import {
  Box3,
  Mesh,
  Sphere,
  Vector3
} from 'three'
import type { Group, Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'meshoptimizer'
import HardwareCameraRig from './HardwareCameraRig.vue'

interface HardwareComponent {
  id: string
  ref: string
  name: string
}

interface Hotspot extends HardwareComponent {
  center: Vector3
  position: Vector3
  size: Vector3
}

interface ControlsApi {
  setLookAt: (
    positionX: number,
    positionY: number,
    positionZ: number,
    targetX: number,
    targetY: number,
    targetZ: number,
    enableTransition?: boolean
  ) => Promise<void>
  rotate: (azimuthAngle: number, polarAngle: number, enableTransition?: boolean) => Promise<void>
  dolly: (distance: number, enableTransition?: boolean) => Promise<void>
}

interface CanvasExpose {
  context?: {
    renderer: {
      invalidate: (frames?: number) => void
    }
  }
}

interface HtmlExpose {
  instance: Object3D | null
}

const props = defineProps<{
  modelUrl: string
  activeRef: string | null
  components: readonly HardwareComponent[]
  clearColor: string
  compact: boolean
  reducedMotion: boolean
}>()

const emit = defineEmits<{
  ready: [missingRefs: string[]]
  error: [message: string]
  select: [id: string]
}>()

const stage = useTemplateRef<HTMLElement>('stage')
const canvas = useTemplateRef<CanvasExpose>('canvas')
const controls = useTemplateRef<ControlsApi>('controls')
const activeLabel = useTemplateRef<HtmlExpose>('active-label')
const selection = useTemplateRef<Mesh>('selection')
const model = shallowRef<Group | null>(null)
const hotspots = shallowRef<Hotspot[]>([])
let canvasElement: HTMLCanvasElement | null = null
let disposed = false

const activeHotspot = computed(() => {
  if (!props.activeRef) return null
  return hotspots.value.find(hotspot => hotspot.ref === props.activeRef) ?? null
})

const focusDirections: Record<string, [number, number, number]> = {
  USB1: [-0.35, 0.82, 0.52],
  U6: [0.15, 0.35, 0.93],
  U14: [0.62, -0.28, 0.73]
}
const initialCameraPosition = new Vector3(0.09, -0.035, 0.12)
const keyLightPosition = new Vector3(0.08, -0.025, 0.14)
const fillLightPosition = new Vector3(-0.04, 0.09, 0.07)

function getControls() {
  return controls.value
}

function invalidate(frames = 2) {
  canvas.value?.context?.renderer.invalidate(frames)
}

function getHotspot(ref: string) {
  return hotspots.value.find(hotspot => hotspot.ref === ref) ?? null
}

function clearHighlight() {
  if (selection.value) toRaw(selection.value).visible = false
  invalidate(3)
}

function syncActiveLabel() {
  const hotspot = activeHotspot.value
  const label = activeLabel.value?.instance
    ? toRaw(activeLabel.value.instance)
    : null
  if (!hotspot || !label) return

  label.position.copy(hotspot.position)
  label.updateMatrixWorld(true)
  invalidate(3)
}

function highlightNode(ref: string | null) {
  if (!ref) return

  const hotspot = getHotspot(ref)
  if (!hotspot) return

  const highlight = selection.value ? toRaw(selection.value) : null
  if (!highlight) return

  highlight.position.copy(hotspot.center)
  highlight.scale.copy(hotspot.size).addScalar(0.0016)
  highlight.visible = true
  invalidate(3)
}

async function focusOverview(animate = true) {
  const scene = model.value
  const controller = getControls()
  if (!scene || !controller) return

  const box = new Box3().setFromObject(scene)
  const sphere = box.getBoundingSphere(new Sphere())
  const center = sphere.center
  const bounds = stage.value?.getBoundingClientRect()
  const aspect = bounds && bounds.height > 0 ? bounds.width / bounds.height : 1
  const verticalFov = 36 * Math.PI / 180
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(aspect, 0.35))
  const limitingFov = Math.min(verticalFov, horizontalFov)
  const distance = Math.max(sphere.radius / Math.sin(limitingFov / 2) * 1.16, 0.08)
  const direction = new Vector3(0.48, -0.62, 1).normalize()
  const position = center.clone().addScaledVector(direction, distance)

  invalidate(3)
  await controller.setLookAt(
    position.x,
    position.y,
    position.z,
    center.x,
    center.y,
    center.z,
    animate && !props.reducedMotion
  )
}

async function focusComponent(ref: string, animate = true) {
  const hotspot = getHotspot(ref)
  const controller = getControls()
  if (!hotspot || !controller) return

  const center = hotspot.center
  const size = hotspot.size
  const maxDimension = Math.max(size.x, size.y, size.z)
  const minimumDistance = ref === 'U1' ? 0.052 : ref === 'U6' || ref === 'USB1' ? 0.038 : 0.026
  const distance = Math.max(maxDimension * 3.8, minimumDistance)
  const direction = new Vector3(...(focusDirections[ref] ?? [0.45, -0.52, 0.78])).normalize()
  const position = center.clone().addScaledVector(direction, distance)

  invalidate(3)
  await controller.setLookAt(
    position.x,
    position.y,
    position.z,
    center.x,
    center.y,
    center.z,
    animate && !props.reducedMotion
  )
}

async function syncSelection(animate = true) {
  clearHighlight()
  await nextTick()
  syncActiveLabel()
  highlightNode(props.activeRef)
  if (props.activeRef) {
    await focusComponent(props.activeRef, animate)
  } else {
    await focusOverview(animate)
  }
}

function findComponentId(object: TresPointerEvent['object']) {
  let current: Object3D | null = object

  while (current && current !== model.value) {
    const ref = typeof current.userData.reference === 'string'
      ? current.userData.reference
      : current.name
    const component = props.components.find(item => item.ref === ref)
    if (component) return component.id
    current = current.parent
  }

  return null
}

function selectModelComponent(event: TresPointerEvent) {
  const id = findComponentId(event.object)
  if (!id) return
  event.stopPropagation()
  emit('select', id)
}

function selectHotspot(id: string, event: TresPointerEvent) {
  event.stopPropagation()
  emit('select', id)
}

function handleContextLost(event: Event) {
  event.preventDefault()
  emit('error', 'webgl-context-lost')
}

async function handleCanvasReady() {
  await nextTick()
  canvasElement = stage.value?.querySelector('canvas') ?? null
  canvasElement?.addEventListener('webglcontextlost', handleContextLost)
}

async function loadModel() {
  try {
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    const gltf = await loader.loadAsync(props.modelUrl)
    if (disposed) return

    gltf.scene.updateMatrixWorld(true)
    model.value = gltf.scene

    const missingRefs: string[] = []
    hotspots.value = props.components.flatMap((component) => {
      const node = gltf.scene.getObjectByName(component.ref)
      if (!node) {
        missingRefs.push(component.ref)
        return []
      }

      const box = new Box3().setFromObject(node)
      const center = box.getCenter(new Vector3())
      const size = box.getSize(new Vector3())
      const top = box.max.z + 0.0022
      return [{
        ...component,
        center,
        position: new Vector3(center.x, center.y, top),
        size
      }]
    })

    await nextTick()
    await syncSelection(false)
    emit('ready', missingRefs)
  } catch (error) {
    emit('error', error instanceof Error ? error.message : 'model-load-failed')
  }
}

async function resetView() {
  clearHighlight()
  await focusOverview(true)
}

async function rotateView(direction: -1 | 1) {
  invalidate(3)
  await getControls()?.rotate(direction * Math.PI / 10, 0, !props.reducedMotion)
}

async function zoomView(direction: -1 | 1) {
  invalidate(3)
  await getControls()?.dolly(direction * 0.012, !props.reducedMotion)
}

const refitOnResize = useDebounceFn(() => {
  if (!model.value) return

  if (props.activeRef) {
    void focusComponent(props.activeRef, false)
  } else {
    void focusOverview(false)
  }
}, 120)

useResizeObserver(stage, refitOnResize)

watch(
  () => props.activeRef,
  () => {
    if (model.value) void syncSelection(false)
  }
)

onMounted(() => {
  void loadModel()
})

onBeforeUnmount(() => {
  disposed = true
  canvasElement?.removeEventListener('webglcontextlost', handleContextLost)
  clearHighlight()

  model.value?.traverse((object) => {
    if (!(object instanceof Mesh)) return
    object.geometry.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.forEach(material => material.dispose())
  })
})

defineExpose({
  resetView,
  rotateView,
  zoomView
})
</script>

<template>
  <div
    ref="stage"
    class="hardware-model-stage h-full w-full"
    :data-compact="compact || undefined"
  >
    <TresCanvas
      ref="canvas"
      :clear-color="clearColor"
      :dpr="compact ? [1, 1.25] : [1, 1.75]"
      :antialias="!compact"
      render-mode="on-demand"
      :tone-mapping-exposure="1.08"
      @ready="handleCanvasReady"
      @error="emit('error', $event.message)"
    >
      <TresPerspectiveCamera
        :position="initialCameraPosition"
        :fov="36"
        :near="0.001"
        :far="2"
        make-default
      />

      <HardwareCameraRig
        ref="controls"
        :compact="compact"
        :reduced-motion="reducedMotion"
      />

      <TresHemisphereLight
        :args="['#ffffff', '#74808c', 2.1]"
      />
      <TresDirectionalLight
        :position="keyLightPosition"
        :intensity="3.4"
      />
      <TresDirectionalLight
        :position="fillLightPosition"
        :intensity="1.4"
      />

      <primitive
        v-if="model"
        :object="model"
        @click="selectModelComponent"
      />

      <TresMesh
        ref="selection"
        :render-order="19"
        :visible="false"
      >
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshBasicMaterial
          color="#f59e0b"
          :depth-test="false"
          :depth-write="false"
          transparent
          :opacity="0.2"
        />
        <Edges color="#f59e0b" />
      </TresMesh>

      <template v-if="activeHotspot">
        <TresMesh
          :key="`active-ring-${activeHotspot.id}`"
          :position="activeHotspot.position"
          :render-order="18"
          @click="selectHotspot(activeHotspot.id, $event)"
        >
          <TresRingGeometry :args="[0.0014, 0.0022, 32]" />
          <TresMeshBasicMaterial
            color="#f59e0b"
            :depth-test="false"
            :depth-write="false"
            transparent
            :opacity="0.94"
          />
        </TresMesh>

        <Html
          :key="`active-label-${activeHotspot.id}`"
          ref="active-label"
          :position="activeHotspot.position"
          center
          :z-index-range="[30, 10]"
          pointer-events="auto"
        >
          <button
            type="button"
            class="hardware-hotspot hardware-hotspot--active"
            :aria-label="`${activeHotspot.ref} ${activeHotspot.name}`"
            :aria-pressed="true"
            @click.stop="emit('select', activeHotspot.id)"
          >
            {{ activeHotspot.ref }}
          </button>
        </Html>
      </template>

      <template v-else>
        <template
          v-for="hotspot in hotspots"
          :key="hotspot.id"
        >
          <TresMesh
            :position="hotspot.position"
            :render-order="18"
            @click="selectHotspot(hotspot.id, $event)"
          >
            <TresRingGeometry :args="[0.0011, 0.0018, 32]" />
            <TresMeshBasicMaterial
              color="#161a1d"
              :depth-test="false"
              :depth-write="false"
              transparent
              :opacity="0.94"
            />
          </TresMesh>

          <Html
            :position="hotspot.position"
            center
            :z-index-range="[30, 10]"
            pointer-events="auto"
          >
            <button
              type="button"
              class="hardware-hotspot"
              :aria-label="`${hotspot.ref} ${hotspot.name}`"
              :aria-pressed="false"
              @click.stop="emit('select', hotspot.id)"
            >
              {{ hotspot.ref }}
            </button>
          </Html>
        </template>
      </template>
    </TresCanvas>
  </div>
</template>

<style scoped>
.hardware-model-stage :deep(canvas) {
  cursor: grab;
  outline: none;
  touch-action: none;
}

.hardware-model-stage :deep(canvas:active) {
  cursor: grabbing;
}

.hardware-model-stage[data-compact] :deep(canvas) {
  touch-action: pan-y !important;
}

.hardware-hotspot {
  min-width: 2rem;
  height: 1.5rem;
  border: 1px solid rgb(255 255 255 / 72%);
  border-radius: 4px;
  background: rgb(22 26 29 / 88%);
  box-shadow: 0 3px 10px rgb(0 0 0 / 24%);
  color: white;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  white-space: nowrap;
}

.hardware-hotspot:hover,
.hardware-hotspot:focus-visible,
.hardware-hotspot--active {
  border-color: #fbbf24;
  background: #b45309;
  outline: none;
}
</style>
