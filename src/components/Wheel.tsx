import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PLANS } from '../content/circus'
import { useAudio } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { Icon } from './Icons'
import { Button, cn, SectionHeading, StampBadge } from './UI'

const SEGMENT_COLORS = ['#3B155C', '#24102F', '#7C3AED', '#2a0f3d', '#D946EF', '#24102F', '#4c1d76', '#2a0f3d']

export function Wheel() {
  const { plan, setPlan, awardStamp } = useProgress()
  const { playSfx } = useAudio()
  const initialIndex = plan ? PLANS.findIndex((item) => item === plan) : -1
  const [rotation, setRotation] = useState(initialIndex >= 0 ? -(initialIndex * 45) : 0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(plan)
  const timeoutRef = useRef<number | null>(null)
  const tickRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if (tickRef.current) window.clearInterval(tickRef.current)
  }, [])

  const spin = () => {
    if (spinning) return
    const index = Math.floor(Math.random() * PLANS.length)
    const targetMod = (360 - index * 45) % 360
    setSpinning(true)
    setResult(null)
    playSfx('wheel')
    setRotation((current) => {
      const currentMod = ((current % 360) + 360) % 360
      const delta = (targetMod - currentMod + 360) % 360
      return current + 360 * 6 + delta
    })
    if (tickRef.current) window.clearInterval(tickRef.current)
    tickRef.current = window.setInterval(() => playSfx('wheel'), 170)
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      if (tickRef.current) window.clearInterval(tickRef.current)
      setSpinning(false)
      setResult(PLANS[index])
      setPlan(PLANS[index])
      awardStamp('ruleta')
      playSfx('chime')
    }, 3600)
  }

  return (
    <section className="section wheel-section" id="ruleta" aria-labelledby="ruleta-title">
      <SectionHeading
        kicker="Acto tercero · La suerte"
        title="La ruleta de los planes"
        lede="Ocho planes, un giro y ninguna promesa de cumplirlos. La gracia es tener la excusa servida."
        id="ruleta-title"
      />

      <div className="wheel-layout">
        <div className="wheel-stage">
          <span className="wheel-pointer" aria-hidden="true"><Icon name="hat" size={26} /></span>
          <div className={cn('wheel', spinning && 'is-spinning')} style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="wheel-face" style={{ background: `conic-gradient(from -22.5deg, ${SEGMENT_COLORS.map((color, index) => `${color} ${index * 12.5}% ${(index + 1) * 12.5}%`).join(', ')})` }} />
            {PLANS.map((item, index) => (
              <span
                key={item}
                className="wheel-label-holder"
                style={{ '--angle': `${index * 45}deg` } as CSSProperties}
              >
                <span className="wheel-label">{String(index + 1).padStart(2, '0')}</span>
              </span>
            ))}
            <span className="wheel-hub" aria-hidden="true"><Icon name="tent" size={38} /></span>
            <span className="wheel-bulbs" aria-hidden="true">
              {Array.from({ length: 16 }, (_, index) => (
                <span key={index} style={{ '--i': index } as CSSProperties} />
              ))}
            </span>
          </div>
          <Button className="wheel-spin" icon="wheel" onClick={spin} disabled={spinning}>
            {spinning ? 'Girando…' : 'Girar la ruleta'}
          </Button>
        </div>

        <div className="wheel-side">
          <div className="wheel-result" role="status" aria-live="polite">
            <p className="eyebrow">Plan de la función</p>
            {spinning ? <p className="hand wheel-result-text">El destino está dando vueltas. No lo mires demasiado.</p> : null}
            {!spinning && result ? <p className="hand wheel-result-text">{result}</p> : null}
            {!spinning && !result ? <p className="muted">Todavía no has girado. La ruleta está esperando con paciencia de cartón.</p> : null}
          </div>
          <div className="wheel-list">
            {PLANS.map((item, index) => (
              <button
                key={item}
                type="button"
                className={cn('wheel-list-item', result === item && 'is-active')}
                onClick={() => { setPlan(item); setResult(item); awardStamp('ruleta'); playSfx('chime'); setRotation(-(index * 45)) }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item}
              </button>
            ))}
          </div>
          <StampBadge tone="gold" locked={!result}>
            {result ? 'Sello de la ruleta conseguido' : 'Gira para llevarte el sello'}
          </StampBadge>
        </div>
      </div>
    </section>
  )
}
