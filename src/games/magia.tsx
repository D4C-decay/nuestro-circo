import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CAROUSEL_MEMORIES, MEMORY_PAIRS, MIRRORS, PREDICTIONS } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Icon } from '../components/Icons'
import { Button, cn, GameComplete, GameNote } from '../components/UI'
import { shuffle, useGameTouch } from './shared'

export function Pitonisa() {
  const { prediction: saved, setPrediction } = useProgress()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(saved ?? '')
  const [shaking, setShaking] = useState(false)
  const [error, setError] = useState('')
  const timeoutRef = useRef<number | null>(null)
  const touch = useGameTouch('magia', 'pitonisa')
  const { playSfx } = useAudio()

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
  }, [])

  const ask = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = question.trim()
    if (trimmed.length < 3) {
      setError('La bola necesita una pregunta de verdad. Aunque sea tonta.')
      return
    }
    setError('')
    setShaking(true)
    touch()
    playSfx('wheel')
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      const next = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)]
      setPrediction(next)
      setAnswer(next)
      setShaking(false)
      playSfx('chime')
    }, 750)
  }

  return (
    <div className="game-panel">
      <p className="game-intro">La pitonisa no cobra. Solo pide que le preguntes algo con un poco de fe y otro poco de tontería.</p>
      <form className="oracle-form" onSubmit={ask}>
        <label htmlFor="oracle-question">Tu pregunta</label>
        <div className="oracle-row">
          <input
            id="oracle-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="¿Qué nos espera?"
            maxLength={90}
          />
          <Button type="submit" icon="crystal" disabled={shaking}>
            {shaking ? 'Agitando…' : 'Preguntar'}
          </Button>
        </div>
      </form>
      <div className={cn('oracle-ball', shaking && 'is-shaking')} aria-hidden="true">
        <span className="oracle-glow" />
        <Icon name="crystal" size={58} />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="oracle-answer" role="status" aria-live="polite">
        {answer ? <p className="hand">{answer}</p> : <p className="muted">La bola está esperando. No muerde.</p>}
      </div>
      <GameNote>{answer ? 'La pitonisa ha hablado. No se admiten devoluciones.' : 'Pregunta lo que quieras. La bola tiene doce respuestas y ninguna prisa.'}</GameNote>
    </div>
  )
}

export function CajaFuerte() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'locked' | 'open' | 'error'>('locked')
  const timeoutRef = useRef<number | null>(null)
  const touch = useGameTouch('magia', 'caja')
  const { playSfx } = useAudio()

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
  }, [])

  const addDigit = (digit: string) => {
    if (status === 'open' || code.length >= 4) return
    touch()
    playSfx('click')
    setCode((current) => `${current}${digit}`.slice(0, 4))
    setStatus('locked')
  }

  const open = () => {
    touch()
    if (code === '2710') {
      setStatus('open')
      playSfx('chime')
    } else {
      setStatus('error')
      playSfx('click')
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        setCode('')
        setStatus('locked')
      }, 900)
    }
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Una caja fuerte con cuatro cifras y una pista que ya sabes: el día en que empezó todo.</p>
      <div className={cn('safe-box', status === 'open' && 'is-open', status === 'error' && 'is-error')}>
        <div className="safe-door">
          <span className="safe-dial"><Icon name="lock" size={20} /></span>
          <span className="safe-code" aria-live="polite">{code.padEnd(4, '·')}</span>
        </div>
        <div className="safe-hint">
          <p>Pista: 27 de octubre.</p>
          <p className="muted">Día y mes, sin puntos.</p>
        </div>
        <div className="safe-keypad" aria-label="Teclado de la caja fuerte">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button key={digit} type="button" onClick={() => addDigit(digit)} disabled={status === 'open'}>{digit}</button>
          ))}
          <button type="button" onClick={() => { setCode(''); setStatus('locked') }} disabled={status === 'open'} aria-label="Borrar">C</button>
          <button type="button" onClick={() => addDigit('0')} disabled={status === 'open'}>0</button>
          <button type="button" className="keypad-open" onClick={open} disabled={status === 'open' || code.length < 4}>Abrir</button>
        </div>
      </div>
      {status === 'error' ? <p className="form-error" role="alert">No es esa. Piensa en la fecha que nos inventó.</p> : null}
      {status === 'open' ? (
        <GameComplete title="La caja fuerte 2710">
          Dentro no había dinero. Había una promesa: “La próxima fuga la planeo yo. Llevo la llave.”
        </GameComplete>
      ) : null}
      <GameNote>{status === 'open' ? 'Código correcto. La caja estaba guardando una excusa mejor.' : 'La caja no se bloquea. Puedes probar todas las veces que quieras.'}</GameNote>
    </div>
  )
}

type MemoryCard = {
  uid: number
  pairId: string
  symbol: (typeof MEMORY_PAIRS)[number]['symbol']
  label: string
  phrase: string
}

function buildDeck(): MemoryCard[] {
  return shuffle(
    MEMORY_PAIRS.flatMap((pair, pairIndex) =>
      [0, 1].map((copy) => ({
        uid: pairIndex * 2 + copy,
        pairId: pair.id,
        symbol: pair.symbol,
        label: pair.label,
        phrase: pair.phrase,
      })),
    ),
  )
}

