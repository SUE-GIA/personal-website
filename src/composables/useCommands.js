import { useTheme } from './useTheme.js'

const { currentTheme, themeNames, applyTheme } = useTheme()

export function useCommands() {
  const execute = (raw, { clearHistory }) => {
    const parts = raw.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const arg = parts[1]?.toLowerCase()

    if (cmd === 'clear') {
      clearHistory()
      return null
    }

    if (cmd === 'help') {
      return {
        lines: [
          { text: '  Available commands:', style: 'secondary' },
          { text: '    whoami     → who am i', style: 'dim' },
          { text: '    skills     → tech stack & tools', style: 'dim' },
          { text: "    projects   → things i've worked on [under construction]", style: 'dim' },
          { text: '    contact    → get in touch [under construction]', style: 'dim' },
          { text: '    help       → show this list', style: 'dim' },
          { text: '    theme      → switch terminal theme', style: 'dim' },
          { text: '    clear      → clear the terminal', style: 'dim' },
        ],
      }
    }

    if (cmd === 'whoami') {
      return {
        lines: [
          { text: '  S.Giannakos — Software Engineer', style: 'secondary' },
          { text: '  Backend Systems · Laravel · Architecture · Vue · APIs', style: 'dim' },
        ],
      }
    }

    if (cmd === 'skills') {
      return {
        lines: [
          { text: '  php/  laravel/  architecture/  system-design/  api/  vue/', style: 'secondary' },
        ],
      }
    }

    if (cmd === 'theme') {
      if (!arg) {
        const dark = themeNames.filter((n) => n !== 'light')
        return {
          lines: [
            { text: `  Current theme: ${currentTheme.value}`, style: 'secondary' },
            { text: `  Dark themes:  ${dark.join(', ')}`, style: 'dim' },
            { text: '  Light themes: light', style: 'dim' },
            { text: '  Usage: theme <name>', style: 'dim' },
          ],
        }
      }
      if (applyTheme(arg)) {
        return { lines: [{ text: `  Theme switched to ${arg}`, style: 'secondary' }] }
      }
      return { error: `  Unknown theme "${arg}". Available: ${themeNames.join(', ')}` }
    }

    const knownCommands = ['projects', 'contact']
    if (knownCommands.includes(cmd)) {
      return { lines: [{ text: '  [ UNDER CONSTRUCTION ]', style: 'dim' }] }
    }

    return { error: `  Unknown command: "${cmd}". Type help for available commands.` }
  }

  return { execute }
}
