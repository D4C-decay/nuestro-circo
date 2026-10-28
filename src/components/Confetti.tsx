import type { CSSProperties } from 'react'

const COLORS = ['#D946EF', '#7C3AED', '#C4B5FD', '#C9A227', '#F6F0FF', '#CFC6D9']

export function Confetti({ run }: { run: number }) {
  if (!run) return null
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 54 }, (_, index) => {
        const left = (index * 37 + 11) % 100
        const delay = (index % 13) * 0.09
        const duration = 2.4 + (index % 8) * 0.18
        const size = 5 + (index % 5) * 2
        const drift = ((index % 9) - 4) * 18
        return (
          <span
            key={`${run}-${index}`}
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * (index % 3 === 0 ? 1.8 : 1)}px`,
              background: COLORS[index % COLORS.length],
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              '--drift': `${drift}px`,
              '--spin': `${(index * 67) % 720}deg`,
            } as CSSProperties}
          />
        )
      })}
    </div>
  )
}
