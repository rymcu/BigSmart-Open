import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Accessor, Document, NodeIO } from '@gltf-transform/core'
import { dedup, getBounds, meshopt, prune, weld } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import occtImport from 'occt-import-js'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const SITE_DIR = path.resolve(SCRIPT_DIR, '..')
const REPOSITORY_DIR = path.resolve(SITE_DIR, '..')

const DEFAULT_INPUT = path.join(REPOSITORY_DIR, 'enclosure', '3D_BigSmart_2026-01-15.step')
const DEFAULT_OUTPUT = path.join(SITE_DIR, 'public', 'models', 'bigsmart-mainboard.glb')
const REQUIRED_REFS = ['U1', 'U3', 'U6', 'U9', 'U10', 'U14', 'USB1']
const SCALE_MILLIMETERS_TO_METERS = 0.001
const functionsRequire = createRequire(import.meta.resolve('@gltf-transform/functions'))
const { ALL_EXTENSIONS } = functionsRequire('@gltf-transform/extensions')

const inputPath = path.resolve(process.argv[2] || DEFAULT_INPUT)
const outputPath = path.resolve(process.argv[3] || DEFAULT_OUTPUT)
const metadataPath = path.resolve(
  process.argv[4] || path.join(path.dirname(outputPath), `${path.parse(outputPath).name}.json`)
)

function parseReference(name) {
  return /^(USB\d+|FPC\d+|[A-Z]{1,4}\d+)(?:~|$)/.exec(name || '')?.[1] || null
}

function clampColor(color) {
  const fallback = [0.62, 0.64, 0.66]
  if (!Array.isArray(color) || color.length < 3)
    return fallback

  return color.slice(0, 3).map(value => Math.min(1, Math.max(0, Number(value))))
}

function colorKey(color) {
  return color.map(value => value.toFixed(5)).join(',')
}

function createBounds() {
  return {
    min: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    max: [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
  }
}

function includePositions(bounds, positions) {
  for (let index = 0; index < positions.length; index += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      const value = positions[index + axis]
      bounds.min[axis] = Math.min(bounds.min[axis], value)
      bounds.max[axis] = Math.max(bounds.max[axis], value)
    }
  }
}

function finishBounds(bounds) {
  if (!Number.isFinite(bounds.min[0]))
    throw new Error('Cannot calculate a bounding box for an empty component')

  const size = bounds.max.map((value, axis) => value - bounds.min[axis])
  const center = bounds.min.map((value, axis) => (value + bounds.max[axis]) / 2)

  return {
    min: bounds.min.map(roundMillimeters),
    max: bounds.max.map(roundMillimeters),
    size: size.map(roundMillimeters),
    center: center.map(roundMillimeters)
  }
}

function roundMillimeters(value) {
  return Math.round(value * 1000) / 1000
}

function collectMeshIndices(node, target = new Set()) {
  for (const meshIndex of node.meshes || [])
    target.add(meshIndex)

  for (const child of node.children || [])
    collectMeshIndices(child, target)

  return target
}

function calculateNodeBounds(node, sourceMeshes) {
  const bounds = createBounds()
  for (const meshIndex of collectMeshIndices(node)) {
    const positions = sourceMeshes[meshIndex]?.attributes?.position?.array
    if (positions)
      includePositions(bounds, positions)
  }
  return finishBounds(bounds)
}

function createPrimitiveGroups(sourceMesh) {
  const sourceIndices = Uint32Array.from(sourceMesh.index.array)
  const defaultColor = clampColor(sourceMesh.color)
  const groups = new Map()

  const addRange = (color, start, end) => {
    if (end <= start)
      return

    const normalizedColor = clampColor(color || defaultColor)
    const key = colorKey(normalizedColor)
    let group = groups.get(key)
    if (!group) {
      group = { color: normalizedColor, ranges: [], length: 0 }
      groups.set(key, group)
    }
    group.ranges.push([start, end])
    group.length += end - start
  }

  if (sourceMesh.brep_faces?.length) {
    for (const face of sourceMesh.brep_faces) {
      const start = Math.max(0, face.first * 3)
      const end = Math.min(sourceIndices.length, (face.last + 1) * 3)
      addRange(face.color, start, end)
    }
  } else {
    addRange(defaultColor, 0, sourceIndices.length)
  }

  if (groups.size === 0)
    addRange(defaultColor, 0, sourceIndices.length)

  return [...groups.values()].map((group) => {
    const indices = new Uint32Array(group.length)
    let offset = 0
    for (const [start, end] of group.ranges) {
      const range = sourceIndices.subarray(start, end)
      indices.set(range, offset)
      offset += range.length
    }
    return { color: group.color, indices }
  })
}

