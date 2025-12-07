'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'
import { GenomeChart } from '@/components/GenomeChart'
import { PixelBadgeIcon } from '@/components/svg/PixelBadgeIcon'
import {
  generateGenomeSegments,
  genomeToStats,
  generateZombie,
  simulateBattle,
  checkBadges,
  type GenomeSegment,
  type Hero,
  type Battle,
} from '@/lib/gameLogic'
import {
  getHeroes,
  getLastHeroId,
  saveLastHeroId,
  saveHero,
  saveBattle,
  saveGeneBuild,
} from '@/lib/storage'

export default function SinglePlayerClient() {
  const { context } = useFrame()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [segments] = useState<GenomeSegment[]>(generateGenomeSegments())
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([])
  const [currentHero, setCurrentHero] = useState<Hero | null>(null)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [isStarting, setIsStarting] = useState(false)

  const fid = context?.user.fid || 0
  const username = context?.user.username || 'Guest'

  useEffect(() => {
    if (fid > 0) {
      const heroes = getHeroes(fid)

      const heroIdFromQuery = searchParams.get('heroId')
      if (heroIdFromQuery) {
        const hero = heroes.find((h) => h.id === heroIdFromQuery)
        if (hero) {
          setCurrentHero(hero)
          setSelectedSegmentIds(hero.geneBuild.segmentIds)
          saveLastHeroId(fid, hero.id)
          return
        }
      }

      const lastHeroId = getLastHeroId(fid)
      if (lastHeroId) {
        const hero = heroes.find((h) => h.id === lastHeroId)
        if (hero) {
          setCurrentHero(hero)
          setSelectedSegmentIds(hero.geneBuild.segmentIds)
          return
        }
      }

      if (heroes.length === 0) {
        const defaultStats = genomeToStats([], segments)
        const defaultHero: Hero = {
          id: `hero-${Date.now()}`,
          name: `${username}#001`,
          fid,
          stats: defaultStats,
          geneBuild: { segmentIds: [] },
          totalWins: 0,
          totalPoints: 0,
          badges: [],
          createdAt: Date.now(),
        }
        saveHero(defaultHero)
        setCurrentHero(defaultHero)
      }
    }
  }, [fid, username, segments, searchParams])

  const handleStartMission = async () => {
    if (selectedSegmentIds.length < 3 || selectedSegmentIds.length > 5) {
      alert('Please select 3-5 segments')
      return
    }

    if (!currentHero || fid === 0) {
      alert('Please create a hero first')
      return
    }

    setIsStarting(true)

    try {
      const newStats = genomeToStats(selectedSegmentIds, segments)
      const updatedHero: Hero = {
        ...currentHero,
        stats: newStats,
        geneBuild: { segmentIds: selectedSegmentIds },
      }

      const zombie = generateZombie(difficulty)
      const outcome = simulateBattle(updatedHero, zombie, difficulty)

      const battle: Battle = {
        id: `battle-${Date.now()}`,
        fid,
        heroId: updatedHero.id,
        zombieId: zombie.id,
        outcome,
        timestamp: Date.now(),
      }

      const newBadges = checkBadges(updatedHero, battle)
      updatedHero.badges = [...updatedHero.badges, ...newBadges]

      if (outcome.win) {
        updatedHero.totalWins += 1
      }
      updatedHero.totalPoints += outcome.pointsEarned

      saveHero(updatedHero)
      saveGeneBuild(updatedHero.id, updatedHero.geneBuild)
      saveBattle(battle)

      const totalPoints = updatedHero.totalPoints
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          username,
          totalPoints,
        }),
      })

      await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battle),
      })

      router.push(
        `/result?outcome=${outcome.win ? 'win' : 'loss'}&points=${outcome.pointsEarned}&heroId=${updatedHero.id}`
      )
    } catch (error) {
      console.error('Battle error:', error)
      alert('Failed to start battle')
    } finally {
      setIsStarting(false)
    }
  }

  const canStart = selectedSegmentIds.length >= 3 && selectedSegmentIds.length <= 5 && !isStarting

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div className="min-h-screen bg-pixel-navy text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="px-4 py-2 border-2 border-slate-600 bg-slate-900 text-slate-300 font-mono uppercase tracking-wider text-sm hover:bg-slate-800 transition-colors pixel-shadow-sm"
          >
            ← Home
          </Link>
          <h1 className="text-xl font-mono uppercase tracking-widest">Genome Hunt</h1>
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          <div className="lg:col-span-3">
            <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow">
              <GenomeChart
                segments={segments}
                selectedSegmentIds={selectedSegmentIds}
                onSegmentClick={(segmentId) => {
                  console.log('Segment clicked:', segmentId)
                }}
                onSelectionChange={(newSelection) => {
                  setSelectedSegmentIds(newSelection)
                  if (currentHero) {
                    const updatedHero: Hero = {
                      ...currentHero,
                      geneBuild: { segmentIds: newSelection },
                      stats: genomeToStats(newSelection, segments),
                    }
                    setCurrentHero(updatedHero)
                  }
                }}
              />
            </div>

            <div className="mt-4 flex gap-2 justify-center">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-4 py-2 border-2 font-mono uppercase tracking-wider text-sm transition-colors ${
                    difficulty === diff
                      ? diff === 'easy'
                        ? 'bg-green-500 border-green-300 text-white'
                        : diff === 'medium'
                          ? 'bg-yellow-500 border-yellow-300 text-white'
                          : 'bg-red-500 border-red-300 text-white'
                      : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleStartMission}
                disabled={!canStart}
                className={`px-8 py-4 border-2 font-mono uppercase tracking-wider text-lg transition-colors pixel-shadow ${
                  canStart
                    ? 'bg-cyan-500 border-cyan-300 text-white hover:bg-cyan-600 cursor-pointer'
                    : 'bg-slate-800 border-slate-600 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isStarting ? 'Starting...' : 'Start Mission'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border-2 border-slate-600 bg-slate-900 p-4 pixel-shadow">
              <h2 className="text-lg font-mono uppercase tracking-wider mb-4 text-cyan-400">
                Current Hero
              </h2>
              {currentHero ? (
                <>
                  <p className="text-sm font-mono text-white mb-2">{currentHero.name}</p>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Attack</span>
                      <span className="text-orange-400">{currentHero.stats.attack}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Defense</span>
                      <span className="text-green-400">{currentHero.stats.defense}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Stability</span>
                      <span className="text-cyan-400">{currentHero.stats.stability}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-1">Points: {currentHero.totalPoints}</p>
                    <p className="text-xs text-slate-400">Wins: {currentHero.totalWins}</p>
                  </div>
                  {currentHero.badges.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {currentHero.badges.map((badge) => (
                        <PixelBadgeIcon key={badge} type={badge as any} size={24} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400 font-mono">No hero selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SafeAreaContainer>
  )
}

