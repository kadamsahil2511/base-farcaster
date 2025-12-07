import type { Hero, Battle, GeneBuild } from './gameLogic'

const STORAGE_PREFIX = 'gnome-hunter-'

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`
}

export function getHeroes(fid: number): Hero[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(getKey(`heroes-${fid}`))
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveHero(hero: Hero): void {
  if (typeof window === 'undefined') return
  try {
    const heroes = getHeroes(hero.fid)
    const index = heroes.findIndex((h) => h.id === hero.id)
    if (index >= 0) {
      heroes[index] = hero
    } else {
      heroes.push(hero)
    }
    localStorage.setItem(getKey(`heroes-${hero.fid}`), JSON.stringify(heroes))
  } catch (error) {
    console.error('Failed to save hero:', error)
  }
}

export function getLastHeroId(fid: number): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(getKey(`lastHeroId-${fid}`))
  } catch {
    return null
  }
}

export function saveLastHeroId(fid: number, heroId: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getKey(`lastHeroId-${fid}`), heroId)
  } catch (error) {
    console.error('Failed to save last hero ID:', error)
  }
}

export function getBattles(fid: number): Battle[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(getKey(`battles-${fid}`))
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveBattle(battle: Battle): void {
  if (typeof window === 'undefined') return
  try {
    const battles = getBattles(battle.fid)
    battles.push(battle)
    // Keep only last 100 battles
    const recentBattles = battles.slice(-100)
    localStorage.setItem(getKey(`battles-${battle.fid}`), JSON.stringify(recentBattles))
  } catch (error) {
    console.error('Failed to save battle:', error)
  }
}

export function getGeneBuild(heroId: string): GeneBuild | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(getKey(`geneBuild-${heroId}`))
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveGeneBuild(heroId: string, geneBuild: GeneBuild): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getKey(`geneBuild-${heroId}`), JSON.stringify(geneBuild))
  } catch (error) {
    console.error('Failed to save gene build:', error)
  }
}

export function getTotalPoints(fid: number): number {
  const heroes = getHeroes(fid)
  return heroes.reduce((sum, hero) => sum + hero.totalPoints, 0)
}

