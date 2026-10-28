import { useEffect, useRef, useState } from 'react'
import {
  BINGO_LINES,
  BINGO_MOMENTS,
  POPCORN_NOTES,
  POSTCARD_EXTRAS,
  POSTCARD_FRAMES,
  POSTCARD_HATS,
  WISHES,
} from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Icon } from '../components/Icons'
import { Button, cn, GameComplete, GameNote } from '../components/UI'
import { useGameTouch } from './shared'

export function MaquinaPalomitas() {
  const [popped, setPopped] = useState<number[]>([])
  const [lastNote, setLastNote] = useState('')
  const touch = useGameTouch('dulces', 'palomitas')
  const { playSfx } = useAudio()
  const complete = popped.length === POPCORN_NOTES.length

  const pop = (index: number) => {
    if (popped.includes(index)) return
    setPopped((current) => [...current, index])
    setLastNote(POPCORN_NOTES[index])
    touch()
    playSfx(index === POPCORN_NOTES.length - 1 ? 'chime' : 'pop')
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Doce granos, doce notitas. Pulsa los que estén más inquietos.</p>
      <div className="popcorn-machine">
        <div className="popcorn-kernels" aria-label="Granos de palomitas">
          {POPCORN_NOTES.map((_, index) => (
            <button
              key={index}
              type="button"
              className={cn('kernel', popped.includes(index) && 'is-popped')}
              onClick={() => pop(index)}
              aria-label={popped.includes(index) ? `Nota ${index + 1} abierta` : `Hacer explotar el grano ${index + 1}`}
            >
              {popped.includes(index) ? <Icon name="sparkle" size={13} /> : ''}
            </button>
          ))}
        </div>
        <div className="popcorn-bucket" aria-hidden="true">
          <span className="popcorn-fill" style={{ height: `${(popped.length / POPCORN_NOTES.length) * 100}%` }} />
          <span className="popcorn-stripes" />
          <Icon name="popcorn" size={42} />
        </div>
      </div>
      <div className="popcorn-note" role="status" aria-live="polite">
        {lastNote ? <p className="hand">{lastNote}</p> : <p className="muted">El cubo está vacío. Eso nunca dura mucho.</p>}
      </div>
      <GameNote>{complete ? 'Doce notas y el cubo lleno. Ya podemos empezar la película.' : `${popped.length} de ${POPCORN_NOTES.length} granos.`}</GameNote>
      {complete ? (
        <GameComplete title="Máquina de palomitas" action={<Button variant="ghost" onClick={() => { setPopped([]); setLastNote('') }}>Otra tanda</Button>}>
          La última nota no era una nota. Era una excusa para quedarnos hasta los créditos.
        </GameComplete>
      ) : null}
    </div>
  )
}

const BINGO_GROUPS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function completedLines(marked: number[]) {
  return BINGO_GROUPS.map((group, index) => (group.every((cell) => marked.includes(cell)) ? index : -1)).filter((index) => index >= 0)
}