function readGlbJson(glb) {
  if (glb.readUInt32LE(0) !== 0x46546C67)
    throw new Error('Generated file is not a binary glTF file')

  const jsonLength = glb.readUInt32LE(12)
  const jsonType = glb.readUInt32LE(16)
  if (jsonType !== 0x4E4F534A)
    throw new Error('Generated GLB has no JSON chunk')

  return JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8').trimEnd())
}

function verifyRequiredNodes(glbJson) {
  if (!glbJson.extensionsRequired?.includes('EXT_meshopt_compression'))
    throw new Error('Generated GLB is missing required Meshopt compression')

  const nodeNames = new Set((glbJson.nodes || []).map(node => node.name))
  const missing = REQUIRED_REFS.filter(reference => !nodeNames.has(reference))
  if (missing.length > 0)
    throw new Error(`Generated GLB is missing required nodes: ${missing.join(', ')}`)

  return REQUIRED_REFS.map(reference => ({
    name: reference,
    verified: true
  }))
}

function boundsFromMeters(bounds) {
  return finishBounds({
    min: Array.from(bounds.min, value => value / SCALE_MILLIMETERS_TO_METERS),
    max: Array.from(bounds.max, value => value / SCALE_MILLIMETERS_TO_METERS)
  })
}

async function inspectCompressedOutput(filePath) {
  await MeshoptDecoder.ready
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'meshopt.decoder': MeshoptDecoder
    })
  const document = await io.read(filePath)
  const root = document.getRoot()
  const scenes = root.listScenes()
  if (scenes.length !== 1)
    throw new Error(`Expected one scene in generated GLB, found ${scenes.length}`)

  const components = {}
  for (const reference of REQUIRED_REFS) {
    const matchingNodes = root.listNodes().filter(node => node.getName() === reference)
    if (matchingNodes.length !== 1) {
      throw new Error(
        `Expected one ${reference} node in generated GLB, found ${matchingNodes.length}`
      )
    }
    components[reference] = boundsFromMeters(getBounds(matchingNodes[0]))
  }

  return {
    model: boundsFromMeters(getBounds(scenes[0])),
    components,
    nodeCount: root.listNodes().length,
    meshCount: root.listMeshes().length
  }
}

