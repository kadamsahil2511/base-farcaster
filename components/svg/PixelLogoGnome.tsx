export function PixelLogoGnome({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      width="100%"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Background circle */}
      <rect x="0" y="0" width="128" height="128" fill="#020617" />
      
      {/* Outer ring - dark blue */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i * 360) / 32;
        const rad = (angle * Math.PI) / 180;
        const x = 64 + Math.cos(rad) * 56;
        const y = 64 + Math.sin(rad) * 56;
        return (
          <rect
            key={`outer-${i}`}
            x={x - 1}
            y={y - 1}
            width="2"
            height="2"
            fill="#0ea5e9"
          />
        );
      })}
      
      {/* Middle ring - green */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x = 64 + Math.cos(rad) * 40;
        const y = 64 + Math.sin(rad) * 40;
        return (
          <rect
            key={`mid-${i}`}
            x={x - 1}
            y={y - 1}
            width="2"
            height="2"
            fill="#84cc16"
          />
        );
      })}
      
      {/* Inner ring - orange/red */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        const rad = (angle * Math.PI) / 180;
        const x = 64 + Math.cos(rad) * 24;
        const y = 64 + Math.sin(rad) * 24;
        return (
          <rect
            key={`inner-${i}`}
            x={x - 1}
            y={y - 1}
            width="2"
            height="2"
            fill="#f97316"
          />
        );
      })}
      
      {/* Radial spikes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        const x1 = 64 + Math.cos(rad) * 20;
        const y1 = 64 + Math.sin(rad) * 20;
        const x2 = 64 + Math.cos(rad) * 58;
        const y2 = 64 + Math.sin(rad) * 58;
        return (
          <line
            key={`spike-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#0ea5e9"
            strokeWidth="1"
          />
        );
      })}
      
      {/* Center hub */}
      <rect x="60" y="60" width="8" height="8" fill="#ffffff" />
      
      {/* Sparkles around */}
      {[
        { x: 20, y: 20 },
        { x: 108, y: 24 },
        { x: 24, y: 108 },
        { x: 104, y: 104 },
        { x: 64, y: 12 },
        { x: 64, y: 116 },
      ].map((pos, i) => (
        <g key={`sparkle-${i}`}>
          <rect x={pos.x} y={pos.y} width="2" height="2" fill="#0ea5e9" />
          <rect x={pos.x - 2} y={pos.y} width="2" height="2" fill="#0ea5e9" opacity="0.6" />
          <rect x={pos.x + 2} y={pos.y} width="2" height="2" fill="#0ea5e9" opacity="0.6" />
          <rect x={pos.x} y={pos.y - 2} width="2" height="2" fill="#0ea5e9" opacity="0.6" />
          <rect x={pos.x} y={pos.y + 2} width="2" height="2" fill="#0ea5e9" opacity="0.6" />
        </g>
      ))}
      
      {/* Text "GNOME HUNTER" - chunky pixel letters */}
      <g transform="translate(64, 100)">
        {/* G */}
        <rect x="-50" y="-4" width="6" height="2" fill="#ffffff" />
        <rect x="-50" y="-4" width="2" height="8" fill="#ffffff" />
        <rect x="-50" y="2" width="6" height="2" fill="#ffffff" />
        <rect x="-44" y="0" width="2" height="4" fill="#ffffff" />
        <rect x="-46" y="0" width="2" height="2" fill="#ffffff" />
        
        {/* N */}
        <rect x="-38" y="-4" width="2" height="8" fill="#0ea5e9" />
        <rect x="-34" y="-4" width="2" height="4" fill="#0ea5e9" />
        <rect x="-30" y="0" width="2" height="4" fill="#0ea5e9" />
        <rect x="-26" y="-4" width="2" height="8" fill="#0ea5e9" />
        
        {/* O */}
        <rect x="-22" y="-4" width="6" height="2" fill="#84cc16" />
        <rect x="-22" y="-4" width="2" height="8" fill="#84cc16" />
        <rect x="-22" y="2" width="6" height="2" fill="#84cc16" />
        <rect x="-16" y="-4" width="2" height="8" fill="#84cc16" />
        
        {/* M */}
        <rect x="-12" y="-4" width="2" height="8" fill="#f97316" />
        <rect x="-10" y="-4" width="2" height="4" fill="#f97316" />
        <rect x="-8" y="-2" width="2" height="2" fill="#f97316" />
        <rect x="-6" y="-4" width="2" height="4" fill="#f97316" />
        <rect x="-4" y="-4" width="2" height="8" fill="#f97316" />
        
        {/* E */}
        <rect x="0" y="-4" width="6" height="2" fill="#ec4899" />
        <rect x="0" y="-1" width="4" height="2" fill="#ec4899" />
        <rect x="0" y="2" width="6" height="2" fill="#ec4899" />
        <rect x="0" y="-4" width="2" height="8" fill="#ec4899" />
        
        {/* H */}
        <rect x="10" y="-4" width="2" height="8" fill="#ffffff" />
        <rect x="14" y="0" width="2" height="2" fill="#ffffff" />
        <rect x="18" y="-4" width="2" height="8" fill="#ffffff" />
        
        {/* U */}
        <rect x="24" y="-4" width="2" height="6" fill="#0ea5e9" />
        <rect x="28" y="2" width="4" height="2" fill="#0ea5e9" />
        <rect x="32" y="-4" width="2" height="6" fill="#0ea5e9" />
        
        {/* N */}
        <rect x="38" y="-4" width="2" height="8" fill="#84cc16" />
        <rect x="42" y="-4" width="2" height="4" fill="#84cc16" />
        <rect x="46" y="0" width="2" height="4" fill="#84cc16" />
        <rect x="50" y="-4" width="2" height="8" fill="#84cc16" />
        
        {/* T */}
        <rect x="56" y="-4" width="6" height="2" fill="#f97316" />
        <rect x="60" y="-4" width="2" height="8" fill="#f97316" />
        
        {/* E */}
        <rect x="66" y="-4" width="6" height="2" fill="#ec4899" />
        <rect x="66" y="-1" width="4" height="2" fill="#ec4899" />
        <rect x="66" y="2" width="6" height="2" fill="#ec4899" />
        <rect x="66" y="-4" width="2" height="8" fill="#ec4899" />
        
        {/* R */}
        <rect x="76" y="-4" width="2" height="8" fill="#ffffff" />
        <rect x="80" y="-4" width="4" height="2" fill="#ffffff" />
        <rect x="80" y="-1" width="2" height="2" fill="#ffffff" />
        <rect x="82" y="0" width="2" height="4" fill="#ffffff" />
      </g>
    </svg>
  )
}