export function BingoGappy() {
  const [marked, setMarked] = useState<number[]>([])
  const [lines, setLines] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const touch = useGameTouch('dulces', 'bingo')
  const { playSfx } = useAudio()
  const { setBingoLines } = useProgress()
  const complete = marked.length === BINGO_MOMENTS.length

  const mark = (index: number) => {
    if (marked.includes(index)) return
    const nextMarked = [...marked, index]
    const nextLines = completedLines(nextMarked)
    const newLines = nextLines.filter((line) => !lines.includes(line))
    setMarked(nextMarked)
    setLines(nextLines)
    setBingoLines(nextLines)
    touch()
    if (newLines.length > 0) {
      setMessage(BINGO_LINES[newLines[0] % BINGO_LINES.length])
      playSfx(nextMarked.length === BINGO_MOMENTS.length ? 'chime' : 'match')
    } else {
      playSfx('click')
    }
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Nueve momentos. Marca los que ya pasaron. No hay cartón falso: todos los caminos llevan a nosotros.</p>
      <div className="bingo-board">
        {BINGO_MOMENTS.map((moment, index) => (
          <button
            key={moment}
            type="button"
            className={cn('bingo-cell', marked.includes(index) && 'is-marked')}
            onClick={() => mark(index)}
            aria-pressed={marked.includes(index)}
          >
            <span className="bingo-mark" aria-hidden="true">{marked.includes(index) ? <Icon name="heart" size={16} /> : ''}</span>
            <span>{moment}</span>
          </button>
        ))}
      </div>
      <div className="game-actions">
        <span className="game-score">{marked.length}/9 · {lines.length} líneas</span>
        <Button variant="ghost" onClick={() => { setMarked([]); setLines([]); setMessage(''); setBingoLines([]) }}>Nuevo cartón</Button>
      </div>
      {message ? <p className="bingo-message hand" role="status" aria-live="polite">{message}</p> : null}
      <GameNote>{complete ? 'Cartón lleno. Era imposible perder, pero da gusto ganar contigo.' : 'No hay líneas obligatorias. Marca a tu ritmo.'}</GameNote>
      {complete ? <GameComplete title="Bingo de Gappy">Nueve momentos y todavía nos faltan casillas para llenar.</GameComplete> : null}
    </div>
  )
}

export function PozoDeseos() {
  const { wish: savedWish, setWish: saveWish } = useProgress()
  const [wish, setWish] = useState(savedWish ?? '')
  const [throwing, setThrowing] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const touch = useGameTouch('dulces', 'pozo')
  const { playSfx } = useAudio()

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
  }, [])

  const throwCoin = () => {
    if (throwing) return
    setThrowing(true)
    touch()
    playSfx('coin')
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      const next = WISHES[Math.floor(Math.random() * WISHES.length)]
      setWish(next)
      saveWish(next)
      setThrowing(false)
      playSfx('chime')
    }, 900)
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Una moneda, un pozo y un deseo que no hace falta decir en voz alta.</p>
      <div className={cn('wishing-well', throwing && 'is-throwing')}>
        <div className="well-water" aria-hidden="true">
          <span className="well-ripple well-ripple-a" />
          <span className="well-ripple well-ripple-b" />
          <span className="well-coin"><Icon name="coin" size={22} /></span>
        </div>
        <div className="well-bricks" aria-hidden="true" />
        <div className="well-arch" aria-hidden="true"><Icon name="well" size={54} /></div>
      </div>
      <div className="game-actions">
        <Button icon="coin" onClick={throwCoin} disabled={throwing}>{throwing ? 'Cayendo…' : 'Lanzar una moneda'}</Button>
      </div>
      <div className="wish-result" role="status" aria-live="polite">
        {wish ? <p className="hand">{wish}</p> : <p className="muted">El pozo escucha. No promete devolver la moneda.</p>}
      </div>
      <GameNote>{wish ? 'Deseo guardado. El pozo no se lo cuenta a nadie.' : 'Puedes pedir más de uno. El pozo es generoso con las tonterías.'}</GameNote>
      {wish ? <GameComplete title="El pozo de los deseos">Ya está. Ahora hay que hacer la parte de cumplirlo.</GameComplete> : null}
    </div>
  )
}

type Hat = (typeof POSTCARD_HATS)[number]
type Extra = (typeof POSTCARD_EXTRAS)[number]
type Frame = (typeof POSTCARD_FRAMES)[number]

