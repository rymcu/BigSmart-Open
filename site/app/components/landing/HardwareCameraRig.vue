<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import CameraControlsImpl from 'camera-controls'
import {
  Box3,
  MathUtils,
  Matrix4,
  OrthographicCamera,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Sphere,
  Spherical,
  Vector2,
  Vector3,
  Vector4
} from 'three'

const props = defineProps<{
  compact: boolean
  reducedMotion: boolean
}>()

CameraControlsImpl.install({
  THREE: {
    Box3,
    MathUtils,
    Matrix4,
    Quaternion,
    Raycaster,
    Sphere,
    Spherical,
    Vector2,
    Vector3,
    Vector4
  }
})

const { camera, invalidate, renderer } = useTres()
const instance = shallowRef<CameraControlsImpl | null>(null)
const { onBeforeRender } = useLoop()
const requestRender = () => invalidate()

function applyInputMode(control: CameraControlsImpl) {
  control.minDistance = 0.012
  control.maxDistance = 0.28
  control.smoothTime = props.reducedMotion ? 0.01 : 0.32
  control.draggingSmoothTime = 0.08
  control.dollyToCursor = !props.compact
  renderer.domElement.style.touchAction = props.compact ? 'pan-y' : 'none'

  if (props.compact) {
    control.touches.one = CameraControlsImpl.ACTION.NONE
    control.touches.two = CameraControlsImpl.ACTION.TOUCH_DOLLY_ROTATE
    control.touches.three = CameraControlsImpl.ACTION.NONE
  } else {
    control.touches.one = CameraControlsImpl.ACTION.TOUCH_ROTATE
    control.touches.two = CameraControlsImpl.ACTION.TOUCH_DOLLY_TRUCK
    control.touches.three = CameraControlsImpl.ACTION.TOUCH_TRUCK
  }
}

function disposeControls() {
  if (!instance.value) return
  instance.value.removeEventListener('control', requestRender)
  instance.value.removeEventListener('update', requestRender)
  instance.value.disconnect()
  instance.value.dispose()
  instance.value = null
}

watch(
  camera,
  (activeCamera) => {
    if (!(activeCamera instanceof PerspectiveCamera) && !(activeCamera instanceof OrthographicCamera)) return

    disposeControls()
    const control = new CameraControlsImpl(activeCamera, renderer.domElement)
    applyInputMode(control)
    control.addEventListener('control', requestRender)
    control.addEventListener('update', requestRender)
    instance.value = control
    invalidate()
  },
  { immediate: true, flush: 'post' }
)

watch(
  () => [props.compact, props.reducedMotion] as const,
  () => {
    if (!instance.value) return
    applyInputMode(instance.value)
    invalidate()
  }
)

onBeforeRender(({ delta }) => {
  instance.value?.update(delta)
})

onBeforeUnmount(disposeControls)

async function setLookAt(...args: Parameters<CameraControlsImpl['setLookAt']>) {
  await instance.value?.setLookAt(...args)
}

async function rotate(...args: Parameters<CameraControlsImpl['rotate']>) {
  await instance.value?.rotate(...args)
}

async function dolly(...args: Parameters<CameraControlsImpl['dolly']>) {
  await instance.value?.dolly(...args)
}

defineExpose({
  dolly,
  rotate,
  setLookAt
})
</script>

<template>
  <slot />
</template>
