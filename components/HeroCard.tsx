'use client'

import { PixelHeroSprite } from './svg/PixelHeroSprite'
import { PixelBadgeIcon } from './svg/PixelBadgeIcon'
import type { Hero } from '@/lib/gameLogic'

interface HeroCardProps {
  hero: Hero
  isSelected?: boolean
  onSelect?: () => void
  mini?: boolean
}

export function HeroCard({ hero, isSelected = false, onSelect, mini = false }: HeroCardProps) {
  const variant = hero.name.includes('Knight')
    ? 'knight'
    : hero.name.includes('Scientist')
      ? 'scientist'
      : 'robot'
  const tone = hero.stats.attack > hero.stats.defense ? 'red' : hero.stats.defense > hero.stats.stability ? 'green' : 'blue'

  if (mini) {
    return (
      <div
        className={`p-2 border-2 bg-slate-900 cursor-pointer transition-all ${
          isSelected
            ? 'border-cyan-400 shadow-[4px_4px_0_0_rgba(34,211,238,0.5)]'
            : 'border-slate-600 hover:border-slate-500'
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-2">
          <PixelHeroSprite variant={variant} tone={tone} size={24} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono uppercase tracking-wider text-white truncate">
              {hero.name}
            </p>
            <p className="text-xs text-slate-400">{hero.totalPoints} pts</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-4 border-2 bg-slate-900 transition-all ${
        isSelected
          ? 'border-cyan-400 shadow-[4px_4px_0_0_rgba(34,211,238,0.5)]'
          : 'border-slate-600 hover:border-slate-500'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Hero sprite */}
        <PixelHeroSprite variant={variant} tone={tone} size={64} />

        {/* Hero name */}
        <h3 className="text-lg font-mono uppercase tracking-wider text-white text-center">
          {hero.name}
        </h3>

        {/* Stats */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-mono uppercase">Attack</span>
            <span className="text-orange-400 font-mono">{hero.stats.attack}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-mono uppercase">Defense</span>
            <span className="text-green-400 font-mono">{hero.stats.defense}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-mono uppercase">Stability</span>
            <span className="text-cyan-400 font-mono">{hero.stats.stability}</span>
          </div>
        </div>

        {/* Wins and points */}
        <div className="w-full flex justify-between text-xs text-slate-400">
          <span className="font-mono">Wins: {hero.totalWins}</span>
          <span className="font-mono">Points: {hero.totalPoints}</span>
        </div>

        {/* Badges */}
        {hero.badges.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center">
            {hero.badges.map((badge) => (
              <PixelBadgeIcon key={badge} type={badge} size={20} />
            ))}
          </div>
        )}

        {/* Select button */}
        {onSelect && (
          <button
            onClick={onSelect}
            className={`w-full py-2 px-4 font-mono uppercase tracking-wider text-sm border-2 transition-colors ${
              isSelected
                ? 'bg-cyan-500 border-cyan-300 text-white'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isSelected ? 'Selected' : 'Select Hero'}
          </button>
        )}
      </div>
    </div>
  )
}

