import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type SoundId =
  | 'click'
  | 'pop'
  | 'chime'
  | 'wheel'
  | 'coin'
  | 'match'
  | 'camera'
  | 'confetti'

type AudioContextValue = {
  musicOn: boolean
  sfxOn: boolean
  toggleMusic: () => void
  toggleSfx: () => void
  enableMusic: () => void
  playSfx: (sound: SoundId) => void
}

const SoundContext = createContext<AudioContextValue | null>(null)

const TONES: Record<SoundId, { notes: number[]; type: OscillatorType; duration: number; gain: number }> = {
  click: { notes: [420], type: 'triangle', duration: 0.07, gain: 0.035 },
  pop: { notes: [640, 880], type: 'sine', duration: 0.11, gain: 0.06 },
  chime: { notes: [523, 659, 784, 1046], type: 'sine', duration: 0.5, gain: 0.055 },
  wheel: { notes: [220, 247, 262, 294], type: 'triangle', duration: 0.12, gain: 0.025 },
  coin: { notes: [880, 1174, 1568], type: 'triangle', duration: 0.24, gain: 0.04 },
  match: { notes: [392, 523, 659], type: 'sine', duration: 0.3, gain: 0.045 },
  camera: { notes: [1200, 300], type: 'square', duration: 0.12, gain: 0.03 },
  confetti: { notes: [523, 659, 784, 1046, 1318], type: 'triangle', duration: 0.65, gain: 0.04 },
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [musicOn, setMusicOn] = useState(false)
  const [sfxOn, setSfxOn] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const contextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const audio = new Audio()
    const mp3 = document.createElement('source')
    mp3.src = '/audio/the-world-revolving.mp3'
    mp3.type = 'audio/mpeg'
    const ogg = document.createElement('source')
    ogg.src = '/audio/the-world-revolving.ogg'
    ogg.type = 'audio/ogg'
    audio.append(mp3, ogg)
    audio.loop = true
    audio.preload = 'none'
    audio.volume = 0.32
    audioRef.current = audio

    const onVisibility = () => {
      if (document.hidden) audio.pause()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      audio.pause()
      audio.remove()
      audioRef.current = null
    }
  }, [])

  const enableMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setMusicOn(true)
    void audio.play().catch(() => setMusicOn(false))
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false))
    } else {
      audio.pause()
      setMusicOn(false)
    }
  }, [])

  const toggleSfx = useCallback(() => setSfxOn((value) => !value), [])

  const playSfx = useCallback(
    (sound: SoundId) => {
      if (!sfxOn) return
      const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext
      if (!Ctor) return
      if (!contextRef.current) contextRef.current = new Ctor()
      const context = contextRef.current
      if (context.state === 'suspended') void context.resume()
      const tone = TONES[sound]
      const start = context.currentTime
      tone.notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = tone.type
        oscillator.frequency.value = frequency
        const noteStart = start + index * (tone.duration / Math.max(tone.notes.length, 1))
        gain.gain.setValueAtTime(0.0001, noteStart)
        gain.gain.exponentialRampToValueAtTime(tone.gain, noteStart + 0.012)
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + tone.duration)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start(noteStart)
        oscillator.stop(noteStart + tone.duration + 0.02)
      })
    },
    [sfxOn],
  )

  const value = useMemo(
    () => ({ musicOn, sfxOn, toggleMusic, toggleSfx, enableMusic, playSfx }),
    [musicOn, sfxOn, toggleMusic, toggleSfx, enableMusic, playSfx],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useAudio() {
  const value = useContext(SoundContext)
  if (!value) throw new Error('useAudio must be used inside AudioProvider')
  return value
}
