import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SALAS, STAMPS } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Button, cn, Divider } from './UI'
import { Icon } from './Icons'

export function Passport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    stamps,
    gold,
    totalStamps,
    plan,
    prediction,
    wish,
    finale,
    reset,
  } = useProgress()
  const { musicOn, sfxOn, toggleMusic, toggleSfx } = useAudio()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const resetAll = () => {
    if (window.confirm('¿Vaciar el pasaporte y empezar la función desde el principio?')) {
      reset()
      onClose()
    }
  }

  return createPortal(
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <aside className="passport-drawer" role="dialog" aria-modal="true" aria-labelledby="passport-title">
        <header className="passport-head">
          <div>
            <p className="eyebrow">Documento de la función</p>
            <h2 className="display passport-title" id="passport-title">Pasaporte</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar pasaporte">
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="passport-progress">
          <div className="passport-progress-copy">
            <span>{totalStamps} de {STAMPS.length} sellos</span>
            <span>{gold.length} ficha{gold.length === 1 ? '' : 's'} dorada{gold.length === 1 ? '' : 's'}</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${(totalStamps / STAMPS.length) * 100}%` }} />
          </div>
        </div>

        <div className="stamp-grid">
          {STAMPS.map((stamp) => {
            const unlocked = stamps.includes(stamp.id)
            return (
              <div key={stamp.id} className={cn('stamp-slot', unlocked && 'is-unlocked')}>
                <span className="stamp-seal" aria-hidden="true">{unlocked ? <Icon name="check" size={17} /> : stamp.short}</span>
                <span>{stamp.label}</span>
              </div>
            )
          })}
        </div>

        <div className="gold-row">
          {(Object.keys(SALAS) as Array<keyof typeof SALAS>).map((sala) => (
            <span key={sala} className={cn('gold-token', gold.includes(sala) && 'is-earned')}>
              <Icon name="star" size={13} />
              {SALAS[sala].name.replace('Sala de ', '')}
            </span>
          ))}
        </div>

        <Divider label="Tus cosas guardadas" />
        <div className="saved-list">
          <p><span>Plan</span>{plan ?? 'Todavía sin girar la ruleta.'}</p>
          <p><span>Predicción</span>{prediction ?? 'La pitonisa espera tu pregunta.'}</p>
          <p><span>Deseo</span>{wish ?? 'El pozo todavía no sabe nada.'}</p>
          <p><span>Gran función</span>{finale ?? 'La pregunta final sigue abierta.'}</p>
        </div>

        <Divider label="Sonido" />
        <div className="sound-settings">
          <button type="button" className={cn('setting-button', musicOn && 'is-on')} onClick={toggleMusic} aria-pressed={musicOn}>
            <Icon name="music" size={18} />
            <span>Soundtrack</span>
            <strong>{musicOn ? 'On' : 'Off'}</strong>
          </button>
          <button type="button" className={cn('setting-button', sfxOn && 'is-on')} onClick={toggleSfx} aria-pressed={sfxOn}>
            <Icon name="sparkle" size={18} />
            <span>Efectos</span>
            <strong>{sfxOn ? 'On' : 'Off'}</strong>
          </button>
        </div>

        <p className="passport-credit">
          The World Revolving — Toby Fox (Deltarune). Reproducido con cariño, sin ánimo de lucro.
        </p>

        <div className="passport-foot">
          <Button variant="ghost" onClick={resetAll}>Vaciar pasaporte</Button>
          <Button variant="quiet" onClick={onClose}>Seguir la función</Button>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
