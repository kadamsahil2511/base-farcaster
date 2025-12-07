type BadgeType =
  | 'firstFold'
  | 'stableGenome'
  | 'mutationMaster'
  | 'zombieEradicator'
  | 'dailyTop'
  | 'comboWizard'

interface PixelBadgeIconProps {
  type: BadgeType
  size?: number
}

export function PixelBadgeIcon({ type, size = 24 }: PixelBadgeIconProps) {
  const pixelSize = size / 12

  const renderBadge = () => {
    switch (type) {
      case 'firstFold':
        // DNA helix medal
        return (
          <>
            <rect
              x={pixelSize * 2}
              y={pixelSize * 2}
              width={pixelSize * 8}
              height={pixelSize * 8}
              fill="#0ea5e9"
            />
            <rect
              x={pixelSize * 3}
              y={pixelSize * 3}
              width={pixelSize * 6}
              height={pixelSize * 6}
              fill="#075985"
            />
            {/* Helix pattern */}
            <rect x={pixelSize * 4} y={pixelSize * 4} width={pixelSize * 1} height={pixelSize * 1} fill="#38bdf8" />
            <rect x={pixelSize * 7} y={pixelSize * 5} width={pixelSize * 1} height={pixelSize * 1} fill="#38bdf8" />
            <rect x={pixelSize * 4} y={pixelSize * 6} width={pixelSize * 1} height={pixelSize * 1} fill="#38bdf8" />
            <rect x={pixelSize * 7} y={pixelSize * 7} width={pixelSize * 1} height={pixelSize * 1} fill="#38bdf8" />
          </>
        )

      case 'stableGenome':
        // Shield with check mark
        return (
          <>
            <path
              d={`M ${pixelSize * 6} ${pixelSize * 2} L ${pixelSize * 2} ${pixelSize * 4} L ${pixelSize * 2} ${pixelSize * 8} L ${pixelSize * 6} ${pixelSize * 10} L ${pixelSize * 10} ${pixelSize * 8} L ${pixelSize * 10} ${pixelSize * 4} Z`}
              fill="#84cc16"
            />
            <path
              d={`M ${pixelSize * 6} ${pixelSize * 3} L ${pixelSize * 3} ${pixelSize * 5} L ${pixelSize * 3} ${pixelSize * 8} L ${pixelSize * 6} ${pixelSize * 9} L ${pixelSize * 9} ${pixelSize * 8} L ${pixelSize * 9} ${pixelSize * 5} Z`}
              fill="#365314"
            />
            {/* Check mark */}
            <rect x={pixelSize * 4.5} y={pixelSize * 6} width={pixelSize * 1} height={pixelSize * 0.5} fill="#ffffff" transform="rotate(45)" />
            <rect x={pixelSize * 5.5} y={pixelSize * 6.5} width={pixelSize * 2} height={pixelSize * 0.5} fill="#ffffff" transform="rotate(-45)" />
          </>
        )

      case 'mutationMaster':
        // Jagged lightning
        return (
          <>
            <rect
              x={pixelSize * 2}
              y={pixelSize * 2}
              width={pixelSize * 8}
              height={pixelSize * 8}
              fill="#f97316"
            />
            {/* Lightning bolt */}
            <rect x={pixelSize * 5.5} y={pixelSize * 3} width={pixelSize * 1} height={pixelSize * 2} fill="#ffffff" />
            <rect x={pixelSize * 4.5} y={pixelSize * 5} width={pixelSize * 3} height={pixelSize * 1} fill="#ffffff" />
            <rect x={pixelSize * 5.5} y={pixelSize * 6} width={pixelSize * 1} height={pixelSize * 2} fill="#ffffff" />
            <rect x={pixelSize * 6.5} y={pixelSize * 8} width={pixelSize * 2} height={pixelSize * 1} fill="#ffffff" />
            <rect x={pixelSize * 5.5} y={pixelSize * 9} width={pixelSize * 1} height={pixelSize * 1} fill="#ffffff" />
          </>
        )

      case 'zombieEradicator':
        // Skull
        return (
          <>
            <rect
              x={pixelSize * 2}
              y={pixelSize * 2}
              width={pixelSize * 8}
              height={pixelSize * 8}
              fill="#64748b"
            />
            {/* Skull shape */}
            <rect x={pixelSize * 4} y={pixelSize * 3} width={pixelSize * 4} height={pixelSize * 3} fill="#ffffff" />
            <rect x={pixelSize * 5} y={pixelSize * 4} width={pixelSize * 1} height={pixelSize * 1} fill="#020617" />
            <rect x={pixelSize * 6} y={pixelSize * 4} width={pixelSize * 1} height={pixelSize * 1} fill="#020617" />
            <rect x={pixelSize * 5.5} y={pixelSize * 5.5} width={pixelSize * 1} height={pixelSize * 1} fill="#020617" />
            <rect x={pixelSize * 4.5} y={pixelSize * 6.5} width={pixelSize * 3} height={pixelSize * 1} fill="#020617" />
            <rect x={pixelSize * 5} y={pixelSize * 7.5} width={pixelSize * 2} height={pixelSize * 2} fill="#020617" />
          </>
        )

      case 'dailyTop':
        // Star
        return (
          <>
            <rect
              x={pixelSize * 2}
              y={pixelSize * 2}
              width={pixelSize * 8}
              height={pixelSize * 8}
              fill="#fbbf24"
            />
            {/* Star shape */}
            <rect x={pixelSize * 6} y={pixelSize * 3} width={pixelSize * 0.5} height={pixelSize * 2} fill="#ffffff" />
            <rect x={pixelSize * 5} y={pixelSize * 4} width={pixelSize * 2} height={pixelSize * 0.5} fill="#ffffff" />
            <rect x={pixelSize * 5.5} y={pixelSize * 4.5} width={pixelSize * 1} height={pixelSize * 0.5} fill="#ffffff" transform="rotate(45)" />
            <rect x={pixelSize * 5.5} y={pixelSize * 5} width={pixelSize * 1} height={pixelSize * 0.5} fill="#ffffff" transform="rotate(-45)" />
            <rect x={pixelSize * 6} y={pixelSize * 6} width={pixelSize * 0.5} height={pixelSize * 2} fill="#ffffff" />
          </>
        )

      case 'comboWizard':
        // Wand/sparkle
        return (
          <>
            <rect
              x={pixelSize * 2}
              y={pixelSize * 2}
              width={pixelSize * 8}
              height={pixelSize * 8}
              fill="#ec4899"
            />
            {/* Wand */}
            <rect x={pixelSize * 5.5} y={pixelSize * 3} width={pixelSize * 1} height={pixelSize * 6} fill="#ffffff" />
            {/* Sparkle at top */}
            <rect x={pixelSize * 5} y={pixelSize * 2} width={pixelSize * 2} height={pixelSize * 1} fill="#0ea5e9" />
            <rect x={pixelSize * 5.5} y={pixelSize * 1.5} width={pixelSize * 1} height={pixelSize * 2} fill="#0ea5e9" />
            <rect x={pixelSize * 4.5} y={pixelSize * 2.5} width={pixelSize * 1} height={pixelSize * 1} fill="#84cc16" />
            <rect x={pixelSize * 6.5} y={pixelSize * 2.5} width={pixelSize * 1} height={pixelSize * 1} fill="#84cc16" />
          </>
        )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    >
      {renderBadge()}
    </svg>
  )
}

