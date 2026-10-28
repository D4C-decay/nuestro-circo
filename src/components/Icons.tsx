import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'tent'
  | 'ticket'
  | 'candle'
  | 'chess'
  | 'clock'
  | 'target'
  | 'fish'
  | 'balance'
  | 'plates'
  | 'hammer'
  | 'crystal'
  | 'safe'
  | 'cards'
  | 'carousel'
  | 'mirror'
  | 'popcorn'
  | 'bingo'
  | 'well'
  | 'camera'
  | 'cups'
  | 'wheel'
  | 'hat'
  | 'heart'
  | 'music'
  | 'sound'
  | 'sparkle'
  | 'arrow'
  | 'lock'
  | 'check'
  | 'close'
  | 'key'
  | 'star'
  | 'bell'
  | 'coin'

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number }

export function Icon({ name, size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}

const paths: Record<IconName, ReactNode> = {
  tent: (
    <>
      <path d="M3 19h18M5 19l4-13 3 7 3-7 4 13" />
      <path d="M12 6V3M9 3h6M8 13h8" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7Z" />
      <path d="M9 7v10M14 9h3M14 12h3M14 15h3" />
    </>
  ),
  candle: (
    <>
      <path d="M8 21h8M9 21V9h6v12M10 9V5h1V3M15 9V6" />
      <path d="M12 3c1.5 1 1.5 2.5 0 3.5C10.5 5.5 10.5 4 12 3Z" />
    </>
  ),
  chess: (
    <>
      <path d="M9 20h6M10 20v-3h4v3M10.5 17c-1.8-2-2.5-3.5-2.5-5a4 4 0 1 1 8 0c0 1.5-.7 3-2.5 5" />
      <path d="M7 20h10M12 4v1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2M12 2v2M12 20v2M2 12h2M20 12h2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </>
  ),
  fish: (
    <>
      <path d="M3 12c3-4 6-5 9-5 4 0 7 2 9 5-2 3-5 5-9 5-3 0-6-1-9-5Z" />
      <path d="M3 12c1.5 0 2.5-1 3-3M3 12c1.5 0 2.5 1 3 3M16 10.5h.01" />
    </>
  ),
  balance: (
    <>
      <path d="M12 3v18M5 6h14M7 6l-3 6h6L7 6ZM17 6l-3 6h6l-3-6ZM8 21h8" />
    </>
  ),
  plates: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2" />
      <ellipse cx="12" cy="11" rx="7" ry="2" />
      <ellipse cx="12" cy="16" rx="7" ry="2" />
      <path d="M5 16v3c0 1.1 3.1 2 7 2s7-.9 7-2v-3" />
    </>
  ),
  hammer: (
    <>
      <path d="m5 19 8-8M4 4l4-2 8 8-4 4-8-8Z" />
      <path d="m9 7 3-3M13 17l4 4" />
    </>
  ),
  crystal: (
    <>
      <circle cx="12" cy="10" r="6" />
      <path d="M8 16h8l2 5H6l2-5ZM10 20h4M9 8c1-2 3-2 4-1" />
    </>
  ),
  safe: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="13" cy="12" r="3" />
      <path d="M13 9v6M10 12h6M7 4v16M7 8H4M7 16H4" />
    </>
  ),
  cards: (
    <>
      <rect x="6" y="3" width="10" height="14" rx="1.5" transform="rotate(8 11 10)" />
      <rect x="9" y="6" width="10" height="14" rx="1.5" transform="rotate(-7 14 13)" />
      <path d="m14 11 2 4 2-4-2-2-2 2Z" />
    </>
  ),
  carousel: (
    <>
      <path d="M4 19h16M6 19v-7h12v7M4 10l8-5 8 5M12 5V2M9 2h6" />
      <path d="M8 12v4M16 12v4M12 12v4" />
    </>
  ),
  mirror: (
    <>
      <ellipse cx="12" cy="10" rx="6" ry="7" />
      <path d="M12 17v4M9 21h6M10 7c1-1 3-1 4 0" />
    </>
  ),
  popcorn: (
    <>
      <path d="M5 9h14l-2 12H7L5 9Z" />
      <path d="M8 9c0-2 1-3 2-3s2 1 2 2c0-2 2-3 3-2 1 .8 1 2 1 3M9 13h6M9 17h6" />
    </>
  ),
  bingo: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      <path d="m11 11 2 2 3-4" />
    </>
  ),
  well: (
    <>
      <ellipse cx="12" cy="9" rx="7" ry="3" />
      <path d="M5 9v8c0 1.7 3.1 3 7 3s7-1.3 7-3V9M5 13c0 1.7 3.1 3 7 3s7-1.3 7-3" />
      <path d="M9 5c0-2 2-3 3-1 1-2 3-1 3 1" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M8 7l1.5-3h5L16 7M7 4h2M18 10h.01" />
    </>
  ),
  cups: (
    <>
      <path d="M4 8h5l-1 12H5L4 8ZM9.5 8h5l-1 12h-3l-1-12ZM15 8h5l-1 12h-3l-1-12Z" />
      <path d="M4 12h5M9.5 12h5M15 12h5" />
    </>
  ),
  wheel: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  hat: (
    <>
      <path d="M7 12V6h10v6M5 12h14v2H5v-2ZM4 17c0 2 3 3 8 3s8-1 8-3v-3H4v3Z" />
      <path d="M9 6V4h6v2" />
    </>
  ),
  heart: <path d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1Z" />,
  music: (
    <>
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16 9c1.5 1.5 1.5 4.5 0 6M19 6c3 3 3 9 0 12" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 9 9M16 16l2-2M19 19l2-2" />
    </>
  ),
  star: <path d="m12 2 3 6.5 7 .8-5.2 4.8 1.5 7L12 17.7 5.7 21l1.5-7L2 9.3l7-.8L12 2Z" />,
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M9.5 9.5c0-1.5 5-1.5 5 0s-5 1-5 2.5 5 1.5 5 0" />
    </>
  ),
  bell: (
    <>
      <path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5L6 17Z" />
      <path d="M10 20h4M12 5V3M4 17h2M18 17h2" />
    </>
  ),
}
