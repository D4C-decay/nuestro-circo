import { useCallback, useRef } from 'react'
import type { SalaId } from '../content/circus'
import { useProgress } from '../lib/progress'

export function useGameTouch(sala: SalaId, id: string) {
  const { markPlayed } = useProgress()
  const touched = useRef(false)
  return useCallback(() => {
    if (touched.current) return
    touched.current = true
    markPlayed(`${sala}:${id}`, sala)
  }, [id, markPlayed, sala])
}

export function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}