async function main() {
  const input = await fs.readFile(inputPath)
  const occt = await occtImport()
  const step = occt.ReadStepFile(input, {
    linearUnit: 'millimeter',
    linearDeflectionType: 'absolute_value',
    linearDeflection: 0.12,
    angularDeflection: 0.35
  })

  if (!step.success)
    throw new Error(`OpenCascade could not import ${inputPath}`)

  const document = new Document()
  const buffer = document.createBuffer('geometry')
  const scene = document.createScene('BigSmart mainboard')
  const materials = new Map()
  const sourceNodeByReference = new Map()
  const gltfNodeByReference = new Map()
  const usedNodeNames = new Map()

  const getMaterial = (color) => {
    const key = colorKey(color)
    let material = materials.get(key)
    if (!material) {
      material = document
        .createMaterial(`material-${key}`)
        .setBaseColorFactor([...color, 1])
        .setMetallicFactor(0.05)
        .setRoughnessFactor(0.68)
        .setDoubleSided(true)
      materials.set(key, material)
    }
    return material
  }

  const gltfMeshes = step.meshes.map((sourceMesh, meshIndex) => {
    const positions = Float32Array.from(
      sourceMesh.attributes.position.array,
      value => value * SCALE_MILLIMETERS_TO_METERS
    )
    const normals = sourceMesh.attributes.normal
      ? Float32Array.from(sourceMesh.attributes.normal.array)
      : null

    const positionAccessor = document
      .createAccessor(`position-${meshIndex}`)
      .setType(Accessor.Type.VEC3)
      .setArray(positions)
      .setBuffer(buffer)
    const normalAccessor = normals
      ? document
          .createAccessor(`normal-${meshIndex}`)
          .setType(Accessor.Type.VEC3)
          .setArray(normals)
          .setBuffer(buffer)
      : null
    const mesh = document.createMesh(sourceMesh.name || `mesh-${meshIndex}`)

    for (const [groupIndex, group] of createPrimitiveGroups(sourceMesh).entries()) {
      const primitive = document
        .createPrimitive(`${sourceMesh.name || `mesh-${meshIndex}`}:${groupIndex}`)
        .setAttribute('POSITION', positionAccessor)
        .setIndices(
          document
            .createAccessor(`indices-${meshIndex}-${groupIndex}`)
            .setType(Accessor.Type.SCALAR)
            .setArray(group.indices)
            .setBuffer(buffer)
        )
        .setMaterial(getMaterial(group.color))

      if (normalAccessor)
        primitive.setAttribute('NORMAL', normalAccessor)

      mesh.addPrimitive(primitive)
    }

    return mesh
  })

  const uniqueNodeName = (preferred) => {
    const base = preferred || 'part'
    const count = usedNodeNames.get(base) || 0
    usedNodeNames.set(base, count + 1)
    return count === 0 ? base : `${base}:${count + 1}`
  }

  const buildNode = (sourceNode, parent) => {
    const reference = parseReference(sourceNode.name)
    const nodeName = uniqueNodeName(reference || sourceNode.name || 'part')
    const node = document.createNode(nodeName).setExtras({
      reference,
      stepName: sourceNode.name || ''
    })
    parent.addChild(node)

    if (reference && !sourceNodeByReference.has(reference)) {
      sourceNodeByReference.set(reference, sourceNode)
      gltfNodeByReference.set(reference, node)
    }

    const meshIndices = sourceNode.meshes || []
    if (meshIndices.length === 1) {
      node.setMesh(gltfMeshes[meshIndices[0]])
    } else {
      for (const meshIndex of meshIndices) {
        node.addChild(
          document
            .createNode(uniqueNodeName(`${nodeName}:mesh-${meshIndex}`))
            .setMesh(gltfMeshes[meshIndex])
        )
      }
    }

    for (const child of sourceNode.children || [])
      buildNode(child, node)
  }

  buildNode(step.root, scene)

  for (const reference of REQUIRED_REFS) {
    const sourceNode = sourceNodeByReference.get(reference)
    const gltfNode = gltfNodeByReference.get(reference)
    if (!sourceNode || !gltfNode)
      throw new Error(`STEP hierarchy is missing required node ${reference}`)

    const bounds = calculateNodeBounds(sourceNode, step.meshes)
    gltfNode.setExtras({
      ...gltfNode.getExtras(),
      bboxMillimeters: {
        min: bounds.min,
        max: bounds.max,
        size: bounds.size
      },
      centerMillimeters: bounds.center
    })
  }

  await MeshoptEncoder.ready
  await document.transform(
    dedup(),
    weld(),
    prune(),
    meshopt({
      encoder: MeshoptEncoder,
      level: 'high',
      quantizePosition: 14,
      quantizeNormal: 10
    })
  )

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'meshopt.encoder': MeshoptEncoder
    })
  await io.write(outputPath, document)

  const glb = await fs.readFile(outputPath)
  const glbJson = readGlbJson(glb)
  const verifiedNodes = verifyRequiredNodes(glbJson)
  const decoded = await inspectCompressedOutput(outputPath)
  const sourceStat = await fs.stat(inputPath)
  const metadata = {
    schemaVersion: 1,
    unit: 'millimeter',
    source: {
      file: path.basename(inputPath),
      sizeBytes: sourceStat.size
    },
    output: {
      file: path.basename(outputPath),
      sizeBytes: glb.byteLength,
      meshCount: decoded.meshCount,
      materialCount: materials.size,
      compression: 'EXT_meshopt_compression',
      extensionsRequired: glbJson.extensionsRequired
    },
    tessellation: {
      linearDeflectionType: 'absolute_value',
      linearDeflection: 0.12,
      angularDeflection: 0.35
    },
    model: decoded.model,
    components: decoded.components,
    verification: {
      requiredNodes: verifiedNodes,
      decodedNodeCount: decoded.nodeCount,
      decodedMeshCount: decoded.meshCount
    }
  }

  await fs.writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`)
  console.log(JSON.stringify(metadata, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
