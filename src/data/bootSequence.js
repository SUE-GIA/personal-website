export const BOOT_SEQUENCE = [
  { style: 'blank' },
  {
    style: 'emblem',
    s: ['███████╗', '██╔════╝', '███████╗', '╚════██║', '███████║', '╚══════╝'],
    g: [' ██████╗ ', '██╔════╝ ', '██║  ███╗', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  },
  { style: 'blank' },
  { style: 'dim', text: '──────────────────────────────────────────────' },
  { style: 'blank' },

  { style: 'prompt', text: 'help' },
  { style: 'secondary', text: '  Available commands:' },
  { style: 'cmd', text: '    about      → who am i' },
  { style: 'cmd', text: '    skills     → tech stack & tools' },
  { style: 'cmd', text: "    projects   → things i've built" },
  { style: 'cmd', text: '    contact    → get in touch' },
  { style: 'cmd', text: '    theme      → switch terminal theme' },
  { style: 'cmd', text: '    clear      → clear the terminal' },
  { style: 'blank' },

  { style: 'prompt', text: 'whoami' },
  { style: 'secondary', text: '  S.Giannakos — Software Engineer' },
  { style: 'dim', text: '  Backend Systems · Laravel · Vue · Architecture' },
  { style: 'blank' },

  { style: 'prompt', text: 'ls ./skills' },
  { style: 'secondary', text: '  php/  laravel/  vue/  architecture/  system-design/  api/' },
  { style: 'blank' },
]

export const BOOT_DELAYS = {
  blank: 25,
  emblem: 80,
  dim: 70,
  secondary: 80,
  prompt: 320,
  cmd: 85,
}
