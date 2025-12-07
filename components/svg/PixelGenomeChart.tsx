import type { GenomeSegment } from '@/lib/gameLogic'

interface PixelGenomeChartProps {
  segments: GenomeSegment[]
  selectedSegmentIds: string[]
  onSegmentClick?: (segmentId: string) => void
  size?: number
}

export function PixelGenomeChart({
  segments,
  selectedSegmentIds,
  onSegmentClick,
  size = 400,
}: PixelGenomeChartProps) {
  const center = size / 2
  const outerRadius = size * 0.4
  const midRadius = size * 0.3
  const innerRadius = size * 0.2

  const getSegmentColor = (segment: GenomeSegment, isSelected: boolean) => {
    if (isSelected) {
      return segment.cluster === 'G1'
        ? '#0ea5e9'
        : segment.cluster === 'G2'
          ? '#84cc16'
          : segment.cluster === 'G3'
            ? '#f97316'
            : '#ec4899'
    }
    
    const hasSelectedInCluster = selectedSegmentIds.some(
      (id) => segments.find((s) => s.id === id)?.cluster === segment.cluster
    )
    
    if (hasSelectedInCluster) {
      return segment.cluster === 'G1'
        ? '#075985'
        : segment.cluster === 'G2'
          ? '#365314'
          : segment.cluster === 'G3'
            ? '#9a3412'
            : '#9f1239'
    }
    
    return '#1e293b'
  }

  const getRingRadius = (segment: GenomeSegment) => {
    const ring = Math.floor(segment.gcContent * 3)
    if (ring === 0) return innerRadius
    if (ring === 1) return midRadius
    return outerRadius
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      style={{ imageRendering: 'pixelated' }}
      className="cursor-pointer"
    >
      {/* Background */}
      <rect x="0" y="0" width={size} height={size} fill="#020617" />

      {/* Draw segments */}
      {segments.map((segment) => {
        const isSelected = selectedSegmentIds.includes(segment.id)
        const radius = getRingRadius(segment)
        const angleStart = (segment.angleStart * Math.PI) / 180
        const angleEnd = (segment.angleEnd * Math.PI) / 180
        const angleMid = (angleStart + angleEnd) / 2

        // Calculate segment path
        const x1 = center + Math.cos(angleStart) * radius
        const y1 = center + Math.sin(angleStart) * radius
        const x2 = center + Math.cos(angleEnd) * radius
        const y2 = center + Math.sin(angleEnd) * radius
        const x3 = center + Math.cos(angleEnd) * (radius * 0.7)
        const y3 = center + Math.sin(angleEnd) * (radius * 0.7)
        const x4 = center + Math.cos(angleStart) * (radius * 0.7)
        const y4 = center + Math.sin(angleStart) * (radius * 0.7)

        const color = getSegmentColor(segment, isSelected)
        const opacity = isSelected ? 1 : selectedSegmentIds.length > 0 ? 0.3 : 0.6

        return (
          <g key={segment.id}>
            <path
              d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`}
              fill={color}
              opacity={opacity}
              stroke={isSelected ? '#ffffff' : 'none'}
              strokeWidth={isSelected ? '1' : '0'}
              onClick={() => onSegmentClick?.(segment.id)}
              className="hover:opacity-100 transition-opacity"
            />
          </g>
        )
      })}

      {/* Radial spikes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8
        const rad = (angle * Math.PI) / 180
        const x1 = center + Math.cos(rad) * (innerRadius * 0.8)
        const y1 = center + Math.sin(rad) * (innerRadius * 0.8)
        const x2 = center + Math.cos(rad) * outerRadius
        const y2 = center + Math.sin(rad) * outerRadius
        return (
          <line
            key={`spike-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#0ea5e9"
            strokeWidth="1"
            opacity="0.3"
          />
        )
      })}

      {/* Inner jagged ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24
        const rad = (angle * Math.PI) / 180
        const offset = i % 2 === 0 ? 0 : 4
        const r = innerRadius + offset
        const x = center + Math.cos(rad) * r
        const y = center + Math.sin(rad) * r
        return (
          <rect
            key={`jagged-${i}`}
            x={x - 1}
            y={y - 1}
            width="2"
            height="2"
            fill="#f97316"
            opacity="0.5"
          />
        )
      })}

      {/* Center hub */}
      <circle cx={center} cy={center} r="8" fill="#ffffff" />
      <circle cx={center} cy={center} r="4" fill="#020617" />
    </svg>
  )
}

