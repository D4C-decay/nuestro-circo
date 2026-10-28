import { useEffect, useId, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon, type IconName } from './Icons'

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'quiet' | 'gold'
  icon?: IconName
}

export function Button({ variant = 'primary', icon, className, children, ...props }: ButtonProps) {
  return (
    <button className={cn('btn', `btn-${variant}`, className)} {...props}>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
    </button>
  )
}

export function Bulbs({ count = 12, className = '' }: { count?: number; className?: string }) {
  return (
    <span className={cn('bulbs', className)} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="bulb" style={{ animationDelay: `${index * 90}ms` }} />
      ))}
    </span>
  )
}

export function SectionHeading({
  kicker,
  title,
  lede,
  id,
}: {
  kicker: string
  title: string
  lede?: string
  id?: string
}) {
  return (
    <header className="section-heading" id={id}>
      <p className="eyebrow">{kicker}</p>
      <h2 className="display section-title">{title}</h2>
      {lede ? <p className="section-lede">{lede}</p> : null}
    </header>
  )
}

export function StampBadge({
  children,
  tone = 'violet',
  locked = false,
}: {
  children: ReactNode
  tone?: 'violet' | 'gold' | 'rose'
  locked?: boolean
}) {
  return (
    <span className={cn('stamp-badge', `stamp-${tone}`, locked && 'is-locked')}>
      <Icon name={locked ? 'lock' : 'sparkle'} size={13} />
      <span>{children}</span>
    </span>
  )
}

export function Modal({
  title,
  kicker,
  onClose,
  children,
  wide = false,
}: {
  title: string
  kicker?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section
        className={cn('modal', wide && 'modal-wide')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="modal-head">
          <div>
            {kicker ? <p className="eyebrow">{kicker}</p> : null}
            <h3 className="display modal-title" id={titleId}>{title}</h3>
          </div>
          <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>,
    document.body,
  )
}

export function GameNote({ children }: { children: ReactNode }) {
  return <p className="game-note" role="status" aria-live="polite">{children}</p>
}

export function GameComplete({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="game-complete">
      <Icon name="sparkle" size={28} />
      <p className="hand game-complete-title">{title}</p>
      <p>{children}</p>
      {action}
    </div>
  )
}

export function Divider({ label }: { label?: string }) {
  return (
    <div className="divider" role="presentation">
      <span />
      {label ? <span className="divider-label">{label}</span> : null}
      <span />
    </div>
  )
}