export function JuegoMemoria() {
  const [cards, setCards] = useState(buildDeck)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const touch = useGameTouch('magia', 'memoria')
  const { playSfx } = useAudio()
  const complete = matched.length === MEMORY_PAIRS.length

  useEffect(() => {
    if (flipped.length !== 2) return
    const first = cards[flipped[0]]
    const second = cards[flipped[1]]
    if (first.pairId === second.pairId) {
      const nextMatched = [...matched, first.pairId]
      setMatched(nextMatched)
      setFlipped([])
      playSfx(nextMatched.length === MEMORY_PAIRS.length ? 'chime' : 'match')
      return
    }
    const timeout = window.setTimeout(() => {
      setFlipped([])
      playSfx('click')
    }, 780)
    return () => window.clearTimeout(timeout)
  }, [flipped, cards, matched, playSfx])

  const flip = (index: number) => {
    if (flipped.length >= 2 || flipped.includes(index) || matched.includes(cards[index].pairId)) return
    touch()
    playSfx('click')
    setMoves((current) => current + 1)
    setFlipped((current) => [...current, index])
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Seis parejas de circo. Encuéntralas y cada una te dirá algo que ya sabías.</p>
      <div className="memory-grid" aria-label="Cartas de memoria">
        {cards.map((card, index) => {
          const faceUp = flipped.includes(index) || matched.includes(card.pairId)
          return (
            <button
              key={card.uid}
              type="button"
              className={cn('memory-card', faceUp && 'is-face-up', matched.includes(card.pairId) && 'is-matched')}
              onClick={() => flip(index)}
              aria-label={faceUp ? `${card.label}: ${card.phrase}` : 'Carta boca abajo'}
            >
              <span className="memory-front"><Icon name="sparkle" size={22} /></span>
              <span className="memory-back">
                <Icon name={card.symbol} size={26} />
                <span>{card.label}</span>
              </span>
            </button>
          )
        })}
      </div>
      <div className="game-actions">
        <span className="game-score">{matched.length}/6 parejas · {moves} giros</span>
        <Button variant="ghost" onClick={() => { setCards(buildDeck()); setFlipped([]); setMatched([]); setMoves(0) }}>Barajar otra vez</Button>
      </div>
      <GameNote>{complete ? 'Seis parejas. Ninguna se perdió.' : 'Las cartas se giran solas cuando fallas. No hay castigo.'}</GameNote>
      {complete ? (
        <GameComplete title="Memoria de circo">
          Las parejas eran una excusa. Las frases son la verdad.
        </GameComplete>
      ) : null}
    </div>
  )
}

export function CarruselRecuerdos() {
  const [active, setActive] = useState(0)
  const touch = useGameTouch('magia', 'carrusel')
  const { playSfx } = useAudio()
  const memory = CAROUSEL_MEMORIES[active]

  const move = (direction: number) => {
    touch()
    playSfx('click')
    setActive((current) => (current + direction + CAROUSEL_MEMORIES.length) % CAROUSEL_MEMORIES.length)
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Un carrusel sin fotos. Cada vuelta es una tarjeta escrita a mano y una excusa para seguir girando.</p>
      <div className="carousel-stage">
        <div className="carousel-roof" aria-hidden="true">
          <span className="carousel-flag" />
          <span className="carousel-bulbs" />
        </div>
        <div className="carousel-card" key={memory.title}>
          <span className="carousel-icon"><Icon name="carousel" size={34} /></span>
          <p className="eyebrow">Vuelta {active + 1} de {CAROUSEL_MEMORIES.length}</p>
          <h4 className="display">{memory.title}</h4>
          <p>{memory.body}</p>
        </div>
        <div className="carousel-controls">
          <Button variant="ghost" onClick={() => move(-1)} aria-label="Vuelta anterior">Anterior</Button>
          <div className="carousel-dots" aria-hidden="true">
            {CAROUSEL_MEMORIES.map((item, index) => (
              <span key={item.title} className={cn(index === active && 'is-active')} />
            ))}
          </div>
          <Button onClick={() => move(1)}>Siguiente vuelta</Button>
        </div>
      </div>
      <GameNote>Sigue girando: las seis tarjetas están abiertas desde el principio. No hay orden correcto.</GameNote>
      {active === CAROUSEL_MEMORIES.length - 1 ? (
        <GameComplete title="Carrusel de recuerdos">
          La última tarjeta no cierra nada. Solo dice que la lista sigue abierta.
        </GameComplete>
      ) : null}
    </div>
  )
}

export function CasaEspejos() {
  const [opened, setOpened] = useState<number[]>([])
  const touch = useGameTouch('magia', 'espejos')
  const { playSfx } = useAudio()
  const complete = opened.length === MIRRORS.length

  const look = (index: number) => {
    if (opened.includes(index)) return
    setOpened((current) => [...current, index])
    touch()
    playSfx(index === MIRRORS.length - 1 ? 'chime' : 'match')
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Cuatro espejos un poco deformes. Ninguno devuelve tu cara: devuelven una razón.</p>
      <div className="mirror-room">
        {MIRRORS.map((mirror, index) => {
          const isOpen = opened.includes(index)
          return (
            <button
              key={mirror.title}
              type="button"
              className={cn('mirror', isOpen && 'is-open')}
              onClick={() => look(index)}
              aria-label={isOpen ? `${mirror.title}: ${mirror.body}` : `Mirar el espejo ${index + 1}`}
            >
              <span className="mirror-frame">
                <span className="mirror-glass">
                  {isOpen ? <span className="mirror-text">{mirror.body}</span> : <Icon name="mirror" size={32} />}
                </span>
              </span>
              <span className="mirror-title">{isOpen ? mirror.title : `Espejo ${index + 1}`}</span>
            </button>
          )
        })}
      </div>
      <GameNote>{complete ? 'Cuatro espejos y ninguna versión fea de nosotros.' : `${opened.length} de ${MIRRORS.length} espejos abiertos.`}</GameNote>
      {complete ? (
        <GameComplete title="La casa de los espejos">
          Lo que más me gusta no es lo que veo. Es que estés al otro lado.
        </GameComplete>
      ) : null}
    </div>
  )
}