function PostcardArt({ hat, extra, frame }: { hat: Hat; extra: Extra; frame: Frame }) {
  return (
    <svg viewBox="0 0 900 1200" role="img" aria-label={`Postal de papel de Gappy y Eddy, con ${hat.toLowerCase()}, ${extra.toLowerCase()} y marco de ${frame.toLowerCase()}`}>
      <rect width="900" height="1200" fill="#170a22" />
      <rect x="30" y="30" width="840" height="1140" rx="24" fill="#24102F" stroke="#C9A227" strokeWidth="4" />
      {frame === 'Estrellas' ? (
        <g fill="#C4B5FD">
          {Array.from({ length: 34 }, (_, index) => {
            const x = 55 + ((index * 137) % 790)
            const y = 55 + ((index * 233) % 1080)
            return <circle key={index} cx={x} cy={y} r={index % 4 === 0 ? 4 : 2} opacity={0.55} />
          })}
        </g>
      ) : null}
      {frame === 'Bombillas' ? (
        <g fill="#F6F0FF">
          {Array.from({ length: 16 }, (_, index) => (
            <circle key={index} cx={70 + index * 50} cy={72} r={5} opacity={index % 2 ? 0.45 : 0.9} />
          ))}
          {Array.from({ length: 16 }, (_, index) => (
            <circle key={`b-${index}`} cx={70 + index * 50} cy={1128} r={5} opacity={index % 2 ? 0.9 : 0.45} />
          ))}
        </g>
      ) : null}
      {frame === 'Cortinas' ? (
        <g>
          <path d="M30 30h170c-30 150-30 990 0 1140H30V30Z" fill="#3B155C" opacity="0.8" />
          <path d="M870 30H700c30 150 30 990 0 1140h170V30Z" fill="#3B155C" opacity="0.8" />
          <path d="M30 30h840v40H30z" fill="#7C3AED" opacity="0.65" />
        </g>
      ) : null}

      <text x="450" y="155" textAnchor="middle" fill="#C4B5FD" fontFamily="Georgia, serif" fontSize="24" letterSpacing="7">EL GRAN CIRCO</text>
      <text x="450" y="205" textAnchor="middle" fill="#F6F0FF" fontFamily="Georgia, serif" fontSize="46" letterSpacing="4">DE LOS DOS</text>
      <line x1="190" y1="245" x2="710" y2="245" stroke="#C9A227" strokeWidth="2" />

      <g transform="translate(0, 40)">
        <circle cx="350" cy="580" r="128" fill="#F6F0FF" opacity="0.95" />
        <circle cx="310" cy="560" r="24" fill="#170a22" opacity="0.85" />
        <circle cx="392" cy="560" r="24" fill="#170a22" opacity="0.85" />
        <path d="M320 635c20 22 62 22 82 0" stroke="#170a22" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M225 760c10-110 65-155 125-155s115 45 125 155l18 220H207l18-220Z" fill="#7C3AED" />
        <path d="M270 660c-34 42-45 92-40 145" stroke="#C4B5FD" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M430 660c34 42 45 92 40 145" stroke="#C4B5FD" strokeWidth="10" fill="none" strokeLinecap="round" />

        <circle cx="575" cy="580" r="128" fill="#F6F0FF" opacity="0.95" />
        <circle cx="535" cy="560" r="24" fill="#170a22" opacity="0.85" />
        <circle cx="617" cy="560" r="24" fill="#170a22" opacity="0.85" />
        <path d="M545 635c20 22 62 22 82 0" stroke="#170a22" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M450 760c10-110 65-155 125-155s115 45 125 155l18 220H432l18-220Z" fill="#D946EF" />
        <path d="M495 660c-34 42-45 92-40 145" stroke="#F6F0FF" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M655 660c34 42 45 92 40 145" stroke="#F6F0FF" strokeWidth="10" fill="none" strokeLinecap="round" />

        {hat === 'Copa' ? (
          <g fill="#170a22">
            <rect x="510" y="390" width="130" height="90" rx="8" />
            <rect x="480" y="470" width="190" height="22" rx="8" />
            <rect x="510" y="405" width="130" height="18" fill="#C9A227" />
          </g>
        ) : null}
        {hat === 'Corona' ? (
          <path d="M500 470l20-95 45 48 35-78 35 78 45-48 20 95Z" fill="#C9A227" />
        ) : null}
        {hat === 'Lazo' ? (
          <g fill="#D946EF">
            <path d="M575 440c-50-42-80-12-58 22 14 20 38 22 58 6Z" />
            <path d="M575 440c50-42 80-12 58 22-14 20-38 22-58 6Z" />
            <circle cx="575" cy="454" r="12" fill="#F6F0FF" />
          </g>
        ) : null}

        {extra === 'Pajarita' ? (
          <g fill="#C9A227">
            <path d="M520 720l-60-28v56l60-28Z" />
            <path d="M630 720l60-28v56l-60-28Z" />
            <circle cx="575" cy="720" r="12" fill="#F6F0FF" />
          </g>
        ) : null}
        {extra === 'Gafas de corazón' ? (
          <g fill="none" stroke="#D946EF" strokeWidth="8">
            <path d="M518 560c12-16 44-16 56 0M602 560c12-16 44-16 56 0M574 562h28" />
          </g>
        ) : null}
        {extra === 'Bigote de papel' ? (
          <path d="M520 645c20-24 42-24 55-2 13-22 35-22 55 2-20 18-43 20-55 2-12 18-35 16-55-2Z" fill="#170a22" />
        ) : null}
      </g>

      <text x="450" y="1020" textAnchor="middle" fill="#F6F0FF" fontFamily="Georgia, serif" fontSize="42" letterSpacing="4">GAPPY &amp; EDDY</text>
      <text x="450" y="1070" textAnchor="middle" fill="#C4B5FD" fontFamily="Georgia, serif" fontSize="21" letterSpacing="5">FUNCIÓN ÚNICA · 27.10.2024</text>
      <text x="450" y="1120" textAnchor="middle" fill="#C9A227" fontFamily="Georgia, serif" fontSize="17" letterSpacing="3">SIN FOTOS · SOLO PAPEL Y MEMORIA</text>
    </svg>
  )
}

