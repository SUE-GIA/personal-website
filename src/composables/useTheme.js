import { ref, computed } from 'vue'

const THEMES = {
  amber: {
    accent3d: 0xdca03c,
    dim3d: 0x7a4a10,
    bg3d: 0x0c0804,
    '--bg-room': '#0a0804',
    '--bg-bezel': '#1a1610',
    '--bg-screen': '#0c0804',
    '--bg-sidebar': 'rgba(0, 0, 0, 0.3)',
    '--border-screen': 'rgba(180, 90, 20, 0.2)',
    '--border-subtle': 'rgba(180, 90, 20, 0.12)',
    '--text-primary': 'rgba(210, 140, 60, 0.85)',
    '--text-secondary': 'rgba(190, 130, 60, 0.7)',
    '--text-dim': 'rgba(160, 100, 40, 0.45)',
    '--text-accent': 'rgba(220, 160, 60, 0.9)',
    '--text-error': 'rgba(200, 60, 40, 0.8)',
    '--text-prompt': 'rgba(200, 100, 30, 0.6)',
    '--glow-amber': 'rgba(200, 120, 30, 0.4)',
    '--glow-strong': 'rgba(220, 140, 40, 0.6)',
    '--led': 'rgba(220, 80, 40, 0.8)',
  },
  green: {
    accent3d: 0x50dc64,
    dim3d: 0x1a6628,
    bg3d: 0x020c04,
    '--bg-room': '#020804',
    '--bg-bezel': '#0a1610',
    '--bg-screen': '#020c04',
    '--bg-sidebar': 'rgba(0, 0, 0, 0.3)',
    '--border-screen': 'rgba(20, 180, 60, 0.2)',
    '--border-subtle': 'rgba(20, 180, 60, 0.12)',
    '--text-primary': 'rgba(60, 210, 90, 0.85)',
    '--text-secondary': 'rgba(50, 190, 80, 0.7)',
    '--text-dim': 'rgba(30, 160, 60, 0.45)',
    '--text-accent': 'rgba(80, 220, 100, 0.9)',
    '--text-error': 'rgba(200, 60, 40, 0.8)',
    '--text-prompt': 'rgba(40, 180, 70, 0.6)',
    '--glow-amber': 'rgba(40, 200, 80, 0.4)',
    '--glow-strong': 'rgba(60, 220, 100, 0.6)',
    '--led': 'rgba(40, 220, 80, 0.8)',
  },
  blue: {
    accent3d: 0x78b4f0,
    dim3d: 0x1a3a6a,
    bg3d: 0x02040c,
    '--bg-room': '#020408',
    '--bg-bezel': '#0a101a',
    '--bg-screen': '#02040c',
    '--bg-sidebar': 'rgba(0, 0, 0, 0.3)',
    '--border-screen': 'rgba(40, 100, 200, 0.2)',
    '--border-subtle': 'rgba(40, 100, 200, 0.12)',
    '--text-primary': 'rgba(100, 160, 220, 0.85)',
    '--text-secondary': 'rgba(80, 140, 200, 0.7)',
    '--text-dim': 'rgba(50, 100, 170, 0.45)',
    '--text-accent': 'rgba(120, 180, 240, 0.9)',
    '--text-error': 'rgba(200, 60, 40, 0.8)',
    '--text-prompt': 'rgba(70, 130, 210, 0.6)',
    '--glow-amber': 'rgba(60, 140, 220, 0.4)',
    '--glow-strong': 'rgba(80, 160, 240, 0.6)',
    '--led': 'rgba(60, 140, 240, 0.8)',
  },
  white: {
    accent3d: 0xdcdcdc,
    dim3d: 0x505050,
    bg3d: 0x080808,
    '--bg-room': '#060606',
    '--bg-bezel': '#141414',
    '--bg-screen': '#080808',
    '--bg-sidebar': 'rgba(0, 0, 0, 0.3)',
    '--border-screen': 'rgba(180, 180, 180, 0.2)',
    '--border-subtle': 'rgba(180, 180, 180, 0.12)',
    '--text-primary': 'rgba(200, 200, 200, 0.85)',
    '--text-secondary': 'rgba(170, 170, 170, 0.7)',
    '--text-dim': 'rgba(120, 120, 120, 0.45)',
    '--text-accent': 'rgba(220, 220, 220, 0.9)',
    '--text-error': 'rgba(200, 60, 40, 0.8)',
    '--text-prompt': 'rgba(160, 160, 160, 0.6)',
    '--glow-amber': 'rgba(180, 180, 180, 0.4)',
    '--glow-strong': 'rgba(200, 200, 200, 0.6)',
    '--led': 'rgba(200, 200, 200, 0.8)',
  },
  light: {
    accent3d: 0x2a2a2a,
    dim3d: 0x888888,
    bg3d: 0xf0f0f0,
    '--bg-room': '#e8e8e8',
    '--bg-bezel': '#d8d8d8',
    '--bg-screen': '#f0f0f0',
    '--bg-sidebar': 'rgba(0, 0, 0, 0.05)',
    '--border-screen': 'rgba(0, 0, 0, 0.12)',
    '--border-subtle': 'rgba(0, 0, 0, 0.08)',
    '--text-primary': 'rgba(30, 30, 30, 0.85)',
    '--text-secondary': 'rgba(60, 60, 60, 0.7)',
    '--text-dim': 'rgba(100, 100, 100, 0.5)',
    '--text-accent': 'rgba(20, 20, 20, 0.9)',
    '--text-error': 'rgba(180, 40, 30, 0.85)',
    '--text-prompt': 'rgba(80, 80, 80, 0.6)',
    '--glow-amber': 'rgba(0, 0, 0, 0.1)',
    '--glow-strong': 'rgba(0, 0, 0, 0.15)',
    '--led': 'rgba(60, 60, 60, 0.8)',
  },
}

const currentTheme = ref(localStorage.getItem('sg-theme') || 'amber')

const themeColors = computed(() => {
  const t = THEMES[currentTheme.value] || THEMES.amber
  return { accent: t.accent3d, dim: t.dim3d, bg: t.bg3d }
})

function applyTheme(name) {
  const theme = THEMES[name]
  if (!theme) return false

  for (const [prop, val] of Object.entries(theme)) {
    if (prop.startsWith('--')) document.documentElement.style.setProperty(prop, val)
  }

  currentTheme.value = name
  localStorage.setItem('sg-theme', name)
  return true
}

applyTheme(currentTheme.value)

export function useTheme() {
  return { currentTheme, themeColors, themeNames: Object.keys(THEMES), applyTheme }
}
