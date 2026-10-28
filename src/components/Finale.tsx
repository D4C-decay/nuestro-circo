import { useState } from 'react'
import { FINAL_OPTIONS, STAMPS } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Icon } from './Icons'
import { Bulbs, Button, cn, GameNote, SectionHeading, StampBadge } from './UI'
import { Confetti } from './Confetti'

export function Finale() {
  const { finale, setFinale, awardStamp, totalStamps, allStamps } = useProgress()
  const { playSfx } = useAudio()
  const [burst, setBurst] = useState(0)

  const choose = (answer: string) => {
    if (finale) return
    setFinale(answer)
    awardStamp('final')
    playSfx('confetti')
    setBurst((current) => current + 1)
  }

  return (
    <section className="section finale-section" id="final" aria-labelledby="final-title">
      <Confetti run={burst} />
      <SectionHeading
        kicker="Acto final · La gran función"
        title="La última entrada"
        lede="No hay truco final ni fuegos artificiales obligatorios. Solo una pregunta que llevaba toda la noche esperando."
        id="final-title"
      />

      <div className="finale-stage">
        <div className="finale-curtain finale-curtain-left" aria-hidden="true" />
        <div className="finale-curtain finale-curtain-right" aria-hidden="true" />
        <div className="finale-spotlight" aria-hidden="true" />
        <Bulbs count={14} className="finale-bulbs" />

        <div className="finale-ring">
          <span className="finale-icon"><Icon name="tent" size={42} /></span>
          <p className="eyebrow">Función única para dos</p>
          <h3 className="display finale-question">¿Me guardas la última entrada?</h3>
          <p className="finale-copy">
            Tres funciones privadas, quince puestos, siete sellos y todas las reposiciones que quieras.
            La respuesta no cierra nada: solo decide con qué plan seguimos.
          </p>

          {!finale ? (
            <div className="finale-options">
              {FINAL_OPTIONS.map((option, index) => (
                <Button key={option} variant={index === 0 ? 'primary' : 'gold'} icon={index === 0 ? 'heart' : 'popcorn'} onClick={() => choose(option)}>
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="finale-answer" role="status" aria-live="polite">
              <span className="finale-stamp"><Icon name="check" size={26} /></span>
              <p className="hand finale-choice">“{finale}”</p>
              <p>Respuesta guardada. El circo no cierra: cambia de función.</p>
            </div>
          )}

          <div className="finale-meta">
            <StampBadge tone={allStamps ? 'gold' : 'violet'} locked={!allStamps}>
              {allStamps ? 'Pasaporte completo · P.D. desbloqueada' : `${totalStamps}/${STAMPS.length} sellos`}
            </StampBadge>
            <a className={cn('btn', 'btn-ghost', 'finale-link')} href="#carta">
              <Icon name="heart" size={18} />
              <span>Volver a la carta</span>
            </a>
          </div>
        </div>
      </div>

      <GameNote>
        {finale
          ? 'Puedes volver a la feria cuando quieras. La última entrada no caduca.'
          : 'Elige sin prisa. Las dos respuestas son un sí.'}
      </GameNote>
    </section>
  )
}
