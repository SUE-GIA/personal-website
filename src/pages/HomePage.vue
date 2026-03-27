<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import BootLogo from '../components/BootLogo.vue'
import { useTheme } from '../composables/useTheme.js'
import { useCommands } from '../composables/useCommands.js'
import { BOOT_SEQUENCE, BOOT_DELAYS } from '../data/bootSequence.js'

const { themeColors } = useTheme()
const { execute } = useCommands()

const visibleLines = ref([])
const history = ref([])
const input = ref('')
const cursorVisible = ref(true)
const inputRef = ref(null)
const containerRef = ref(null)
const phase = ref('logo')

let cursorInterval = null
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const scrollToBottom = () => {
  nextTick(() => {
    containerRef.value?.scrollTo({ top: containerRef.value.scrollHeight, behavior: 'smooth' })
  })
}

const runBootSequence = async () => {
  for (const line of BOOT_SEQUENCE) {
    await delay(BOOT_DELAYS[line.style] ?? 80)
    visibleLines.value.push(line)
    scrollToBottom()
  }
}

const onLogoDone = async () => {
  phase.value = 'booting'
  await runBootSequence()
  phase.value = 'normal'
  await nextTick()
  inputRef.value?.focus()
}

onMounted(() => {
  cursorInterval = setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)
})

onUnmounted(() => clearInterval(cursorInterval))

const runCrashSequence = async () => {
  phase.value = 'reboot'
  await delay(3000)
  history.value = []
  visibleLines.value = []
  phase.value = 'logo'
}

const handleKeydown = async (e) => {
  if (e.key !== 'Enter' || phase.value !== 'normal') return

  const raw = input.value.trim()
  input.value = ''
  if (!raw) return

  const result = execute(raw, { clearHistory: () => { history.value = [] } })

  if (result === null) {
    scrollToBottom()
    return
  }

  history.value.push({ cmd: raw, ...result })
  scrollToBottom()

  if (history.value.filter(h => h.error).length >= 4) {
    await delay(400)
    runCrashSequence()
  }
}
</script>

<template>
  <main class="h-full w-full relative" @click="inputRef?.focus()">

    <BootLogo
      v-if="phase === 'logo'"
      :accent-color="themeColors.accent"
      :dim-color="themeColors.dim"
      :bg-color="themeColors.bg"
      @done="onLogoDone"
    />

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
      class="absolute inset-0 p-6 md:p-10 xl:p-14 overflow-y-auto overflow-x-hidden break-words">

      <template v-for="(line, i) in visibleLines" :key="i">
        <div v-if="line.style === 'blank'" class="h-[0.6em]" />

        <div
          v-else-if="line.style === 'emblem'"
          class="flex gap-4 text-[var(--text-accent)] leading-none text-sm md:text-base xl:text-lg">
          <pre class="font-[inherit] whitespace-pre-wrap">{{ line.s.join('\n') }}</pre>
          <pre class="font-[inherit] whitespace-pre-wrap">{{ line.g.join('\n') }}</pre>
        </div>

        <p
          v-else-if="line.style === 'dim'"
          class="text-base md:text-lg text-[var(--text-dim)]"
        >{{ line.text }}</p>

        <p
          v-else-if="line.style === 'secondary'"
          class="text-base md:text-lg text-[var(--text-secondary)]"
        >{{ line.text }}</p>

        <div v-else-if="line.style === 'prompt'" class="mt-2 flex gap-2">
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-prompt)]">$</span>
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-accent)]">{{ line.text }}</span>
        </div>

        <p
          v-else-if="line.style === 'cmd'"
          class="text-base md:text-lg text-[var(--text-dim)]"
        >{{ line.text }}</p>
      </template>

      <template v-for="(entry, i) in history" :key="'h' + i">
        <div class="mt-4 md:mt-6 flex gap-2">
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-prompt)]">$</span>
          <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-accent)]">{{ entry.cmd }}</span>
        </div>
        <p v-if="entry.error" class="ml-5 text-base md:text-lg xl:text-xl text-[var(--text-error)]">{{ entry.error }}</p>
        <template v-if="entry.lines">
          <p
            v-for="(ln, j) in entry.lines"
            :key="j"
            class="text-base md:text-lg xl:text-xl"
            :class="{
              'text-[var(--text-secondary)]': ln.style === 'secondary',
              'text-[var(--text-dim)]': ln.style === 'dim',
            }"
          >{{ ln.text }}</p>
        </template>
      </template>

      <div v-if="phase === 'normal'" class="mt-4 md:mt-6 flex gap-2 items-start">
        <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-prompt)] shrink-0">$</span>
        <span class="text-lg md:text-xl xl:text-2xl text-[var(--text-accent)] break-all min-w-0">{{ input }}</span>
        <span
          class="inline-block w-[9px] h-[1.2em] bg-[var(--text-accent)] translate-y-[6px]"
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
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.blink-text {
  animation: blink 0.6s step-end infinite;
}
</style>