export function FotomatonPapel() {
  const [hat, setHat] = useState<Hat>('Copa')
  const [extra, setExtra] = useState<Extra>('Pajarita')
  const [frame, setFrame] = useState<Frame>('Bombillas')
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState('')
  const svgRef = useRef<SVGSVGElement>(null)
  const touch = useGameTouch('dulces', 'fotomatón')
  const { playSfx } = useAudio()

  const download = async () => {
    if (!svgRef.current) return
    touch()
    playSfx('camera')
    try {
      const clone = svgRef.current.cloneNode(true) as SVGSVGElement
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      const xml = new XMLSerializer().serializeToString(clone)
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const image = new Image()
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('No se pudo dibujar la postal'))
        image.src = url
      })
      const canvas = document.createElement('canvas')
      canvas.width = 900
      canvas.height = 1200
      const context = canvas.getContext('2d')
      if (!context) throw new Error('No hay lienzo')
      context.drawImage(image, 0, 0)
      URL.revokeObjectURL(url)
      const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!png) throw new Error('No se pudo crear el PNG')
      const downloadUrl = URL.createObjectURL(png)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'postal-gappy-eddy.png'
      link.click()
      URL.revokeObjectURL(downloadUrl)
      setDownloaded(true)
      setError('')
      playSfx('chime')
    } catch {
      setError('No se pudo descargar la postal. Prueba otra vez.')
    }
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Un fotomatón sin fotos: eliges los papeles y sale una postal con los dos. Prometido que no hay cámara.</p>
      <div className="photobooth">
        <div className="photobooth-preview">
          <svg ref={svgRef} viewBox="0 0 900 1200" width="900" height="1200" aria-hidden="true">
            <PostcardArt hat={hat} extra={extra} frame={frame} />
          </svg>
        </div>
        <div className="photobooth-controls">
          <label>
            <span>Sombrero</span>
            <select value={hat} onChange={(event) => setHat(event.target.value as Hat)}>
              {POSTCARD_HATS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Complemento</span>
            <select value={extra} onChange={(event) => setExtra(event.target.value as Extra)}>
              {POSTCARD_EXTRAS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Marco</span>
            <select value={frame} onChange={(event) => setFrame(event.target.value as Frame)}>
              {POSTCARD_FRAMES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <Button icon="camera" onClick={download}>Descargar postal PNG</Button>
          {downloaded ? <p className="form-success">Postal descargada. Si sale movida, es culpa del papel.</p> : null}
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </div>
      </div>
      <GameNote>La postal se genera en tu navegador. No se sube nada a ningún sitio.</GameNote>
      {downloaded ? <GameComplete title="Fotomatón de papel">Ya tienes una postal sin fotos. La memoria hace el resto.</GameComplete> : null}
    </div>
  )
}

export function TresVasos() {
  const [round, setRound] = useState(0)
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 3))
  const [picked, setPicked] = useState<number | null>(null)
  const [wins, setWins] = useState(0)
  const [message, setMessage] = useState('Elige un vaso. El corazón se esconde donde le da la gana.')
  const touch = useGameTouch('dulces', 'vasos')
  const { playSfx } = useAudio()
  const complete = round >= 3

  const pick = (index: number) => {
    if (picked !== null || complete) return
    setPicked(index)
    touch()
    if (index === target) {
      setWins((current) => current + 1)
      setMessage('Ahí estaba. Se deja querer.')
      playSfx('match')
    } else {
      setMessage('No era ese. Pero el corazón sigue en la mesa.')
      playSfx('click')
    }
  }

  const next = () => {
    if (round >= 2) {
      setRound(3)
      playSfx('chime')
      return
    }
    setRound((current) => current + 1)
    setTarget(Math.floor(Math.random() * 3))
    setPicked(null)
    setMessage('Otra ronda. Los vasos se han movido un poco.')
    playSfx('click')
  }

  return (
    <div className="game-panel">
      <p className="game-intro">Tres vasos, un corazón y ninguna trampa. Bueno, una pequeña: el corazón siempre está debajo de uno.</p>
      <div className={cn('cups-game', picked !== null && 'is-revealed')}>
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            type="button"
            className={cn('cup', picked === index && 'is-picked', picked !== null && index === target && 'is-target')}
            onClick={() => pick(index)}
            disabled={picked !== null || complete}
            aria-label={`Elegir vaso ${index + 1}`}
          >
            <span className="cup-body" aria-hidden="true" />
            <span className="cup-heart" aria-hidden="true">{picked !== null && index === target ? <Icon name="heart" size={28} /> : ''}</span>
            <span className="cup-number">{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="game-actions">
        <span className="game-score">Ronda {Math.min(round + 1, 3)} de 3 · {wins} aciertos</span>
        <Button onClick={next} disabled={picked === null}>
          {round >= 2 ? 'Terminar' : 'Siguiente ronda'}
        </Button>
      </div>
      <p className="hand bingo-message" role="status" aria-live="polite">{message}</p>
      <GameNote>{complete ? 'Tres rondas y el corazón sigue apareciendo. A veces debajo del vaso, siempre en la misma mesa.' : 'No hay vidas ni tiempo. Solo tres intentos de encontrarlo.'}</GameNote>
      {complete ? (
        <GameComplete title="Los tres vasos" action={<Button variant="ghost" onClick={() => { setRound(0); setPicked(null); setWins(0); setTarget(Math.floor(Math.random() * 3)); setMessage('Otra vez. El corazón se ha vuelto a esconder.') }}>Otra ronda</Button>}>
          {wins === 3 ? 'Tres de tres. Se nota que me conoces.' : 'No importa cuántos acertaste: el corazón se queda.'}
        </GameComplete>
      ) : null}
    </div>
  )
}
