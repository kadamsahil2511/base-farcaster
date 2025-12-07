'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
import { PixelLogoHelix } from '@/components/svg/PixelLogoHelix'
import { PixelBadgeIcon } from '@/components/svg/PixelBadgeIcon'
import { getHeroes, getTotalPoints } from '@/lib/storage'

type LeaderboardEntry = {
  fid: number
  username: string
  totalPoints: number
  rank?: number
}

export function HomeScreen() {
  const { context } = useFrame()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [userBadges, setUserBadges] = useState<string[]>([])

  const fid = context?.user.fid || 0
  const username = context?.user.username || 'Guest'

  useEffect(() => {
    // Fetch leaderboard
    fetch('/api/leaderboard?limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard)
        }
      })
      .catch(console.error)

    // Get user points and badges
    if (fid > 0) {
      const points = getTotalPoints(fid)
      setUserPoints(points)
      const heroes = getHeroes(fid)
      const allBadges = new Set<string>()
      heroes.forEach((hero) => {
        hero.badges.forEach((badge) => allBadges.add(badge))
      })
      setUserBadges(Array.from(allBadges))
    }
  }, [fid])

  return (
    <div className="min-h-screen bg-pixel-navy text-white p-4">
      {/* Header */}
      <header className="mb-6 border-2 border-slate-600 bg-slate-900 p-4 pixel-shadow">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="w-12 h-12">
            <PixelLogoHelix className="w-full h-full" />
          </div>

          {/* Title */}
          <h1 className="text-xl font-mono uppercase tracking-widest text-center flex-1">
            Helix Hunter
          </h1>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-mono uppercase text-slate-400">{username}</p>
              <p className="text-sm font-mono text-cyan-400">{userPoints} pts</p>
            </div>
            <div className="flex gap-1">
              {userBadges.slice(0, 3).map((badge) => (
                <PixelBadgeIcon key={badge} type={badge as any} size={20} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content - 3 columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Left column */}
        <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow">
          <h2 className="text-lg font-mono uppercase tracking-wider mb-4 text-cyan-400">
            Genome Hunt
          </h2>
          <p className="text-sm text-slate-400 mb-4 font-mono">
            Select genome segments to build your hero and battle zombies.
          </p>
          <Link
            href="/singleplayer"
            className="block w-full py-3 px-4 bg-cyan-500 border-2 border-cyan-300 text-white font-mono uppercase tracking-wider text-center hover:bg-cyan-600 transition-colors mb-2 pixel-shadow-sm"
          >
            Genome Hunt
          </Link>
          <Link
            href="/heroes"
            className="block w-full py-3 px-4 bg-slate-800 border-2 border-slate-600 text-slate-300 font-mono uppercase tracking-wider text-center hover:bg-slate-700 transition-colors pixel-shadow-sm"
          >
            Resume Old Heroes
          </Link>
        </div>

        {/* Center column */}
        <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow flex flex-col items-center justify-center">
          <div className="w-48 h-48 mb-4">
            <PixelLogoHelix className="w-full h-full" />
          </div>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider text-center">
            Tap genome rings to build your hero
          </p>
        </div>

        {/* Right column */}
        <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow">
          <h2 className="text-lg font-mono uppercase tracking-wider mb-4 text-pink-400">
            Zombies Lab
          </h2>
          <p className="text-sm text-slate-400 mb-4 font-mono">
            Experiment with zombie waves from other players.
          </p>
          <Link
            href="/multiplayer"
            className="block w-full py-3 px-4 bg-pink-500 border-2 border-pink-300 text-white font-mono uppercase tracking-wider text-center hover:bg-pink-600 transition-colors mb-4 pixel-shadow-sm"
          >
            Multiplayer Mode
          </Link>

          {/* Leaderboard */}
          <div className="mt-4">
            <h3 className="text-sm font-mono uppercase tracking-wider mb-2 text-slate-400">
              Top Players
            </h3>
            <div className="space-y-1">
              {leaderboard.map((entry) => (
                <div
                  key={entry.fid}
                  className="flex items-center justify-between text-xs font-mono py-1"
                >
                  <div className="flex items-center gap-2">
                    {entry.rank === 1 && <span className="text-yellow-400">👑</span>}
                    <span className="text-slate-300">{entry.username}</span>
                  </div>
                  <span className="text-cyan-400">{entry.totalPoints}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

