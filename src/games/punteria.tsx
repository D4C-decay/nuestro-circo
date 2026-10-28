import { useEffect, useState, type CSSProperties } from 'react'
import { BALLOONS, HEARTS, PLATES } from '../content/circus'
import { useAudio } from '../lib/audio'
import { Icon } from '../components/Icons'
import { Button, cn, GameComplete, GameNote } from '../components/UI'
import { useGameTouch } from './shared'

const BALLOON_COLORS = ['#D946EF', '#7C3AED', '#C4B5FD', '#C9A227', '#F6F0FF', '#D946EF']



export function TiroAlBlanco() {
  const [popped, setPopped] = useState<number[]>([])
  const touch = useGameTouch('punteria', 'tiro')
  const { playSfx } = useAudio()

  const pop = (index: number) => {
    if (popped.includes(index)) return
    setPopped((current) => [...current, index])
    touch()
    playSfx(index === BALLOONS.length - 1 ? 'chime' : 'pop')
  }

  const complete = popped.length === BALLOONS.length

  return (
    <div className="game-panel">
      <p className="game-intro">Seis globos, seis palabras. No hay forma de fallar: solo de tardar más en reírte.</p>
      <div className="balloon-grid" aria-label="Globos de feria">
        {BALLOONS.map((word, index) => {
          const isPopped = popped.includes(index)
          return (
            <button
              key={word}
              type="button"
              className={cn('balloon', isPopped && 'is-popped')}
              onClick={() => pop(index)}
              aria-label={isPopped ? `Globo abierto: ${word}` : `Lanzar dardo al globo ${index + 1}`}
              style={{ '--balloon': BALLOON_COLORS[index] } as CSSProperties}
            >
              <span className="balloon-string" aria-hidden="true" />
              <span className="balloon-body">
                {isPopped ? <span className="balloon-word">{word}</span> : <Icon name="target" size={18} />}
              </span>
            </button>
          )
        })}
      </div>
      <GameNote>
        {complete
          ? 'Seis globos menos y una frase que ya sabías.'
          : `${popped.length} de ${BALLOONS.length} globos. Puedes lanzar con calma.`}
      </GameNote>
      {complete ? (
        <GameComplete
          title="Puntería de feria"
          action={<Button variant="ghost" onClick={() => setPopped([])}>Otra ronda</Button>}
        >
          La palabra que más te pega es “Gappy”. Las demás también, pero esa la elegí yo.
        </GameComplete>
      ) : null}
    </div>
  )
}

export function PescaCorazones() {
  const [caught, setCaught] = useState<number[]>([])
  const touch = useGameTouch('punteria', 'pesca')
  const { playSfx } = useAudio()

  const catchHeart = (index: number) => {
    if (caught.includes(index)) return
    setCaught((current) => [...current, index])
    touch()
    playSfx(index === HEARTS.length - 1 ? 'chime' : 'coin')
  }

  const complete = caught.length === HEARTS.length

  return (
    <div className="game-panel">
      <p className="game-intro">El anzuelo es magnético y el estanque es de papel. Toca un corazón para pescarlo.</p>
      <div className="pond">
        <span className="pond-ripple pond-ripple-a" aria-hidden="true" />
        <span className="pond-ripple pond-ripple-b" aria-hidden="true" />
        <div className="heart-pond">
          {HEARTS.map((heart, index) => {
            const isCaught = caught.includes(index)
            return (
              <button
                key={heart}
                type="button"
                className={cn('pond-heart', isCaught && 'is-caught')}
                onClick={() => catchHeart(index)}
                aria-label={isCaught ? `Corazón pescado: ${heart}` : `Pescar corazón ${index + 1}`}
              >
                <Icon name="heart" size={isCaught ? 20 : 26} />
                <span>{isCaught ? heart : `Corazón ${index + 1}`}</span>
              </button>
            )
          })}
        </div>
      </div>
      <GameNote>
        {complete ? 'Seis corazones en el cubo. El estanque se queda sin excusas.' : `${caught.length} de ${HEARTS.length} corazones pescados.`}
      </GameNote>
      {complete ? (
        <GameComplete
          title="Pesca de corazones"
          action={<Button variant="ghost" onClick={() => setCaught([])}>Volver a pescar</Button>}
        >
          Todos los corazones dicen lo mismo de una forma distinta: quédate.
        </GameComplete>
      ) : null}
    </div>
  )
}

export function CuerdaFloja() {
  const [position, setPosition] = useState(0)
  const [stars, setStars] = useState(0)
  const [misses, setMisses] = useState(0)
  const touch = useGameTouch('punteria', 'cuerda')
  const { playSfx } = useAudio()
  const running = stars < 5

  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(() => {
      setPosition((current) => {
        const next = current + 4
        return next > 100 ? 0 : next
      })
    }, 55)
    return () => window.clearInterval(interval)
  }, [running])

  const balance = () => {
    touch()
    if (position >= 38 && position <= 62) {
      setStars((current) => Math.min(5, current + 1))
      playSfx('chime')
    } else {
      setMisses((current) => current + 1)
      playSfx('click')
    }
  }

  const complete = stars >= 5

  return (
    <div className="game-panel">
      <p className="game-intro">El corazón se mueve solo. Pulsa “Equilibrar” cuando pase por la zona dorada.</p>
      <div className="tightrope">
        <div className="tightrope-line" aria-hidden="true" />
        <span className="tightrope-pole tightrope-pole-left" aria-hidden="true" />
        <span className="tightrope-pole tightrope-pole-right" aria-hidden="true" />
        <span className="tightrope-zone" aria-hidden="true" />
        <span className="tightrope-walker" style={{ left: `${position}%` }} aria-hidden="true">
          <Icon name="heart" size={26} />
        </span>
      </div>
      <div className="game-actions">
        <Button icon="balance" onClick={balance} disabled={complete}>Equilibrar</Button>
        <span className="game-score"><Icon name="star" size={14} /> {stars}/5 · {misses} casi</span>
      </div>
      <GameNote>
        {complete ? 'Cinco estrellas y ni una caída de verdad.' : 'No pasa nada si fallas: el corazón se vuelve a subir.'}
      </GameNote>
      {complete ? (
        <GameComplete
          title="Cuerda floja"
          action={<Button variant="ghost" onClick={() => { setStars(0); setMisses(0); setPosition(0) }}>Otra travesía</Button>}
        >
          El truco no era no tambalearse. Era seguir andando con la otra persona al lado.
        </GameComplete>
      ) : null}
    </div>
  )
}

