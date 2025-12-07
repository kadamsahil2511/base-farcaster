'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'
import { HeroCard } from '@/components/HeroCard'
import { generateGenomeSegments, genomeToStats, type Hero } from '@/lib/gameLogic'
import { getHeroes, saveHero, saveLastHeroId, getGeneBuild } from '@/lib/storage'

export default function HeroRosterScreen() {
  const { context } = useFrame()
  const router = useRouter()
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const fid = context?.user.fid || 0
  const username = context?.user.username || 'Guest'

  useEffect(() => {
    if (fid > 0) {
      const userHeroes = getHeroes(fid)
      setHeroes(userHeroes)
      const lastHeroId = localStorage.getItem(`gnome-hunter-lastHeroId-${fid}`)
      if (lastHeroId) {
        setSelectedHeroId(lastHeroId)
      }
    }
  }, [fid])

  const handleSelectHero = (heroId: string) => {
    setSelectedHeroId(heroId)
    if (fid > 0) {
      saveLastHeroId(fid, heroId)
    }
  }

  const handleCreateHero = () => {
    if (fid === 0) {
      alert('Please log in to create a hero')
      return
    }

    setIsCreating(true)

    try {
      const segments = generateGenomeSegments()
      // Select random 3-5 segments
      const segmentCount = 3 + Math.floor(Math.random() * 3)
      const selectedSegments = segments
        .sort(() => Math.random() - 0.5)
        .slice(0, segmentCount)
        .map((s) => s.id)

      const stats = genomeToStats(selectedSegments, segments)
      const heroNumber = heroes.length + 1
      const geneHash = selectedSegments
        .map((id) => id.split('-')[1])
        .join('')
        .slice(0, 3)
        .toUpperCase()

      const newHero: Hero = {
        id: `hero-${Date.now()}`,
        name: `${username}#${geneHash}`,
        fid,
        stats,
        geneBuild: { segmentIds: selectedSegments },
        totalWins: 0,
        totalPoints: 0,
        badges: [],
        createdAt: Date.now(),
      }

      saveHero(newHero)
      saveLastHeroId(fid, newHero.id)
      setHeroes([...heroes, newHero])
      setSelectedHeroId(newHero.id)
      router.push('/singleplayer')
    } catch (error) {
      console.error('Failed to create hero:', error)
      alert('Failed to create hero')
    } finally {
      setIsCreating(false)
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
          <h1 className="text-xl font-mono uppercase tracking-widest">Hero Roster</h1>
          <div className="w-20" />
        </div>

        {/* Create New Hero button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleCreateHero}
            disabled={isCreating}
            className={`px-6 py-3 border-2 font-mono uppercase tracking-wider transition-colors pixel-shadow ${
              isCreating
                ? 'bg-slate-800 border-slate-600 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-500 border-cyan-300 text-white hover:bg-cyan-600 cursor-pointer'
            }`}
          >
            {isCreating ? 'Creating...' : 'Create New Hero'}
          </button>
        </div>

        {/* Hero grid */}
        {heroes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 font-mono uppercase tracking-wider mb-4">
              No heroes yet
            </p>
            <p className="text-sm text-slate-500 font-mono">
              Create your first hero to start hunting genomes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {heroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                isSelected={selectedHeroId === hero.id}
                onSelect={() => handleSelectHero(hero.id)}
              />
            ))}
          </div>
        )}
      </div>
    </SafeAreaContainer>
  )
}

