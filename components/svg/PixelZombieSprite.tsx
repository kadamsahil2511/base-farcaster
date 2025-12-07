interface PixelZombieSpriteProps {
  size?: number
}

export function PixelZombieSprite({ size = 32 }: PixelZombieSpriteProps) {
  const pixelSize = size / 16

  return (
    <svg
      viewBox={`0 0 ${size} ${size * 1.5}`}
      width={size}
      height={size * 1.5}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Head - green/purple */}
      <rect
        x={pixelSize * 6}
        y={pixelSize * 2}
        width={pixelSize * 4}
        height={pixelSize * 4}
        fill="#84cc16"
      />
      <rect
        x={pixelSize * 7}
        y={pixelSize * 3}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#ec4899"
      />
      <rect
        x={pixelSize * 8}
        y={pixelSize * 3}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#ec4899"
      />

      {/* Red eyes */}
      <rect
        x={pixelSize * 7}
        y={pixelSize * 3.5}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#dc2626"
      />
      <rect
        x={pixelSize * 8}
        y={pixelSize * 3.5}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#dc2626"
      />

      {/* Asymmetric mouth */}
      <rect
        x={pixelSize * 7.5}
        y={pixelSize * 5}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#020617"
      />
      <rect
        x={pixelSize * 8.5}
        y={pixelSize * 5.5}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#020617"
      />

      {/* Body - torn clothes */}
      <rect
        x={pixelSize * 5}
        y={pixelSize * 6}
        width={pixelSize * 6}
        height={pixelSize * 8}
        fill="#365314"
      />
      <rect
        x={pixelSize * 6}
        y={pixelSize * 7}
        width={pixelSize * 4}
        height={pixelSize * 6}
        fill="#1e293b"
      />
      {/* Torn edges */}
      <rect
        x={pixelSize * 5}
        y={pixelSize * 8}
        width={pixelSize * 1}
        height={pixelSize * 2}
        fill="#84cc16"
      />
      <rect
        x={pixelSize * 10}
        y={pixelSize * 10}
        width={pixelSize * 1}
        height={pixelSize * 2}
        fill="#84cc16"
      />

      {/* Arms - one up */}
      <rect
        x={pixelSize * 3}
        y={pixelSize * 7}
        width={pixelSize * 2}
        height={pixelSize * 5}
        fill="#84cc16"
      />
      <rect
        x={pixelSize * 3}
        y={pixelSize * 6}
        width={pixelSize * 2}
        height={pixelSize * 1}
        fill="#84cc16"
      />
      <rect
        x={pixelSize * 11}
        y={pixelSize * 7}
        width={pixelSize * 2}
        height={pixelSize * 6}
        fill="#84cc16"
      />

      {/* Legs - staggered */}
      <rect
        x={pixelSize * 6}
        y={pixelSize * 14}
        width={pixelSize * 2}
        height={pixelSize * 4}
        fill="#365314"
      />
      <rect
        x={pixelSize * 8}
        y={pixelSize * 14.5}
        width={pixelSize * 2}
        height={pixelSize * 4}
        fill="#365314"
      />

      {/* Purple patches */}
      <rect
        x={pixelSize * 7}
        y={pixelSize * 9}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#ec4899"
      />
      <rect
        x={pixelSize * 8}
        y={pixelSize * 11}
        width={pixelSize * 1}
        height={pixelSize * 1}
        fill="#ec4899"
      />
    </svg>
  )
}

