'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
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
      <div className="flex items-center justify-between mb-4">
        <div className="w-24" />
        <h1 className="text-2xl font-mono uppercase tracking-widest">Genome Hunt</h1>
        <div className="flex items-center gap-3">
          <div className="text-right border-2 border-slate-600 bg-slate-900 px-3 py-2 pixel-shadow-sm">
            <p className="text-xs font-mono uppercase text-slate-200">{username}</p>
            <p className="text-sm font-mono text-cyan-300">{userPoints} pts</p>
          </div>
          <div className="flex gap-1">
            {userBadges.slice(0, 3).map((badge) => (
              <PixelBadgeIcon key={badge} type={badge as any} size={20} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Left: Play */}
        <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow">
          <h2 className="text-lg font-mono uppercase tracking-wider mb-3 text-cyan-400">
            Start Playing
          </h2>
          <p className="text-sm text-slate-300 mb-4">
            Select genome segments to build your hero and battle zombies.
          </p>
          <div className="space-y-3">
            <Link
              href="/singleplayer"
              className="block w-full text-center px-4 py-3 border-2 border-cyan-400 bg-cyan-500 text-white font-mono uppercase tracking-wider hover:bg-cyan-600 transition-colors pixel-shadow-sm"
            >
              Genome Hunt
            </Link>
            <Link
              href="/heroes"
              className="block w-full text-center px-4 py-3 border-2 border-slate-600 bg-slate-800 text-slate-200 font-mono uppercase tracking-wider hover:bg-slate-700 transition-colors pixel-shadow-sm"
            >
              Resume Heroes
            </Link>
          </div>
        </div>

        {/* Center: Info */}
        <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow flex flex-col items-center justify-center text-center gap-3">
          <p className="text-sm font-mono uppercase tracking-wider text-slate-300">
            Tap genome rings to build your hero
          </p>
          <p className="text-xs font-mono text-slate-400">
            Earn points, unlock badges, and climb the leaderboard.
          </p>
        </div>

        {/* Right: Leaderboard */}
        <div className="border-2 border-slate-600 bg-slate-900 p-6 pixel-shadow">
          <h2 className="text-lg font-mono uppercase tracking-wider mb-4 text-cyan-400">
            Top Players
          </h2>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.fid}
                className="flex items-center justify-between text-xs font-mono py-2 px-2 bg-slate-800 border border-slate-700"
              >
                <div className="flex items-center gap-2">
                  {entry.rank === 1 && <span className="text-yellow-400">👑</span>}
                  <span className="text-white">{entry.username}</span>
                </div>
                <span className="text-cyan-300 font-bold">{entry.totalPoints}</span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-xs text-slate-500 text-center">No leaderboard data yet</p>
            )}
          </div>
          <div className="mt-6">
            <Link
              href="/multiplayer"
              className="block w-full text-center px-4 py-3 border-2 border-orange-400 bg-orange-500 text-white font-mono uppercase tracking-wider hover:bg-orange-600 transition-colors pixel-shadow-sm"
            >
              Multiplayer Lab
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

