import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STAMPS, type SalaId, type StampId } from '../content/circus'

type ProgressState = {
  stamps: StampId[]
  played: string[]
  gold: SalaId[]
  cabinet: string[]
  plan: string | null
  prediction: string | null
  wish: string | null
  bingoLines: number[]
  finale: string | null
}

type ProgressContextValue = ProgressState & {
  totalStamps: number
  allStamps: boolean
  markCabinet: (id: string) => void
  markPlayed: (id: string, sala: SalaId) => void
  awardStamp: (id: StampId) => void
  setPlan: (plan: string) => void
  setPrediction: (prediction: string) => void
  setWish: (wish: string) => void
  setBingoLines: (lines: number[]) => void
  setFinale: (answer: string) => void
  reset: () => void
}

const STORAGE_KEY = 'circo-gappy-v1'

const EMPTY: ProgressState = {
  stamps: [],
  played: [],
  gold: [],
  cabinet: [],
  plan: null,
  prediction: null,
  wish: null,
  bingoLines: [],
  finale: null,
}

function readStorage(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      stamps: Array.isArray(parsed.stamps) ? parsed.stamps : [],
      played: Array.isArray(parsed.played) ? parsed.played : [],
      gold: Array.isArray(parsed.gold) ? parsed.gold : [],
      cabinet: Array.isArray(parsed.cabinet) ? parsed.cabinet : [],
      plan: typeof parsed.plan === 'string' ? parsed.plan : null,
      prediction: typeof parsed.prediction === 'string' ? parsed.prediction : null,
      wish: typeof parsed.wish === 'string' ? parsed.wish : null,
      bingoLines: Array.isArray(parsed.bingoLines) ? parsed.bingoLines : [],
      finale: typeof parsed.finale === 'string' ? parsed.finale : null,
    }
  } catch {
    return EMPTY
  }
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(readStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const awardStamp = useCallback((id: StampId) => {
    setState((current) => {
      if (current.stamps.includes(id)) return current
      return { ...current, stamps: [...current.stamps, id] }
    })
  }, [])

  const markCabinet = useCallback((id: string) => {
    setState((current) => {
      const cabinet = current.cabinet.includes(id)
        ? current.cabinet
        : [...current.cabinet, id]
      const stamps =
        cabinet.filter((entry) => ['vela', 'peon', 'reloj'].includes(entry)).length >= 3 &&
        !current.stamps.includes('gabinete')
          ? [...current.stamps, 'gabinete' as StampId]
          : current.stamps
      return { ...current, cabinet, stamps }
    })
  }, [])

  const markPlayed = useCallback((id: string, sala: SalaId) => {
    setState((current) => {
      const played = current.played.includes(id) ? current.played : [...current.played, id]
      const salaGames = played.filter((entry) => entry.startsWith(`${sala}:`))
      const stamp: StampId =
        sala === 'punteria' ? 'sala-punteria' : sala === 'magia' ? 'sala-magia' : 'sala-dulces'
      const stamps =
        salaGames.length >= 3 && !current.stamps.includes(stamp)
          ? [...current.stamps, stamp]
          : current.stamps
      const gold =
        salaGames.length >= 5 && !current.gold.includes(sala) ? [...current.gold, sala] : current.gold
      return { ...current, played, stamps, gold }
    })
  }, [])

  const setPlan = useCallback((plan: string) => setState((current) => ({ ...current, plan })), [])
  const setPrediction = useCallback(
    (prediction: string) => setState((current) => ({ ...current, prediction })),
    [],
  )
  const setWish = useCallback((wish: string) => setState((current) => ({ ...current, wish })), [])
  const setBingoLines = useCallback(
    (bingoLines: number[]) => setState((current) => ({ ...current, bingoLines })),
    [],
  )
  const setFinale = useCallback((finale: string) => setState((current) => ({ ...current, finale })), [])
  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(EMPTY)
  }, [])

  const value = useMemo<ProgressContextValue>(() => {
    const totalStamps = STAMPS.filter((stamp) => state.stamps.includes(stamp.id)).length
    return {
      ...state,
      totalStamps,
      allStamps: totalStamps === STAMPS.length,
      markCabinet,
      markPlayed,
      awardStamp,
      setPlan,
      setPrediction,
      setWish,
      setBingoLines,
      setFinale,
      reset,
    }
  }, [
    state,
    markCabinet,
    markPlayed,
    awardStamp,
    setPlan,
    setPrediction,
    setWish,
    setBingoLines,
    setFinale,
    reset,
  ])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const value = useContext(ProgressContext)
  if (!value) throw new Error('useProgress must be used inside ProgressProvider')
  return value
}
