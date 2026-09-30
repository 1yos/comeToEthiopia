import { useEffect } from 'react'

/**
 * Listens for the user typing a specific sequence of keys anywhere on the page.
 * Used for the "buna" easter egg.
 *
 * @param sequence - the string to detect (e.g. 'buna')
 * @param onMatch  - callback fired when the sequence is typed
 */
export function useKonami(sequence: string, onMatch: () => void) {
  useEffect(() => {
    let buffer = ''
    const target = sequence.toLowerCase()

    const handler = (e: KeyboardEvent) => {
      // Only care about printable single characters
      if (e.key.length !== 1) return

      buffer = (buffer + e.key.toLowerCase()).slice(-target.length)
      if (buffer === target) {
        buffer = ''
        onMatch()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [sequence, onMatch])
}
