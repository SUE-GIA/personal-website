<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { PROFILE, NAV_ITEMS, LINKS, STATUS, TIMELINE } from '../../data/siteInfo.js'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'run-command'])
const { currentTheme } = useTheme()

const uptime = ref('00:00:00')
let startTime = Date.now()
let interval = null

const formatUptime = () => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
  const s = String(elapsed % 60).padStart(2, '0')
  uptime.value = `${h}:${m}:${s}`
}

onMounted(() => {
  interval = setInterval(formatUptime, 1000)
})

onUnmounted(() => clearInterval(interval))

const handleNav = (cmd) => {
  emit('run-command', cmd)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="crt-switch">
      <div
        v-if="open"
        class="fixed inset-0 z-[200] bg-[var(--bg-screen)]"
        style="padding: 2em">
      <div class="h-full overflow-y-auto flex flex-col gap-6 text-sm">
        <div class="flex justify-between items-center">
          <p class="text-[var(--text-dim)] text-xs tracking-widest">TTY2</p>
          <button
            class="text-[var(--text-dim)] hover:text-[var(--text-accent)] transition-colors cursor-pointer text-xs tracking-widest"
            @click="emit('close')">← BACK TO TTY1</button>
        </div>

        <div>
          <p class="text-base text-[var(--text-accent)]">sg@terminal</p>
          <p class="text-[var(--text-dim)] my-2">─────────────────────────────</p>
          <div class="space-y-1">
            <p><span class="text-[var(--text-secondary)]">name</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.name }}</span></p>
            <p><span class="text-[var(--text-secondary)]">role</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.role }}</span></p>
            <p><span class="text-[var(--text-secondary)]">stack</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.stack }}</span></p>
            <p><span class="text-[var(--text-secondary)]">focus</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.focus }}</span></p>
            <p><span class="text-[var(--text-secondary)]">theme</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ currentTheme }}</span></p>
            <p><span class="text-[var(--text-secondary)]">uptime</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ uptime }}</span></p>
          </div>
        </div>

        <div>
          <p class="text-[var(--text-dim)]">─────────────────────────────</p>
          <p class="text-base text-[var(--text-accent)] my-2">~/</p>
          <div class="space-y-1">
            <button
              v-for="(item, i) in NAV_ITEMS"
              :key="item.cmd"
              class="block w-full text-left text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors cursor-pointer"
              @click="handleNav(item.cmd)">
              <span class="text-[var(--text-dim)]">{{ i < NAV_ITEMS.length - 1 ? '├── ' : '└── ' }}</span>{{ item.label }}
            </button>
          </div>
        </div>

        <div>
          <p class="text-[var(--text-dim)]">─────────────────────────────</p>
          <p class="text-base text-[var(--text-accent)] my-2">> status</p>
          <p class="text-[var(--text-secondary)] leading-relaxed">{{ STATUS }}</p>
        </div>

        <div>
          <p class="text-[var(--text-dim)]">─────────────────────────────</p>
          <p class="text-base text-[var(--text-accent)] my-2">> timeline</p>
          <div class="space-y-2">
            <div v-for="item in TIMELINE" :key="item.year">
              <span class="text-[var(--text-accent)]">{{ item.year }}</span>
              <span class="text-[var(--text-dim)]">  ·  </span>
              <span class="text-[var(--text-secondary)]">{{ item.event }}</span>
            </div>
          </div>
        </div>

        <div>
          <p class="text-[var(--text-dim)]">─────────────────────────────</p>
          <p class="text-base text-[var(--text-accent)] my-2">links</p>
          <div class="space-y-1">
            <a
              v-for="link in LINKS"
              :key="link.label"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors">
              <span class="text-[var(--text-dim)]">→ </span>{{ link.label }}
            </a>
          </div>
        </div>

      </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.crt-switch-enter-active {
  animation: crt-on 0.3s ease-out;
}

.crt-switch-leave-active {
  animation: crt-off 0.2s ease-in;
}

@keyframes crt-on {
  0% {
    opacity: 0;
    transform: scaleY(0.005) scaleX(0.8);
    filter: brightness(10);
  }
  40% {
    opacity: 1;
    transform: scaleY(0.005) scaleX(0.8);
    filter: brightness(10);
  }
  70% {
    transform: scaleY(1.05) scaleX(1);
    filter: brightness(1.5);
  }
  100% {
    transform: scaleY(1) scaleX(1);
    filter: brightness(1);
  }
}

@keyframes crt-off {
  0% {
    opacity: 1;
    transform: scaleY(1) scaleX(1);
    filter: brightness(1);
  }
  60% {
    opacity: 1;
    transform: scaleY(0.005) scaleX(0.8);
    filter: brightness(10);
  }
  100% {
    opacity: 0;
    transform: scaleY(0) scaleX(0.5);
    filter: brightness(10);
  }
}
</style>
