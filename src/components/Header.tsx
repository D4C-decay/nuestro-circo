import { STAMPS } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Icon } from './Icons'
import { cn } from './UI'

const LINKS = [
  { href: '#gabinete', label: 'Gabinete' },
  { href: '#feria', label: 'Feria' },
  { href: '#ruleta', label: 'Ruleta' },
  { href: '#carta', label: 'Carta' },
  { href: '#final', label: 'Final' },
]

export function Header({ onOpenPassport, solid = false }: { onOpenPassport: () => void; solid?: boolean }) {
  const { totalStamps } = useProgress()
  const { musicOn, toggleMusic } = useAudio()

  return (
    <header className="site-header" data-solid={solid}>
      <a className="brand" href="#cartel" aria-label="El Gran Circo de los Dos, ir al cartel">
        <span className="brand-mark"><Icon name="tent" size={26} /></span>
        <span className="brand-copy">
          <span className="brand-name">El Gran Circo</span>
          <span className="brand-sub">de los Dos</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Programa de la función">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className={cn('sound-button', musicOn && 'is-on')}
          type="button"
          onClick={toggleMusic}
          aria-pressed={musicOn}
          aria-label={musicOn ? 'Pausar soundtrack' : 'Poner soundtrack'}
        >
          <Icon name={musicOn ? 'music' : 'sound'} size={18} />
          <span>{musicOn ? 'Sonando' : 'Música'}</span>
        </button>
        <button className="passport-button" type="button" onClick={onOpenPassport}>
          <Icon name="ticket" size={18} />
          <span>{totalStamps}/{STAMPS.length}</span>
          <span className="passport-button-label">Pasaporte</span>
        </button>
      </div>
    </header>
  )
}
