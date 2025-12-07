import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const LEADERBOARD_KEY = 'gnome-hunter-leaderboard'
const LEADERBOARD_LIMIT = 100

type LeaderboardEntry = {
  fid: number
  username: string
  totalPoints: number
  rank?: number
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get all leaderboard entries
    const entries = await redis.zrevrange(LEADERBOARD_KEY, 0, limit - 1, {
      withScores: true,
    })

    // Format entries with ranks
    const leaderboard: LeaderboardEntry[] = []
    if (Array.isArray(entries)) {
      for (let i = 0; i < entries.length; i += 2) {
        const entryData = entries[i]
        const score = entries[i + 1] as number
        if (entryData && typeof entryData === 'string') {
          try {
            const entry = JSON.parse(entryData) as LeaderboardEntry
            leaderboard.push({
              ...entry,
              totalPoints: score,
              rank: leaderboard.length + 1,
            })
          } catch {
            // Skip invalid entries
          }
        }
      }
    }

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Leaderboard GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fid, username, totalPoints } = body as {
      fid: number
      username: string
      totalPoints: number
    }

    if (!fid || typeof totalPoints !== 'number') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Store entry data
    const entry: LeaderboardEntry = {
      fid,
      username: username || `user-${fid}`,
      totalPoints,
    }

    // Remove old entry if exists
    const oldEntries = await redis.zrange(LEADERBOARD_KEY, 0, -1)
    if (Array.isArray(oldEntries)) {
      for (const oldEntry of oldEntries) {
        if (typeof oldEntry === 'string') {
          try {
            const parsed = JSON.parse(oldEntry) as LeaderboardEntry
            if (parsed.fid === fid) {
              await redis.zrem(LEADERBOARD_KEY, oldEntry)
            }
          } catch {
            // Skip invalid entries
          }
        }
      }
    }

    // Update leaderboard sorted set (score = totalPoints)
    await redis.zadd(LEADERBOARD_KEY, {
      score: totalPoints,
      member: JSON.stringify(entry),
    })

    // Get current rank
    const rank = await redis.zrevrank(LEADERBOARD_KEY, JSON.stringify(entry))

    return NextResponse.json({
      success: true,
      rank: rank !== null ? rank + 1 : null,
    })
  } catch (error) {
    console.error('Leaderboard POST error:', error)
    return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 })
  }
}

