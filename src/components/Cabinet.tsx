import { useState } from 'react'
import { CURIOSITIES, FUNCTIONS, type FunctionStory } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Icon } from './Icons'
import { Button, cn, Divider, Modal, SectionHeading, StampBadge } from './UI'

type Curiosity = (typeof CURIOSITIES)[number]

type ActiveItem =
  | { kind: 'function'; item: FunctionStory }
  | { kind: 'curiosity'; item: Curiosity }

export function Cabinet() {
  const [active, setActive] = useState<ActiveItem | null>(null)
  const { cabinet, markCabinet } = useProgress()
  const { playSfx } = useAudio()

  const openFunction = (item: FunctionStory) => {
    setActive({ kind: 'function', item })
    markCabinet(item.id)
    playSfx('click')
  }

  const openCuriosity = (item: Curiosity) => {
    setActive({ kind: 'curiosity', item })
    markCabinet(item.id)
    playSfx('click')
  }

  const openedFunctions = cabinet.filter((id) => FUNCTIONS.some((story) => story.id === id)).length

  return (
    <section className="section cabinet-section" id="gabinete" aria-labelledby="gabinete-title">
      <SectionHeading
        kicker="Acto primero · La vitrina"
        title="El gabinete de Gappy"
        lede="Seis objetos, tres funciones privadas y una regla: aquí no hay fotos. Solo las cosas que nos pasaron y las que todavía nos deben pasar."
        id="gabinete-title"
      />

      <div className="cabinet-head">
        <div className="cabinet-rule">
          <Icon name="lock" size={16} />
          <span>{openedFunctions}/3 funciones privadas abiertas</span>
        </div>
        <StampBadge tone="violet" locked={openedFunctions < 3}>
          {openedFunctions < 3 ? 'Sello pendiente' : 'Sello conseguido'}
        </StampBadge>
      </div>

      <div className="cabinet-stage">
        <div className="cabinet-shelf shelf-top" aria-hidden="true" />
        <div className="cabinet-grid">
          {FUNCTIONS.map((item, index) => {
            const opened = cabinet.includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                className={cn('cabinet-object cabinet-function', opened && 'is-opened')}
                onClick={() => openFunction(item)}
              >
                <span className="cabinet-number">0{index + 1}</span>
                <span className="cabinet-icon"><Icon name={item.icon} size={36} /></span>
                <span className="cabinet-object-title">{item.object}</span>
                <span className="cabinet-object-kicker">{item.kicker}</span>
                <span className="cabinet-open">{opened ? 'Volver a abrir' : 'Abrir la función'} <Icon name="arrow" size={14} /></span>
              </button>
            )
          })}
        </div>

        <Divider label="Tres curiosidades menores" />

        <div className="cabinet-curiosities">
          {CURIOSITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn('cabinet-object cabinet-curiosity', cabinet.includes(item.id) && 'is-opened')}
              onClick={() => openCuriosity(item)}
            >
              <span className="cabinet-icon"><Icon name={item.icon} size={24} /></span>
              <span className="cabinet-object-title">{item.title}</span>
              <span className="cabinet-open">Ver ficha <Icon name="arrow" size={13} /></span>
            </button>
          ))}
        </div>
      </div>

      {active ? (
        <Modal
          kicker={active.kind === 'function' ? active.item.kicker : 'Curiosidad de la vitrina'}
          title={active.kind === 'function' ? active.item.title : active.item.title}
          onClose={() => setActive(null)}
          wide={active.kind === 'function'}
        >
          <div className={cn('cabinet-card', active.kind === 'function' && 'cabinet-card-function')}>
            <div className="cabinet-card-icon">
              <Icon name={active.item.icon} size={48} />
            </div>
            {active.kind === 'function' ? (
              <>
                <p className="eyebrow">{active.item.object}</p>
                <div className="prose">
                  {active.item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <blockquote className="hand cabinet-note">{active.item.note}</blockquote>
              </>
            ) : (
              <>
                <div className="prose">
                  <p>{active.item.body}</p>
                </div>
                <p className="hand cabinet-note">{active.item.note}</p>
              </>
            )}
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setActive(null)}>Cerrar la ficha</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </section>
  )
}
