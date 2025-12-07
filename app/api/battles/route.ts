import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import type { Battle } from '@/lib/gameLogic'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const BATTLES_KEY = 'helix-hunter-battles'
const BATTLES_LIMIT = 1000

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fid = searchParams.get('fid')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    if (fid) {
      // Get battles for specific user
      const key = `${BATTLES_KEY}:fid:${fid}`
      const battles = await redis.lrange<Battle[]>(key, 0, limit - 1)
      return NextResponse.json({ battles: battles || [] })
    }

    // Get recent battles from all users (for multiplayer enemy selection)
    const allBattlesKey = `${BATTLES_KEY}:all`
    const battles = await redis.lrange<Battle[]>(allBattlesKey, 0, limit - 1)
    return NextResponse.json({ battles: battles || [] })
  } catch (error) {
    console.error('Battles GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch battles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const battle = (await request.json()) as Battle

    if (!battle.id || !battle.fid || !battle.outcome) {
      return NextResponse.json({ error: 'Invalid battle data' }, { status: 400 })
    }

    // Store battle for user
    const userBattlesKey = `${BATTLES_KEY}:fid:${battle.fid}`
    await redis.lpush(userBattlesKey, battle)
    await redis.ltrim(userBattlesKey, 0, BATTLES_LIMIT - 1)

    // Also add to global recent battles (for multiplayer)
    const allBattlesKey = `${BATTLES_KEY}:all`
    await redis.lpush(allBattlesKey, battle)
    await redis.ltrim(allBattlesKey, 0, BATTLES_LIMIT - 1)

    return NextResponse.json({ success: true, battle })
  } catch (error) {
    console.error('Battles POST error:', error)
    return NextResponse.json({ error: 'Failed to save battle' }, { status: 500 })
  }
}

