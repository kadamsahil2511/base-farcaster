'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'
import { HeroCard } from '@/components/HeroCard'
import {
  generateZombie,
  simulateBattle,
  checkBadges,
  type Hero,
  type Battle,
  type Zombie,
} from '@/lib/gameLogic'
import { getHeroes, saveHero, saveBattle } from '@/lib/storage'

export default function MultiplayerLobbyScreen() {
  const { context } = useFrame()
  const router = useRouter()
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const fid = context?.user.fid || 0
  const username = context?.user.username || 'Guest'

  useEffect(() => {
    if (fid > 0) {
      const userHeroes = getHeroes(fid)
      setHeroes(userHeroes)
      if (userHeroes.length > 0) {
        setSelectedHeroId(userHeroes[0].id)
      }
    }
  }, [fid])

  const handleStartMission = async () => {
    if (!selectedHeroId) {
      alert('Please select a hero')
      return
    }

    const hero = heroes.find((h) => h.id === selectedHeroId)
    if (!hero) {
      alert('Hero not found')
      return
    }

    setIsStarting(true)

    try {
      // Fetch a random past battle from another player to use as enemy config
      const battlesResponse = await fetch('/api/battles?limit=50')
      const battlesData = await battlesResponse.json()
      const otherBattles = battlesData.battles?.filter((b: Battle) => b.fid !== fid) || []

      let zombie: Zombie
      if (otherBattles.length > 0) {
        // Use stats from a past battle
        const randomBattle = otherBattles[Math.floor(Math.random() * otherBattles.length)]
        zombie = {
          id: `zombie-${Date.now()}`,
          attack: 20 + Math.floor(Math.random() * 20),
          defense: 15 + Math.floor(Math.random() * 15),
          hp: 80 + Math.floor(Math.random() * 40),
          difficulty: 'medium',
        }
      } else {
        // Fallback to generated zombie
        zombie = generateZombie('medium')
      }

      // Simulate battle
      const outcome = simulateBattle(hero, zombie, 'medium')

      // Check for new badges
      const battle: Battle = {
        id: `battle-${Date.now()}`,
        fid,
        heroId: hero.id,
        zombieId: zombie.id,
        outcome,
        timestamp: Date.now(),
      }

      const newBadges = checkBadges(hero, battle)
      const updatedHero: Hero = {
        ...hero,
        badges: [...hero.badges, ...newBadges],
      }

      if (outcome.win) {
        updatedHero.totalWins += 1
      }
      updatedHero.totalPoints += outcome.pointsEarned

      // Save everything
      saveHero(updatedHero)
      saveBattle(battle)

      // Update leaderboard
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          username,
          totalPoints: updatedHero.totalPoints,
        }),
      })

      // Save battle to API
      await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battle),
      })

      // Navigate to result
      router.push(
        `/result?outcome=${outcome.win ? 'win' : 'loss'}&points=${outcome.pointsEarned}&heroId=${hero.id}`
      )
    } catch (error) {
      console.error('Multiplayer battle error:', error)
      alert('Failed to start battle')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div className="min-h-screen bg-pixel-navy text-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="px-4 py-2 border-2 border-slate-600 bg-slate-900 text-slate-300 font-mono uppercase tracking-wider text-sm hover:bg-slate-800 transition-colors pixel-shadow-sm"
          >
            ← Home
          </Link>
          <h1 className="text-xl font-mono uppercase tracking-widest">Zombies Mode</h1>
          <div className="w-20" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Title card */}
          <div className="border-2 border-pink-400 bg-slate-900 p-6 pixel-shadow mb-6">
            <h2 className="text-2xl font-mono uppercase tracking-widest mb-2 text-pink-400">
              Fight with all your heroes
            </h2>
            <p className="text-slate-400 font-mono text-sm">
              Your hero's genome pattern becomes their defense. Fight zombie waves derived from
              other players' past fights.
            </p>
          </div>

          {/* Hero selection */}
          {heroes.length === 0 ? (
            <div className="text-center py-12 border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow">
              <p className="text-slate-400 font-mono uppercase tracking-wider mb-4">
                No heroes available
              </p>
              <Link
                href="/heroes"
                className="inline-block px-6 py-3 border-2 border-cyan-400 bg-cyan-500 text-white font-mono uppercase tracking-wider hover:bg-cyan-600 transition-colors pixel-shadow-sm"
              >
                Create Hero
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-mono uppercase tracking-wider mb-4 text-cyan-400">
                  Select Hero
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {heroes.map((hero) => (
                    <HeroCard
                      key={hero.id}
                      hero={hero}
                      isSelected={selectedHeroId === hero.id}
                      onSelect={() => setSelectedHeroId(hero.id)}
                      mini={false}
                    />
                  ))}
                </div>
              </div>

              {/* Start Mission button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleStartMission}
                  disabled={!selectedHeroId || isStarting}
                  className={`px-8 py-4 border-2 font-mono uppercase tracking-wider text-lg transition-colors pixel-shadow ${
                    selectedHeroId && !isStarting
                      ? 'bg-pink-500 border-pink-300 text-white hover:bg-pink-600 cursor-pointer'
                      : 'bg-slate-800 border-slate-600 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isStarting ? 'Starting...' : 'Start Mission'}
                </button>
              </div>

              {/* Test Lab card */}
              <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow">
                <h3 className="text-lg font-mono uppercase tracking-wider mb-2 text-slate-300">
                  Test your character
                </h3>
                <p className="text-slate-400 font-mono text-sm mb-4">
                  Test your character against zombies' past fights.
                </p>
                <Link
                  href="/test-lab"
                  className="inline-block px-6 py-3 border-2 border-slate-600 bg-slate-800 text-slate-300 font-mono uppercase tracking-wider hover:bg-slate-700 transition-colors pixel-shadow-sm"
                >
                  Go to Test Lab
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </SafeAreaContainer>
  )
}

