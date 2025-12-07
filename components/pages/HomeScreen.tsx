'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useFrame } from '@/components/farcaster-provider'
import { PixelBadgeIcon } from '@/components/svg/PixelBadgeIcon'
import { getHeroes, getTotalPoints } from '@/lib/storage'
import Image from 'next/image'

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
    <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden">
      {/* Translucent background logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-full h-full opacity-10">
          <Image
            src="/images/gnome-logo.png"
            alt="Gnome Hunter Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="mb-6 border-4 border-black bg-black p-4 brutalism-shadow">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h1 className="text-2xl font-bold uppercase tracking-widest text-center flex-1 text-white">
              Gnome Hunter
            </h1>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right border-4 border-black bg-white px-3 py-2">
                <p className="text-xs font-bold uppercase text-black">{username}</p>
                <p className="text-sm font-bold text-black">{userPoints} pts</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left column */}
          <div className="border-4 border-black bg-white p-6 brutalism-shadow">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-black">
              Genome Hunt
            </h2>
            <p className="text-sm text-black mb-4 font-bold">
              Select genome segments to build your hero and battle zombies.
            </p>
            <Link
              href="/singleplayer"
              className="block w-full py-4 px-4 bg-black border-4 border-black text-white font-bold uppercase tracking-wider text-center hover:bg-white hover:text-black transition-all mb-3 brutalism-shadow-sm"
            >
              Genome Hunt
            </Link>
            <Link
              href="/heroes"
              className="block w-full py-4 px-4 bg-white border-4 border-black text-black font-bold uppercase tracking-wider text-center hover:bg-black hover:text-white transition-all brutalism-shadow-sm"
            >
              Resume Old Heroes
            </Link>
          </div>

          {/* Center column */}
          <div className="border-4 border-black bg-white p-6 brutalism-shadow flex flex-col items-center justify-center">
            <p className="text-sm text-black font-bold uppercase tracking-wider text-center">
              Tap genome rings to build your hero
            </p>
          </div>

          {/* Right column */}
          <div className="border-4 border-black bg-white p-6 brutalism-shadow">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-black">
              Zombies Lab
            </h2>
            <p className="text-sm text-black mb-4 font-bold">
              Experiment with zombie waves from other players.
            </p>
            <Link
              href="/multiplayer"
              className="block w-full py-4 px-4 bg-black border-4 border-black text-white font-bold uppercase tracking-wider text-center hover:bg-white hover:text-black transition-all mb-4 brutalism-shadow-sm"
            >
              Multiplayer Mode
            </Link>

            {/* Leaderboard */}
            <div className="mt-4 border-4 border-black bg-black p-3">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
                Top Players
              </h3>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.fid}
                    className="flex items-center justify-between text-xs font-bold py-2 px-2 bg-white border-2 border-black"
                  >
                    <div className="flex items-center gap-2">
                      {entry.rank === 1 && <span className="text-black">👑</span>}
                      <span className="text-black">{entry.username}</span>
                    </div>
                    <span className="text-black font-bold">{entry.totalPoints}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

