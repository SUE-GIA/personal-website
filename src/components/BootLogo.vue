<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json'

const props = defineProps({
  accentColor: { type: Number, default: 0xdca03c },
  dimColor: { type: Number, default: 0x7a4a10 },
  bgColor: { type: Number, default: 0x0c0804 },
})

const emit = defineEmits(['done'])
const canvasRef = ref(null)
const progress = ref(0)

const WIRE_IN = 350
const CROSSFADE = 250
const HOLD = 600
const FADE_OUT = 300
const TOTAL = WIRE_IN + CROSSFADE + HOLD + FADE_OUT

const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const norm = (v, lo, hi) => clamp((v - lo) / (hi - lo), 0, 1)

let animId = null

onMounted(() => {
  const canvas = canvasRef.value
  const w = window.innerWidth
  const h = window.innerHeight

  const accent = new THREE.Color(props.accentColor)
  const dim = new THREE.Color(props.dimColor)
  const bg = new THREE.Color(props.bgColor)

  const scene = new THREE.Scene()
  scene.background = bg

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.z = 6

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 1.2

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.4, 0.2))

  const font = new FontLoader().parse(fontJson)
  const geo = new TextGeometry('SG', {
    font,
    size: 1.4,
    depth: 0.28,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.025,
    bevelSegments: 5,
  })

  geo.computeBoundingBox()
  const bb = geo.boundingBox
  geo.translate(
    -(bb.max.x - bb.min.x) / 2,
    -(bb.max.y - bb.min.y) / 2,
    -(bb.max.z - bb.min.z) / 2,
  )

  const wireMat = new THREE.LineBasicMaterial({ color: dim, transparent: true, opacity: 0 })
  const wireObj = new THREE.LineSegments(new THREE.WireframeGeometry(geo), wireMat)

  const solidMat = new THREE.MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 0,
    roughness: 0.3,
    metalness: 0.4,
    transparent: true,
    opacity: 0,
  })
  const solidObj = new THREE.Mesh(geo, solidMat)

  const group = new THREE.Group()
  group.scale.setScalar(0)
  group.add(wireObj, solidObj)
  scene.add(group)

  scene.add(new THREE.AmbientLight(0xffffff, 0.15))
  const light = new THREE.PointLight(accent, 2.5, 20)
  light.position.set(0, 2, 5)
  scene.add(light)

  const start = performance.now()

  const tick = () => {
    animId = requestAnimationFrame(tick)
    const elapsed = performance.now() - start

    progress.value = clamp(elapsed / TOTAL, 0, 1)

    if (elapsed < WIRE_IN) {
      const p = norm(elapsed, 0, WIRE_IN)
      group.scale.setScalar(easeOut(p))
      wireMat.opacity = p
      solidMat.opacity = 0
      solidMat.emissiveIntensity = 0
    } else if (elapsed < WIRE_IN + CROSSFADE) {
      const p = norm(elapsed, WIRE_IN, WIRE_IN + CROSSFADE)
      group.scale.setScalar(1)
      wireMat.opacity = 1 - p
      solidMat.opacity = p
      solidMat.emissiveIntensity = p * 0.5
    } else if (elapsed < WIRE_IN + CROSSFADE + HOLD) {
      const p = norm(elapsed, WIRE_IN + CROSSFADE, WIRE_IN + CROSSFADE + HOLD)
      group.scale.setScalar(1)
      wireMat.opacity = 0
      solidMat.opacity = 1
      solidMat.emissiveIntensity = 0.5
      group.rotation.y = Math.sin(p * Math.PI * 0.5) * 0.25
    } else {
      const p = norm(elapsed, WIRE_IN + CROSSFADE + HOLD, TOTAL)
      solidMat.opacity = 1 - p
      solidMat.emissiveIntensity = 0.5 * (1 - p)
      group.scale.setScalar(1 + p * 0.05)
    }

    composer.render()

    if (elapsed >= TOTAL) {
      cancelAnimationFrame(animId)
      emit('done')
    }
  }

  tick()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<template>
  <div class="fixed inset-0" style="z-index: 50">
    <canvas ref="canvasRef" class="w-full h-full" />

    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 md:w-64">
      <div class="text-[var(--text-dim)] text-xs tracking-widest text-center mb-2">
        LOADING SYSTEM...
      </div>
      <div class="h-[2px] w-full bg-[var(--text-dim)]/20 overflow-hidden">
        <div
          class="h-full bg-[var(--text-accent)] transition-none"
          :style="{ width: (progress * 100) + '%' }"
        />
      </div>
      <div class="text-[var(--text-dim)] text-xs tracking-widest text-center mt-1">
        {{ Math.floor(progress * 100) }}%
      </div>
    </div>
  </div>
</template>
