export const BOOT_SEQUENCE = [
  { style: 'blank' },
  {
    style: 'emblem',
    s: [' ██████╗ ', '██╔════╝ ', '╚██████╗ ', ' ╚════██║', ' ██████╔╝', ' ╚═════╝ '],
    g: [
      ' ██████╗ ',
      '██╔════╝ ',
      '██║  ███╗',
      '██║   ██║',
      '╚██████╔╝',
      ' ╚═════╝ ',
    ],
  },
  { style: 'blank' },
  { style: 'dim', text: '─────────────────────────────' },
  { style: 'blank' },

  { style: 'prompt', text: 'whoami' },
  { style: 'secondary', text: '  S.Giannakos — Software Engineer' },
  { style: 'dim', text: '  Backend Systems · Laravel · Architecture · Vue · APIs' },
  { style: 'blank' },

  { style: 'prompt', text: 'skills' },
  { style: 'secondary', text: '  php/  laravel/  architecture/  system-design/  api/  vue/' },
  { style: 'blank' },

  { style: 'prompt', text: 'help' },
  { style: 'secondary', text: '  Available commands:' },
  { style: 'cmd', text: '    whoami     → who am i' },
  { style: 'cmd', text: '    skills     → tech stack & tools' },
  { style: 'cmd', text: "    projects   → things i've worked on [under construction]" },
  { style: 'cmd', text: '    contact    → get in touch [under construction]' },
  { style: 'cmd', text: '    help       → show this list' },
  { style: 'cmd', text: '    theme      → switch terminal theme' },
  { style: 'cmd', text: '    clear      → clear the terminal' },
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