export function TorrePlatos() {
  const [plates, setPlates] = useState(0)
  const [marker, setMarker] = useState(0)
  const [falls, setFalls] = useState(0)
  const touch = useGameTouch('punteria', 'torre')
  const { playSfx } = useAudio()
  const running = plates < 8

  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(() => {
      setMarker((current) => {
        const next = current + 3
        return next > 100 ? 0 : next
      })
    }, 45)
    return () => window.clearInterval(interval)
  }, [running])

  const place = () => {
    touch()
    if (marker >= 34 && marker <= 66) {
      setPlates((current) => Math.min(8, current + 1))
      playSfx('chime')
    } else {
      setFalls((current) => current + 1)
      playSfx('click')
    }
  }

  const complete = plates >= 8

  return (
    <div className="game-panel">
      <p className="game-intro">Ocho platos, una torre y cero vergüenza. Pulsa “Colocar” cuando el marcador esté centrado.</p>
      <div className="plate-stack" aria-live="polite">
        {Array.from({ length: 8 }, (_, index) => (
          <span
            key={index}
            className={cn('plate', index < plates && 'is-placed')}
            style={{ transform: `rotate(${index < plates ? (index % 2 === 0 ? -1.5 : 1.5) : 0}deg)` }}
            aria-hidden="true"
          />
        ))}
        <span className="plate-base" aria-hidden="true" />
      </div>
      <div className="timing-track" aria-hidden="true">
        <span className="timing-zone" />
        <span className="timing-marker" style={{ left: `${marker}%` }} />
      </div>
      <div className="game-actions">
        <Button icon="plates" onClick={place} disabled={complete}>Colocar plato</Button>
        <span className="game-score">{plates}/8 · {falls} tambaleos</span>
      </div>
      <GameNote>{complete ? PLATES[7] : PLATES[Math.min(plates, PLATES.length - 1)]}</GameNote>
      {complete ? (
        <GameComplete
          title="Torre de platos"
          action={<Button variant="ghost" onClick={() => { setPlates(0); setFalls(0); setMarker(0) }}>Otra torre</Button>}
        >
          No se cayó nada. Bueno, casi. Y eso también cuenta.
        </GameComplete>
      ) : null}
    </div>
  )
}

export function MedidorFuerza() {
  const [strength, setStrength] = useState(0)
  const [holding, setHolding] = useState(false)
  const [tries, setTries] = useState(0)
  const touch = useGameTouch('punteria', 'medidor')
  const { playSfx } = useAudio()
  const complete = strength >= 100

  useEffect(() => {
    if (!holding || complete) return
    const interval = window.setInterval(() => {
      setStrength((current) => Math.min(100, current + 4))
    }, 40)
    return () => window.clearInterval(interval)
  }, [holding, complete])

  useEffect(() => {
    if (!complete) return
    setHolding(false)
    playSfx('chime')
    touch()
  }, [complete, playSfx, touch])

  const release = () => {
    setHolding(false)
    if (strength > 0 && strength < 100) {
      setTries((current) => current + 1)
      playSfx('click')
      setStrength(0)
    }
  }

  const reset = () => {
    setStrength(0)
    setTries(0)
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Mantén pulsado el mazo hasta que la campana se rinda. No hay fuerza pequeña, solo mazos impacientes.</p>
      <div className="strength-machine">
        <div className="strength-top">
          <Icon name="hammer" size={34} />
          <span className="strength-bell"><Icon name="bell" size={26} /></span>
        </div>
        <div className="strength-track">
          <span className="strength-fill" style={{ height: `${strength}%` }} />
          <span className="strength-label">{strength}%</span>
        </div>
        <div className="strength-ticks" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => <span key={index} />)}
        </div>
      </div>
      <div className="game-actions">
        <button
          type="button"
          className={cn('hold-button', holding && 'is-holding')}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            setHolding(true)
            touch()
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={(event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault()
              setHolding(true)
              touch()
            }
          }}
          onKeyUp={(event) => {
            if (event.key === ' ' || event.key === 'Enter') release()
          }}
          disabled={complete}
        >
          <Icon name="hammer" size={22} />
          {complete ? 'Campana' : 'Mantener'}
        </button>
        <span className="game-score">{tries} intentos</span>
      </div>
      <GameNote>{complete ? 'La campana sonó. El medidor no sabe medir otra cosa.' : 'Suelta antes de llegar arriba y el mazo se enfada.'}</GameNote>
      {complete ? (
        <GameComplete
          title="El medidor de fuerza"
          action={<Button variant="ghost" onClick={reset}>Otra vez</Button>}
        >
          Intenté medir lo que te quiero. Se rompió el medidor. La campana sigue sonando.
        </GameComplete>
      ) : null}
    </div>
  )
}

