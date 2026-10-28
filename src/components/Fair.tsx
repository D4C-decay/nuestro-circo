import { useState, type ComponentType, type CSSProperties } from 'react'
import { SALAS, STAMPS, type SalaId } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { BingoGappy, FotomatonPapel, MaquinaPalomitas, PozoDeseos, TresVasos } from '../games/dulces'
import {
  CajaFuerte,
  CarruselRecuerdos,
  CasaEspejos,
  JuegoMemoria,
  Pitonisa,
} from '../games/magia'
import {
  CuerdaFloja,
  MedidorFuerza,
  PescaCorazones,
  TiroAlBlanco,
  TorrePlatos,
} from '../games/punteria'
import { Icon, type IconName } from './Icons'
import { Button, cn, Modal, SectionHeading, StampBadge } from './UI'

type Booth = {
  id: string
  name: string
  blurb: string
  icon: IconName
  Game: ComponentType
}

const BOOTHS: Record<SalaId, Booth[]> = {
  punteria: [
    { id: 'tiro', name: 'Tiro al blanco', blurb: 'Seis globos, seis palabras, cero posibilidad de fallar.', icon: 'target', Game: TiroAlBlanco },
    { id: 'pesca', name: 'Pesca de corazones', blurb: 'Un anzuelo magnético y un estanque de papel.', icon: 'fish', Game: PescaCorazones },
    { id: 'cuerda', name: 'La cuerda floja', blurb: 'Equilibrio, estrellas y ninguna caída real.', icon: 'balance', Game: CuerdaFloja },
    { id: 'torre', name: 'Torre de platos', blurb: 'Ocho platos y una torre que se tambalea.', icon: 'plates', Game: TorrePlatos },
    { id: 'medidor', name: 'El medidor de fuerza', blurb: 'Una campana que no sabe medir lo que sientes.', icon: 'hammer', Game: MedidorFuerza },
  ],
  magia: [
    { id: 'pitonisa', name: 'La pitonisa', blurb: 'Doce predicciones y ninguna devolución.', icon: 'crystal', Game: Pitonisa },
    { id: 'caja', name: 'La caja fuerte 2710', blurb: 'Cuatro cifras y una fecha que ya sabes.', icon: 'safe', Game: CajaFuerte },
    { id: 'memoria', name: 'Juego de memoria', blurb: 'Seis parejas de circo y seis frases escondidas.', icon: 'cards', Game: JuegoMemoria },
    { id: 'carrusel', name: 'Carrusel de recuerdos', blurb: 'Tarjetas de texto, sin fotos, con vueltas.', icon: 'carousel', Game: CarruselRecuerdos },
    { id: 'espejos', name: 'La casa de los espejos', blurb: 'Cuatro espejos que devuelven razones.', icon: 'mirror', Game: CasaEspejos },
  ],
  dulces: [
    { id: 'palomitas', name: 'Máquina de palomitas', blurb: 'Doce granos y doce notitas para la película.', icon: 'popcorn', Game: MaquinaPalomitas },
    { id: 'bingo', name: 'Bingo de Gappy', blurb: 'Nueve momentos y un cartón que siempre gana.', icon: 'bingo', Game: BingoGappy },
    { id: 'pozo', name: 'El pozo de los deseos', blurb: 'Una moneda, un deseo y ondas de papel.', icon: 'well', Game: PozoDeseos },
    { id: 'fotomatón', name: 'Fotomatón de papel', blurb: 'Una postal ilustrada, descargable y sin cámara.', icon: 'camera', Game: FotomatonPapel },
    { id: 'vasos', name: 'Los tres vasos', blurb: 'Tres rondas buscando el corazón escondido.', icon: 'cups', Game: TresVasos },
  ],
}

export function Fair() {
  const [sala, setSala] = useState<SalaId>('punteria')
  const [active, setActive] = useState<{ sala: SalaId; booth: Booth } | null>(null)
  const { played, stamps, gold } = useProgress()
  const { playSfx } = useAudio()

  const meta = SALAS[sala]
  const playedInSala = played.filter((id) => id.startsWith(`${sala}:`))
  const stamp = STAMPS.find((item) => item.id === meta.stamp)
  const hasStamp = stamps.includes(meta.stamp)
  const hasGold = gold.includes(sala)

  const openBooth = (booth: Booth) => {
    setActive({ sala, booth })
    playSfx('click')
  }

  return (
    <section className="section fair-section" id="feria" aria-labelledby="feria-title">
      <SectionHeading
        kicker="Acto segundo · La feria"
        title="La feria de los recuerdos"
        lede="Tres salas, quince puestos y ninguna prisa. Puedes jugar a todo o quedarte en el que te haga reír. La carta no se cierra por nadie."
        id="feria-title"
      />

      <div className="sala-tabs" role="tablist" aria-label="Salas de la feria">
        {(Object.keys(SALAS) as SalaId[]).map((id) => {
          const item = SALAS[id]
          const count = played.filter((entry) => entry.startsWith(`${id}:`)).length
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={sala === id}
              className={cn('sala-tab', sala === id && 'is-active')}
              onClick={() => { setSala(id); playSfx('click') }}
              style={{ '--sala-color': item.color } as CSSProperties}
            >
              <span className="sala-tab-kicker">{item.kicker}</span>
              <span className="sala-tab-name">{item.name}</span>
              <span className="sala-tab-count">{count}/5</span>
            </button>
          )
        })}
      </div>

      <div className="sala-panel" role="tabpanel">
        <div className="sala-head">
          <div>
            <p className="eyebrow" style={{ color: meta.color }}>{meta.kicker}</p>
            <h3 className="display sala-title">{meta.name}</h3>
            <p className="sala-description">{meta.description}</p>
          </div>
          <div className="sala-stamp-box">
            <StampBadge tone={hasGold ? 'gold' : 'violet'} locked={!hasStamp}>
              {hasStamp ? `${stamp?.label} conseguido` : '3 de 5 para el sello'}
            </StampBadge>
            {hasGold ? <span className="gold-note"><Icon name="star" size={14} /> Ficha dorada</span> : null}
            <div className="progress-track sala-progress" aria-hidden="true">
              <span style={{ width: `${(playedInSala.length / 5) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="booth-grid">
          {BOOTHS[sala].map((booth, index) => {
            const isPlayed = playedInSala.includes(`${sala}:${booth.id}`)
            return (
              <button
                key={booth.id}
                type="button"
                className={cn('booth-card', isPlayed && 'is-played')}
                onClick={() => openBooth(booth)}
              >
                <span className="booth-number">0{index + 1}</span>
                <span className="booth-icon"><Icon name={booth.icon} size={30} /></span>
                <span className="booth-name">{booth.name}</span>
                <span className="booth-blurb">{booth.blurb}</span>
                <span className="booth-state">
                  {isPlayed ? <><Icon name="check" size={13} /> Jugado</> : <>Abrir puesto <Icon name="arrow" size={13} /></>}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="fair-footnote">
        <Icon name="sparkle" size={15} />
        Cada sala da su sello al jugar 3 puestos. Completar los 5 deja una ficha dorada. Nada bloquea la carta.
      </p>

      {active ? (
        <Modal
          kicker={SALAS[active.sala].name}
          title={active.booth.name}
          onClose={() => setActive(null)}
          wide
        >
          <active.booth.Game />
          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setActive(null)}>Volver a la feria</Button>
          </div>
        </Modal>
      ) : null}
    </section>
  )
}
