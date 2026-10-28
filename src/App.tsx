import { useEffect, useState } from 'react'
import { Cabinet } from './components/Cabinet'
import { Entry } from './components/Entry'
import { Fair } from './components/Fair'
import { Finale } from './components/Finale'
import { Header } from './components/Header'
import { Letter } from './components/Letter'
import { Passport } from './components/Passport'
import { Wheel } from './components/Wheel'
import { COUPLE, SOUNDTRACK_CREDIT, STAMPS } from './content/circus'
import { useAudio } from './lib/audio'
import { useProgress } from './lib/progress'
import { Icon } from './components/Icons'

const PROGRAM = [
  { href: '#gabinete', act: 'I', label: 'El gabinete', detail: 'Tres funciones privadas y seis objetos.' },
  { href: '#feria', act: 'II', label: 'La feria', detail: 'Quince puestos en tres salas.' },
  { href: '#ruleta', act: 'III', label: 'La ruleta', detail: 'Ocho planes para no cumplir con calma.' },
  { href: '#carta', act: 'IV', label: 'La carta', detail: 'Abierta desde el principio.' },
  { href: '#final', act: 'V', label: 'La gran función', detail: 'La última entrada y la pregunta.' },
]

function Front() {
  const { totalStamps } = useProgress()

  return (
    <section className="section front-section" id="cartel" aria-labelledby="front-title">
      <div className="front-grid">
        <div className="front-copy">
          <p className="eyebrow">Función privada · {COUPLE.date}</p>
          <h1 className="display front-title" id="front-title">
            El Gran Circo
            <span>de los Dos</span>
          </h1>
          <p className="front-lede">
            Una web para {COUPLE.her}, escrita por {COUPLE.him}. Sin fotos, sin prisa y sin nada que
            demostrar: solo papel, luces y las cosas que nos pasaron.
          </p>
          <div className="front-actions">
            <a className="btn btn-primary" href="#gabinete">
              <Icon name="tent" size={18} />
              <span>Empezar por el gabinete</span>
            </a>
            <a className="btn btn-ghost" href="#feria">
              <Icon name="ticket" size={18} />
              <span>Ir directo a la feria</span>
            </a>
          </div>
          <p className="front-note">
            <Icon name="sparkle" size={15} />
            Tres funciones privadas, quince puestos y siete sellos. La carta no se bloquea.
          </p>
        </div>

        <aside className="front-poster" aria-label="Cartel y programa de la función">
          <div className="front-ticket">
            <div className="front-ticket-stub">
              <span>Palco</span>
              <strong>A &amp; E</strong>
              <span>No. 2710</span>
            </div>
            <div className="front-ticket-main">
              <span className="eyebrow">Entrada de favor</span>
              <strong>{COUPLE.her} &amp; {COUPLE.him}</strong>
              <span>Una función que no tiene hora de salida.</span>
              <span className="front-ticket-code">{totalStamps}/{STAMPS.length} sellos</span>
            </div>
          </div>

          <div className="front-program">
            <p className="eyebrow">Programa</p>
            {PROGRAM.map((item) => (
              <a key={item.href} href={item.href}>
                <span className="front-program-act">{item.act}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <Icon name="arrow" size={16} />
              </a>
            ))}
          </div>

          <div className="front-progress">
            <span>Pasaporte de la función</span>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${(totalStamps / STAMPS.length) * 100}%` }} />
            </div>
            <span>{totalStamps} de {STAMPS.length} sellos</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Footer() {
  const { reset } = useProgress()
  const { playSfx } = useAudio()

  return (
    <footer className="site-footer">
      <div className="footer-mark"><Icon name="tent" size={28} /></div>
      <p className="display footer-title">El Gran Circo de los Dos</p>
      <p className="footer-copy">
        Hecho a mano para {COUPLE.her}. Sin backend, sin analytics y sin fotos. Solo recuerdos y un poco de papel.
      </p>
      <p className="footer-credit">
        <Icon name="music" size={14} />
        {SOUNDTRACK_CREDIT.title} — {SOUNDTRACK_CREDIT.artist} ({SOUNDTRACK_CREDIT.work}). Reproducido con cariño, sin ánimo de lucro.
      </p>
      <div className="footer-bottom">
        <span>{COUPLE.dateLong}</span>
        <span>Función privada · No indexada</span>
        <button type="button" className="footer-reset" onClick={() => {
          if (window.confirm('¿Vaciar el pasaporte y empezar la función desde el principio?')) {
            reset()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
          playSfx('click')
        }}>
          Vaciar pasaporte
        </button>
      </div>
    </footer>
  )
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const [passportOpen, setPassportOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    if (!entered) return
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [entered])

  if (!entered) {
    return (
      <Entry onEnter={() => {
        setEntered(true)
        window.scrollTo({ top: 0 })
      }} />
    )
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#cartel">Saltar al cartel</a>
      <Header solid={solid} onOpenPassport={() => setPassportOpen(true)} />
      <main id="contenido">
        <Front />
        <Cabinet />
        <Fair />
        <Wheel />
        <Letter />
        <Finale />
      </main>
      <Footer />
      <Passport open={passportOpen} onClose={() => setPassportOpen(false)} />
    </div>
  )
}
