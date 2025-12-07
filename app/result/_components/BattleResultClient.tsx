'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'
import { PixelHeroSprite } from '@/components/svg/PixelHeroSprite'
import { PixelZombieSprite } from '@/components/svg/PixelZombieSprite'
import { PixelBadgeIcon } from '@/components/svg/PixelBadgeIcon'
import { getHeroes, getBattles } from '@/lib/storage'
import type { Hero, Battle } from '@/lib/gameLogic'

export default function BattleResultClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { context } = useFrame()
  const [hero, setHero] = useState<Hero | null>(null)
  const [battle, setBattle] = useState<Battle | null>(null)
  const [previousRank, setPreviousRank] = useState<number | null>(null)
  const [currentRank, setCurrentRank] = useState<number | null>(null)

  const outcome = searchParams.get('outcome')
  const points = parseInt(searchParams.get('points') || '0', 10)
  const heroId = searchParams.get('heroId')

  const fid = context?.user.fid || 0
  const win = outcome === 'win'

  useEffect(() => {
    if (fid > 0 && heroId) {
      const heroes = getHeroes(fid)
      const foundHero = heroes.find((h) => h.id === heroId)
      if (foundHero) {
        setHero(foundHero)
      }

      const battles = getBattles(fid)
      if (battles.length > 0) {
        setBattle(battles[battles.length - 1])
      }

      fetch('/api/leaderboard?limit=100')
        .then((res) => res.json())
        .then((data) => {
          if (data.leaderboard) {
            const userEntry = data.leaderboard.find((e: any) => e.fid === fid)
            if (userEntry) {
              setCurrentRank(userEntry.rank)
            }
          }
        })
        .catch(console.error)
    }
  }, [fid, heroId])

  const newBadges = hero
    ? battle
      ? hero.badges.filter((badge, index, self) => self.indexOf(badge) === index)
      : []
    : []

  const variant = hero?.name.includes('Knight')
    ? 'knight'
    : hero?.name.includes('Scientist')
      ? 'scientist'
      : 'robot'
  const tone = hero?.stats.attack && hero.stats.attack > hero.stats.defense
    ? 'red'
    : hero?.stats.defense && hero.stats.defense > hero.stats.stability
      ? 'green'
      : 'blue'

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div className="min-h-screen bg-pixel-navy text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="w-20" />
          <h1 className="text-xl font-mono uppercase tracking-widest">Battle Result</h1>
          <Link
            href="/"
            className="px-4 py-2 border-2 border-slate-600 bg-slate-900 text-slate-300 font-mono uppercase tracking-wider text-sm hover:bg-slate-800 transition-colors pixel-shadow-sm"
          >
            Home
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            className={`border-2 p-8 pixel-shadow ${
              win ? 'border-cyan-400 bg-slate-900' : 'border-red-400 bg-slate-900'
            }`}
          >
            <div className="text-center mb-6">
              <h2
                className={`text-4xl font-mono uppercase tracking-widest mb-4 ${
                  win ? 'text-cyan-400' : 'text-red-400'
                }`}
              >
                {win ? 'You Win!' : 'You Lose!'}
              </h2>

              <div className="flex items-center justify-center gap-8 mb-6">
                {hero && (
                  <div className="flex flex-col items-center">
                    <PixelHeroSprite variant={variant} tone={tone} size={80} />
                    <p className="text-xs text-slate-400 font-mono mt-2">{hero.name}</p>
                  </div>
                )}
                <div className="text-2xl font-mono">VS</div>
                <div className="flex flex-col items-center">
                  <PixelZombieSprite size={80} />
                  <p className="text-xs text-slate-400 font-mono mt-2">Zombie</p>
                </div>
              </div>
            </div>

            {battle && (
              <div className="border-2 border-slate-600 bg-slate-800 p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div>
                    <p className="text-slate-400 uppercase tracking-wider mb-1">Rounds</p>
                    <p className="text-white text-lg">{battle.outcome.rounds}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase tracking-wider mb-1">Points Earned</p>
                    <p className="text-cyan-400 text-lg">+{points}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase tracking-wider mb-1">Hero HP</p>
                    <p className="text-green-400 text-lg">{battle.outcome.heroHpRemaining}/100</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase tracking-wider mb-1">Difficulty</p>
                    <p className="text-orange-400 text-lg uppercase">{battle.outcome.difficulty}</p>
                  </div>
                </div>
              </div>
            )}

            {hero && (
              <div className="text-center mb-4">
                <p className="text-slate-400 font-mono uppercase tracking-wider text-sm mb-1">
                  Total Points
                </p>
                <p className="text-cyan-400 text-2xl font-mono">{hero.totalPoints}</p>
              </div>
            )}

            {newBadges.length > 0 && (
              <div className="border-2 border-yellow-400 bg-slate-800 p-4 mb-4">
                <p className="text-yellow-400 font-mono uppercase tracking-wider text-sm mb-2">
                  New Badges Unlocked!
                </p>
                <div className="flex gap-2 justify-center">
                  {newBadges.map((badge) => (
                    <div key={badge} className="flex flex-col items-center">
                      <PixelBadgeIcon type={badge as any} size={32} />
                      <p className="text-xs text-slate-400 font-mono mt-1 text-center">
                        {badge.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentRank && (
              <div className="text-center mb-6">
                <p className="text-slate-400 font-mono uppercase tracking-wider text-sm">
                  Leaderboard Rank: #{currentRank}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 border-2 border-slate-600 bg-slate-800 text-slate-300 font-mono uppercase tracking-wider hover:bg-slate-700 transition-colors pixel-shadow-sm"
              >
                Home
              </Link>
              {heroId && (
                <Link
                  href={`/singleplayer?heroId=${heroId}`}
                  className="px-6 py-3 border-2 border-cyan-400 bg-cyan-500 text-white font-mono uppercase tracking-wider hover:bg-cyan-600 transition-colors pixel-shadow-sm"
                >
                  Fight Again
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </SafeAreaContainer>
  )
}

