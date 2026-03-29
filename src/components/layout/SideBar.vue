<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { PROFILE, NAV_ITEMS, LINKS } from '../../data/siteInfo.js'

const emit = defineEmits(['run-command'])
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
</script>

<template>
  <aside class="grid grid-rows-[subgrid] row-span-3 border-l border-[var(--border-subtle)] gap-y-10 text-base" style="padding-left: 8px">

    <div>
      <p class="text-lg text-[var(--text-accent)]">sg@terminal</p>
      <p class="text-[var(--text-dim)] my-5">───────────────────</p>
      <div class="space-y-2">
        <p><span class="text-[var(--text-secondary)]">name</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.name }}</span></p>
        <p><span class="text-[var(--text-secondary)]">role</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.role }}</span></p>
        <p><span class="text-[var(--text-secondary)]">stack</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.stack }}</span></p>
        <p><span class="text-[var(--text-secondary)]">focus</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ PROFILE.focus }}</span></p>
        <p><span class="text-[var(--text-secondary)]">theme</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ currentTheme }}</span></p>
        <p><span class="text-[var(--text-secondary)]">uptime</span><span class="text-[var(--text-dim)]"> ~ </span><span class="text-[var(--text-primary)]">{{ uptime }}</span></p>
      </div>
    </div>

    <div>
      <p class="text-[var(--text-dim)]">───────────────────</p>
      <p class="text-lg text-[var(--text-accent)] my-5">~/</p>
      <div class="space-y-2">
        <button
          v-for="(item, i) in NAV_ITEMS"
          :key="item.cmd"
          class="block w-full text-left text-base text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors cursor-pointer"
          @click="emit('run-command', item.cmd)">
          <span class="text-[var(--text-dim)]">{{ i < NAV_ITEMS.length - 1 ? '├── ' : '└── ' }}</span>{{ item.label }}
        </button>
      </div>
    </div>

    <div>
      <p class="text-[var(--text-dim)]">───────────────────</p>
      <p class="text-lg text-[var(--text-accent)] my-5">links</p>
      <div class="space-y-2">
        <a
          v-for="link in LINKS"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block text-base text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-colors">
          <span class="text-[var(--text-dim)]">→ </span>{{ link.label }}
        </a>
      </div>
    </div>

  </aside>
</template>
