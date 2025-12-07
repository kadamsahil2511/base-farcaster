'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'
import { PixelHeroSprite } from '@/components/svg/PixelHeroSprite'
import { PixelZombieSprite } from '@/components/svg/PixelZombieSprite'
import { simulateBattle, type Hero, type Battle, type Zombie } from '@/lib/gameLogic'
import { getHeroes, saveBattle } from '@/lib/storage'

export default function TestLabScreen() {
  const { context } = useFrame()
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [battles, setBattles] = useState<Battle[]>([])
  const [selectedHeroId, setSelectedHeroId] = useState<string>('')
  const [selectedBattleId, setSelectedBattleId] = useState<string>('')
  const [testResult, setTestResult] = useState<{
    win: boolean
    rounds: number
    heroHp: number
    zombieHp: number
    points: number
  } | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const fid = context?.user.fid || 0

  useEffect(() => {
    if (fid > 0) {
      const userHeroes = getHeroes(fid)
      setHeroes(userHeroes)
      if (userHeroes.length > 0) {
        setSelectedHeroId(userHeroes[0].id)
      }
    }

    // Fetch battles for enemy selection
    fetch('/api/battles?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.battles) {
          setBattles(data.battles)
        }
      })
      .catch(console.error)
  }, [fid])

  const handleRunTest = () => {
    if (!selectedHeroId) {
      alert('Please select a hero')
      return
    }

    if (!selectedBattleId) {
      alert('Please select an enemy configuration')
      return
    }

    const hero = heroes.find((h) => h.id === selectedHeroId)
    const battle = battles.find((b) => b.id === selectedBattleId)

    if (!hero || !battle) {
      alert('Invalid selection')
      return
    }

    setIsRunning(true)

    // Create zombie from battle config
    const zombie: Zombie = {
      id: `zombie-test-${Date.now()}`,
      attack: 20 + Math.floor(Math.random() * 20),
      defense: 15 + Math.floor(Math.random() * 15),
      hp: 80 + Math.floor(Math.random() * 40),
      difficulty: battle.outcome.difficulty,
    }

    // Simulate battle
    const outcome = simulateBattle(hero, zombie, battle.outcome.difficulty)

    setTestResult({
      win: outcome.win,
      rounds: outcome.rounds,
      heroHp: outcome.heroHpRemaining,
      zombieHp: outcome.zombieHpRemaining,
      points: outcome.pointsEarned,
    })

    setIsRunning(false)
  }

  const handlePromoteToRanked = async () => {
    if (!testResult || !selectedHeroId || !selectedBattleId) return

    const hero = heroes.find((h) => h.id === selectedHeroId)
    const battle = battles.find((b) => b.id === selectedBattleId)

    if (!hero || !battle) return

    const zombie: Zombie = {
      id: `zombie-${Date.now()}`,
      attack: 20 + Math.floor(Math.random() * 20),
      defense: 15 + Math.floor(Math.random() * 15),
      hp: 80 + Math.floor(Math.random() * 40),
      difficulty: battle.outcome.difficulty,
    }

    const outcome = simulateBattle(hero, zombie, battle.outcome.difficulty)

    const rankedBattle: Battle = {
      id: `battle-${Date.now()}`,
      fid,
      heroId: hero.id,
      zombieId: zombie.id,
      outcome,
      timestamp: Date.now(),
    }

    // Save and update
    saveBattle(rankedBattle)
    await fetch('/api/battles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rankedBattle),
    })

    alert('Battle promoted to ranked!')
  }

  const selectedHero = heroes.find((h) => h.id === selectedHeroId)
  const variant = selectedHero?.name.includes('Knight')
    ? 'knight'
    : selectedHero?.name.includes('Scientist')
      ? 'scientist'
      : 'robot'
  const tone = selectedHero?.stats.attack && selectedHero.stats.attack > selectedHero.stats.defense
    ? 'red'
    : selectedHero?.stats.defense && selectedHero.stats.defense > selectedHero.stats.stability
      ? 'green'
      : 'blue'

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div className="min-h-screen bg-pixel-navy text-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/multiplayer"
            className="px-4 py-2 border-2 border-slate-600 bg-slate-900 text-slate-300 font-mono uppercase tracking-wider text-sm hover:bg-slate-800 transition-colors pixel-shadow-sm"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-mono uppercase tracking-widest">Test Lab</h1>
          <div className="w-20" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow mb-6">
            <h2 className="text-2xl font-mono uppercase tracking-widest mb-2 text-cyan-400">
              Test your character against zombies' past fights
            </h2>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Hero selector */}
            <div className="border-2 border-slate-600 bg-slate-900 p-4 pixel-shadow">
              <label className="block text-sm font-mono uppercase tracking-wider mb-2 text-slate-400">
                Select Hero
              </label>
              <select
                value={selectedHeroId}
                onChange={(e) => setSelectedHeroId(e.target.value)}
                className="w-full p-2 bg-slate-800 border-2 border-slate-600 text-white font-mono"
              >
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Enemy selector */}
            <div className="border-2 border-slate-600 bg-slate-900 p-4 pixel-shadow">
              <label className="block text-sm font-mono uppercase tracking-wider mb-2 text-slate-400">
                Select Enemy Configuration
              </label>
              <select
                value={selectedBattleId}
                onChange={(e) => setSelectedBattleId(e.target.value)}
                className="w-full p-2 bg-slate-800 border-2 border-slate-600 text-white font-mono"
              >
                <option value="">Select a battle...</option>
                {battles.map((battle) => (
                  <option key={battle.id} value={battle.id}>
                    Battle {new Date(battle.timestamp).toLocaleDateString()} -{' '}
                    {battle.outcome.difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Run Test button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRunTest}
              disabled={!selectedHeroId || !selectedBattleId || isRunning}
              className={`px-8 py-4 border-2 font-mono uppercase tracking-wider text-lg transition-colors pixel-shadow ${
                selectedHeroId && selectedBattleId && !isRunning
                  ? 'bg-cyan-500 border-cyan-300 text-white hover:bg-cyan-600 cursor-pointer'
                  : 'bg-slate-800 border-slate-600 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isRunning ? 'Running Test...' : 'Run Test'}
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className="border-2 border-cyan-400 bg-slate-900 p-6 pixel-shadow">
              <h3 className="text-lg font-mono uppercase tracking-wider mb-4 text-cyan-400">
                Test Result
              </h3>

              {/* Sprites and outcome */}
              <div className="flex items-center justify-center gap-8 mb-6">
                {selectedHero && (
                  <div className="flex flex-col items-center">
                    <PixelHeroSprite variant={variant} tone={tone} size={64} />
                    <p className="text-xs text-slate-400 font-mono mt-2">{selectedHero.name}</p>
                  </div>
                )}
                <div className="text-xl font-mono">
                  {testResult.win ? '✓' : '✗'}
                </div>
                <div className="flex flex-col items-center">
                  <PixelZombieSprite size={64} />
                  <p className="text-xs text-slate-400 font-mono mt-2">Zombie</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-mono">
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-1">Outcome</p>
                  <p className={testResult.win ? 'text-cyan-400' : 'text-red-400'}>
                    {testResult.win ? 'WIN' : 'LOSS'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-1">Rounds</p>
                  <p className="text-white">{testResult.rounds}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-1">Hero HP</p>
                  <p className="text-green-400">{testResult.heroHp}/100</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-1">Points</p>
                  <p className="text-cyan-400">{testResult.points}</p>
                </div>
              </div>

              {/* Promote button */}
              <div className="flex justify-center">
                <button
                  onClick={handlePromoteToRanked}
                  className="px-6 py-3 border-2 border-yellow-400 bg-yellow-500 text-white font-mono uppercase tracking-wider hover:bg-yellow-600 transition-colors pixel-shadow-sm"
                >
                  Promote to Ranked Battle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SafeAreaContainer>
  )
}

