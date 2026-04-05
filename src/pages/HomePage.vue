<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import BootLogo from '../components/BootLogo.vue'
import SideBar from '../components/layout/SideBar.vue'
import TimelinePanel from '../components/layout/TimelinePanel.vue'
import MobileDrawer from '../components/layout/MobileDrawer.vue'
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
const drawerOpen = ref(false)

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
  inputRef.value?.focus({ preventScroll: true })
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

const runCommand = async (raw) => {
  if (phase.value !== 'normal') return

  const result = execute(raw, { clearHistory: () => { history.value = [] } })

  if (result === null) {
    scrollToBottom()
    return
  }

  history.value.push({ cmd: raw, ...result })
  scrollToBottom()

  if (history.value.filter(h => h.error).length >= 4) {
    await delay(400)
    await runCrashSequence()
  }
}

const handleKeydown = (e) => {
  if (e.key !== 'Enter') return

  const raw = input.value.trim()
  input.value = ''
  if (!raw) return

  runCommand(raw)
}
</script>

<template>
  <main class="h-full w-full relative" @click="inputRef?.focus({ preventScroll: true })">

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
      class="absolute inset-0 p-6 md:p-10 xl:p-14 flex items-stretch gap-8 overflow-hidden">

    <div
      ref="containerRef"
      class="flex-1 min-w-0 overflow-y-auto overflow-x-hidden break-words relative"
      style="overscroll-behavior: contain">

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
        class="fixed top-0 left-0 opacity-0 pointer-events-none"
        @keydown="handleKeydown"
        autocomplete="off"
        spellcheck="false"
      />
    </div>

    <div class="hidden xl:grid grid-cols-2 grid-rows-[auto_auto_1fr] gap-x-14 shrink-0 w-[44rem] h-full">
      <TimelinePanel />
      <SideBar @run-command="runCommand" />
    </div>

    </div>

    <button
      v-if="phase === 'normal'"
      class="outline-solid xl:hidden fixed top-6 z-[150] text-[var(--text-dim)] hover:text-[var(--text-accent)] transition-colors text-xl font-black tracking-widest cursor-pointer"
      @click.stop="drawerOpen = true"
      style="right: 8%; padding: 5px">TTY2 →</button>

    <MobileDrawer
      :open="drawerOpen"
      @close="drawerOpen = false"
      @run-command="(cmd) => { runCommand(cmd); inputRef?.focus({ preventScroll: true }) }"/>
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
