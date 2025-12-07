'use client'

import { useState, useMemo } from 'react'
import { PixelGenomeChart } from './svg/PixelGenomeChart'
import type { GenomeSegment } from '@/lib/gameLogic'

interface GenomeChartProps {
  segments: GenomeSegment[]
  selectedSegmentIds: string[]
  onSegmentClick: (segmentId: string) => void
  onSelectionChange: (segmentIds: string[]) => void
}

export function GenomeChart({
  segments,
  selectedSegmentIds,
  onSegmentClick,
  onSelectionChange,
}: GenomeChartProps) {
  const [activeCluster, setActiveCluster] = useState<'G1' | 'G2' | 'G3' | 'G4' | null>(null)

  const handleSegmentClick = (segmentId: string) => {
    const segment = segments.find((s) => s.id === segmentId)
    if (!segment) return

    if (selectedSegmentIds.includes(segmentId)) {
      // Deselect
      onSelectionChange(selectedSegmentIds.filter((id) => id !== segmentId))
    } else {
      // Select (max 5 segments)
      if (selectedSegmentIds.length < 5) {
        onSelectionChange([...selectedSegmentIds, segmentId])
      }
    }
    onSegmentClick(segmentId)
  }

  const handleClusterClick = (cluster: 'G1' | 'G2' | 'G3' | 'G4') => {
    if (activeCluster === cluster) {
      setActiveCluster(null)
    } else {
      setActiveCluster(cluster)
    }
  }

  const filteredSegments = useMemo(() => {
    if (!activeCluster) return segments
    return segments.filter((s) => s.cluster === activeCluster)
  }, [segments, activeCluster])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Cluster buttons */}
      <div className="flex gap-2">
        {(['G1', 'G2', 'G3', 'G4'] as const).map((cluster) => (
          <button
            key={cluster}
            onClick={() => handleClusterClick(cluster)}
            className={`px-4 py-2 border-2 font-mono text-sm uppercase tracking-wider transition-colors ${
              activeCluster === cluster
                ? cluster === 'G1'
                  ? 'bg-cyan-500 border-cyan-300 text-white'
                  : cluster === 'G2'
                    ? 'bg-lime-500 border-lime-300 text-white'
                    : cluster === 'G3'
                      ? 'bg-orange-500 border-orange-300 text-white'
                      : 'bg-pink-500 border-pink-300 text-white'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
            }`}
          >
            {cluster}
          </button>
        ))}
      </div>

      {/* Genome chart */}
      <div className="relative">
        <PixelGenomeChart
          segments={filteredSegments}
          selectedSegmentIds={selectedSegmentIds}
          onSegmentClick={handleSegmentClick}
          size={400}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            {selectedSegmentIds.length}/5 segments selected
          </p>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-400 font-mono uppercase tracking-wider text-center max-w-md">
        Tap segments to find stable hero genes. Select 3-5 segments to start mission.
      </p>
    </div>
  )
}

