<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const CRASH_LIMIT = 4

const bootLines = [
  { prompt: true, cmd: 'whoami' },
  { prompt: false, output: '> S.Giannakos — Software Engineer', style: 'secondary' },
  { prompt: false, output: '  Backend Systems / Laravel / Architecture', style: 'dim' },
  { prompt: true, cmd: 'ls ./skills' },
  { prompt: false, output: '  php/ laravel/ vue/  architecture/  system-design/  api/', style: 'secondary' },
]

const history = ref([])
const input = ref('')
const cursorVisible = ref(true)
const inputRef = ref(null)
const containerRef = ref(null)
const phase = ref('normal')

let cursorInterval = null

onMounted(() => {
  cursorInterval = setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)
  inputRef.value?.focus()
})

onUnmounted(() => {
  clearInterval(cursorInterval)
})

const runCrashSequence = async () => {
  phase.value = 'reboot'

  await delay(3000)
  history.value = []
  phase.value = 'normal'
  await nextTick()
  inputRef.value?.focus()
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const handleKeydown = async (e) => {
  if (e.key !== 'Enter' || phase.value !== 'normal') return

  const cmd = input.value.trim()
  history.value.push({ cmd, error: '[ UNDER CONSTRUCTION ]' })
  input.value = ''

  await nextTick()
  containerRef.value?.scrollTo({ top: containerRef.value.scrollHeight, behavior: 'smooth' })

  if (history.value.length >= CRASH_LIMIT) {
    await delay(400)
    runCrashSequence()
  }
}
</script>

<template>
  <main class="h-full w-full" @click="inputRef?.focus()">

    <div
        v-if="phase === 'reboot'"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2">
      <p class="text-[var(--text-dim)] text-sm md:text-base tracking-widest">BIOS v2.1.4</p>
      <p class="text-[var(--text-dim)] text-sm md:text-base tracking-widest mt-2">RUNNING CHECKS...</p>
      <p class="text-[var(--text-secondary)] text-sm md:text-base tracking-widest">OK</p>
      <p class="text-[var(--text-accent)] text-sm md:text-base tracking-widest mt-2 blink-text">
        SYSTEM RESTART IN PROGRESS
      </p>
    </div>

    <div
        v-else
        ref="containerRef"
        class="h-full w-full p-6 md:p-10 xl:p-14 overflow-y-auto">
      <p class="text-base md:text-lg text-[var(--text-dim)]">S.Giannakos — PERSONAL TERMINAL v2.1.4</p>
      <p class="text-base md:text-lg text-[var(--text-dim)]">────────────────────────────────────────────</p>

      <template v-for="(line, i) in bootLines" :key="i">
        <div v-if="line.prompt" class="mt-4 md:mt-6 flex gap-2">
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-prompt)]">$</span>
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-accent)]">{{ line.cmd }}</span>
        </div>
        <p
            v-else
            class="ml-5 text-base md:text-lg xl:text-xl"
            :class="{
            'text-[var(--text-secondary)]': line.style === 'secondary',
            'text-[var(--text-dim)]': line.style === 'dim',
          }"
        >{{ line.output }}</p>
      </template>

      <template v-for="(entry, i) in history" :key="'h' + i">
        <div class="mt-4 md:mt-6 flex gap-2">
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-prompt)]">$</span>
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-accent)]">{{ entry.cmd }}</span>
        </div>
        <p class="ml-5 text-base md:text-lg xl:text-xl text-[var(--text-error)]">{{ entry.error }}</p>
      </template>

      <div class="mt-4 md:mt-6 flex gap-2 items-center">
        <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-prompt)]">$</span>
        <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-accent)]">{{ input }}</span>
        <span
            class="inline-block w-[9px] h-[1.2em] bg-[var(--text-accent)] translate-y-[1px]"
            :style="{ opacity: cursorVisible ? 1 : 0 }"
        />
      </div>

      <input
          ref="inputRef"
          v-model="input"
          class="absolute opacity-0 pointer-events-none"
          @keydown="handleKeydown"
          autocomplete="off"
          spellcheck="false"
      />
    </div>
  </main>
</template>

<style scoped>
@keyframes glitch-crash {
  0%   { transform: translate(0); opacity: 1; }
  10%  { transform: translate(-4px, 2px); opacity: 0.8; }
  20%  { transform: translate(4px, -2px); opacity: 1; }
  30%  { transform: translate(-6px, 0px); opacity: 0.7; }
  40%  { transform: translate(6px, 2px); opacity: 1; }
  50%  { transform: translate(-2px, -4px); opacity: 0.6; }
  60%  { transform: translate(2px, 4px); opacity: 1; }
  70%  { transform: translate(-4px, 2px); opacity: 0.8; }
  80%  { transform: translate(4px, -4px); opacity: 1; }
  90%  { transform: translate(-2px, 2px); opacity: 0.7; }
  100% { transform: translate(0); opacity: 1; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.crash-glitch {
  animation: glitch-crash 0.15s infinite;
}

.blink-text {
  animation: blink 0.6s step-end infinite;
}
</style>