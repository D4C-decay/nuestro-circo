import { useRef, useState } from 'react'
import { COUPLE } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Bulbs, Button, cn } from './UI'
import { Icon } from './Icons'

export function Entry({ onEnter }: { onEnter: () => void }) {
  const [opening, setOpening] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const { enableMusic, playSfx } = useAudio()
  const { totalStamps } = useProgress()

  const enter = (withMusic: boolean) => {
    if (opening) return
    setOpening(true)
    playSfx('click')
    if (withMusic) enableMusic()
    timeoutRef.current = window.setTimeout(() => {
      onEnter()
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }, 1050)
  }

  return (
    <div className={cn('entry', opening && 'is-opening')}>
      <div className="entry-curtain entry-curtain-left" aria-hidden="true" />
      <div className="entry-curtain entry-curtain-right" aria-hidden="true" />

      <div className="entry-stage">
        <Bulbs count={16} className="entry-bulbs" />
        <p className="eyebrow entry-eyebrow">Función única · {COUPLE.date}</p>
        <div className="entry-poster">
          <span className="poster-eyelet" aria-hidden="true" />
          <Icon name="tent" size={44} className="entry-tent" />
          <h1 className="display entry-title">
            El Gran Circo
            <span>de los Dos</span>
          </h1>
          <p className="hand entry-hand">Una función privada para {COUPLE.her}.</p>
          <div className="entry-ticket">
            <div className="ticket-stub">
              <span>Palco</span>
              <strong>A &amp; E</strong>
            </div>
            <div className="ticket-main">
              <span className="ticket-label">Entrada de favor</span>
              <span className="ticket-name">{COUPLE.her} &amp; {COUPLE.him}</span>
              <span className="ticket-meta">Sin fotos · Solo papel, luces y memoria</span>
            </div>
          </div>
          <div className="entry-actions">
            <Button icon="music" onClick={() => enter(true)}>
              Entrar con música
            </Button>
            <Button variant="ghost" onClick={() => enter(false)}>
              Entrar en silencio
            </Button>
          </div>
          {totalStamps > 0 ? (
            <p className="entry-return">
              <Icon name="ticket" size={14} /> Ya tienes {totalStamps} sellos. Puedes volver a entrar.
            </p>
          ) : (
            <p className="entry-return">Dentro te esperan tres funciones que solo nosotros vimos.</p>
          )}
        </div>
        <p className="entry-foot">Hecho a mano, sin prisa. Mejor con los altavoces puestos.</p>
      </div>

      <div className="entry-glow" aria-hidden="true" />
    </div>
  )
}
