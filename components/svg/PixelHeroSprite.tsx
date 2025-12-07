interface PixelHeroSpriteProps {
  variant?: 'knight' | 'scientist' | 'robot'
  tone?: 'blue' | 'green' | 'red'
  size?: number
  showDNA?: boolean
}

export function PixelHeroSprite({
  variant = 'knight',
  tone = 'blue',
  size = 32,
  showDNA = true,
}: PixelHeroSpriteProps) {
  const colors = {
    blue: { primary: '#0ea5e9', secondary: '#075985', accent: '#38bdf8' },
    green: { primary: '#84cc16', secondary: '#365314', accent: '#a3e635' },
    red: { primary: '#f97316', secondary: '#9a3412', accent: '#fb923c' },
  }

  const color = colors[tone]
  const pixelSize = size / 16

  return (
    <svg
      viewBox={`0 0 ${size} ${size * 1.5}`}
      width={size}
      height={size * 1.5}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Head */}
      <rect
        x={pixelSize * 6}
        y={pixelSize * 2}
        width={pixelSize * 4}
        height={pixelSize * 4}
        fill="#fbbf24"
      />
      <rect
        x={pixelSize * 7}
        y={pixelSize * 3}
        width={pixelSize * 2}
        height={pixelSize * 2}
        fill="#020617"
      />

      {/* Body */}
      {variant === 'knight' && (
        <>
          <rect
            x={pixelSize * 5}
            y={pixelSize * 6}
            width={pixelSize * 6}
            height={pixelSize * 8}
            fill={color.primary}
          />
          <rect
            x={pixelSize * 6}
            y={pixelSize * 7}
            width={pixelSize * 4}
            height={pixelSize * 6}
            fill={color.secondary}
          />
          {/* Shoulder pads */}
          <rect
            x={pixelSize * 4}
            y={pixelSize * 6}
            width={pixelSize * 2}
            height={pixelSize * 3}
            fill={color.accent}
          />
          <rect
            x={pixelSize * 10}
            y={pixelSize * 6}
            width={pixelSize * 2}
            height={pixelSize * 3}
            fill={color.accent}
          />
        </>
      )}

      {variant === 'scientist' && (
        <>
          <rect
            x={pixelSize * 5}
            y={pixelSize * 6}
            width={pixelSize * 6}
            height={pixelSize * 8}
            fill="#ffffff"
          />
          <rect
            x={pixelSize * 6}
            y={pixelSize * 7}
            width={pixelSize * 4}
            height={pixelSize * 6}
            fill={color.primary}
          />
          {/* Lab coat */}
          <rect
            x={pixelSize * 4}
            y={pixelSize * 10}
            width={pixelSize * 8}
            height={pixelSize * 4}
            fill="#ffffff"
          />
        </>
      )}

      {variant === 'robot' && (
        <>
          <rect
            x={pixelSize * 5}
            y={pixelSize * 6}
            width={pixelSize * 6}
            height={pixelSize * 8}
            fill="#64748b"
          />
          <rect
            x={pixelSize * 6}
            y={pixelSize * 7}
            width={pixelSize * 4}
            height={pixelSize * 6}
            fill="#475569"
          />
          {/* Robot chest panel */}
          <rect
            x={pixelSize * 7}
            y={pixelSize * 8}
            width={pixelSize * 2}
            height={pixelSize * 2}
            fill={color.primary}
          />
        </>
      )}

      {/* DNA strip on chest */}
      {showDNA && (
        <g>
          <rect
            x={pixelSize * 7}
            y={pixelSize * 9}
            width={pixelSize * 2}
            height={pixelSize * 1}
            fill="#0ea5e9"
          />
          <rect
            x={pixelSize * 7.5}
            y={pixelSize * 9.5}
            width={pixelSize * 1}
            height={pixelSize * 0.5}
            fill="#84cc16"
          />
        </g>
      )}

      {/* Arms */}
      <rect
        x={pixelSize * 3}
        y={pixelSize * 7}
        width={pixelSize * 2}
        height={pixelSize * 6}
        fill={variant === 'scientist' ? '#ffffff' : color.primary}
      />
      <rect
        x={pixelSize * 11}
        y={pixelSize * 7}
        width={pixelSize * 2}
        height={pixelSize * 6}
        fill={variant === 'scientist' ? '#ffffff' : color.primary}
      />

      {/* Legs */}
      <rect
        x={pixelSize * 6}
        y={pixelSize * 14}
        width={pixelSize * 2}
        height={pixelSize * 4}
        fill={variant === 'scientist' ? '#1e293b' : color.secondary}
      />
      <rect
        x={pixelSize * 8}
        y={pixelSize * 14}
        width={pixelSize * 2}
        height={pixelSize * 4}
        fill={variant === 'scientist' ? '#1e293b' : color.secondary}
      />
    </svg>
  )
}

