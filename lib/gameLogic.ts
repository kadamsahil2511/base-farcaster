export type GenomeSegment = {
  id: string
  angleStart: number
  angleEnd: number
  gcContent: number // 0-1
  mutationRate: number // 0-1
  expressionLevel: number // 0-1
  cluster: 'G1' | 'G2' | 'G3' | 'G4'
}

export type GeneBuild = {
  segmentIds: string[]
}

export type HeroStats = {
  attack: number
  defense: number
  stability: number
}

export type BattleOutcome = {
  win: boolean
  rounds: number
  heroHpRemaining: number
  zombieHpRemaining: number
  pointsEarned: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export type Hero = {
  id: string
  name: string
  fid: number // Farcaster user ID
  stats: HeroStats
  geneBuild: GeneBuild
  totalWins: number
  totalPoints: number
  badges: BadgeType[]
  createdAt: number
}

export type Zombie = {
  id: string
  attack: number
  defense: number
  hp: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export type BadgeType =
  | 'firstFold'
  | 'stableGenome'
  | 'mutationMaster'
  | 'zombieEradicator'
  | 'dailyTop'
  | 'comboWizard'

export type Battle = {
  id: string
  fid: number
  heroId: string
  zombieId?: string
  outcome: BattleOutcome
  timestamp: number
}

const SEGMENTS_COUNT = 72
const ANGLE_PER_SEGMENT = 360 / SEGMENTS_COUNT

export function generateGenomeSegments(): GenomeSegment[] {
  const segments: GenomeSegment[] = []
  const clusters: ('G1' | 'G2' | 'G3' | 'G4')[] = ['G1', 'G2', 'G3', 'G4']

  for (let i = 0; i < SEGMENTS_COUNT; i++) {
    const angleStart = i * ANGLE_PER_SEGMENT
    const angleEnd = (i + 1) * ANGLE_PER_SEGMENT
    const cluster = clusters[i % clusters.length]

    segments.push({
      id: `segment-${i}`,
      angleStart,
      angleEnd,
      gcContent: Math.random(),
      mutationRate: Math.random(),
      expressionLevel: Math.random(),
      cluster,
    })
  }

  return segments
}

export function genomeToStats(segmentIds: string[], segments: GenomeSegment[]): HeroStats {
  const selectedSegments = segments.filter((s) => segmentIds.includes(s.id))

  if (selectedSegments.length === 0) {
    return { attack: 10, defense: 10, stability: 10 }
  }

  // Calculate stats based on segment properties
  const avgGcContent =
    selectedSegments.reduce((sum, s) => sum + s.gcContent, 0) / selectedSegments.length
  const avgMutationRate =
    selectedSegments.reduce((sum, s) => sum + s.mutationRate, 0) / selectedSegments.length
  const avgExpressionLevel =
    selectedSegments.reduce((sum, s) => sum + s.expressionLevel, 0) / selectedSegments.length

  // Attack based on expression level and GC content
  const attack = Math.round(10 + avgExpressionLevel * 30 + avgGcContent * 20)

  // Defense based on stability (inverse of mutation rate) and GC content
  const defense = Math.round(10 + (1 - avgMutationRate) * 30 + avgGcContent * 15)

  // Stability based on low mutation rate and high GC content
  const stability = Math.round(10 + (1 - avgMutationRate) * 25 + avgGcContent * 20)

  return { attack, defense, stability }
}

export function simulateBattle(
  hero: Hero,
  zombie: Zombie,
  difficulty: 'easy' | 'medium' | 'hard'
): BattleOutcome {
  let heroHp = 100
  let zombieHp = zombie.hp
  let rounds = 0
  const maxRounds = 50

  while (heroHp > 0 && zombieHp > 0 && rounds < maxRounds) {
    rounds++

    // Hero attacks
    const heroDamage = Math.max(1, hero.stats.attack - zombie.defense + Math.floor(Math.random() * 5))
    zombieHp = Math.max(0, zombieHp - heroDamage)

    if (zombieHp <= 0) break

    // Zombie attacks
    const zombieDamage = Math.max(1, zombie.attack - hero.stats.defense + Math.floor(Math.random() * 5))
    heroHp = Math.max(0, heroHp - zombieDamage)
  }

  const win = zombieHp <= 0
  const pointsEarned = calculatePoints({ win, rounds, heroHpRemaining: heroHp, zombieHpRemaining: zombieHp, pointsEarned: 0, difficulty }, difficulty)

  return {
    win,
    rounds,
    heroHpRemaining: heroHp,
    zombieHpRemaining: zombieHp,
    pointsEarned,
    difficulty,
  }
}

export function calculatePoints(outcome: BattleOutcome, difficulty: 'easy' | 'medium' | 'hard'): number {
  const difficultyMultiplier = { easy: 1, medium: 2, hard: 3 }[difficulty]

  if (outcome.win) {
    // Base points for winning
    let points = 50 * difficultyMultiplier

    // Bonus for finishing quickly
    if (outcome.rounds <= 5) points += 30
    else if (outcome.rounds <= 10) points += 15

    // Bonus for high HP remaining
    const hpBonus = Math.floor((outcome.heroHpRemaining / 100) * 20)
    points += hpBonus

    return points
  }

  // Small consolation points for losing
  return Math.max(5, 10 - outcome.rounds)
}

export function checkBadges(hero: Hero, battle: Battle): BadgeType[] {
  const newBadges: BadgeType[] = []

  // FirstFold: First battle
  if (hero.totalWins === 0 && battle.outcome.win) {
    newBadges.push('firstFold')
  }

  // StableGenome: Win with high stability
  if (battle.outcome.win && hero.stats.stability >= 40) {
    newBadges.push('stableGenome')
  }

  // MutationMaster: Win with high mutation rate segments
  if (battle.outcome.win && battle.outcome.rounds <= 5) {
    newBadges.push('mutationMaster')
  }

  // ZombieEradicator: Win 10 battles
  if (hero.totalWins >= 9 && battle.outcome.win) {
    newBadges.push('zombieEradicator')
  }

  // ComboWizard: Win 3 battles in a row (would need to track streak)
  // This is simplified - in real implementation, track win streak
  if (battle.outcome.win && battle.outcome.rounds <= 3) {
    newBadges.push('comboWizard')
  }

  return newBadges.filter((badge) => !hero.badges.includes(badge))
}

export function generateZombie(difficulty: 'easy' | 'medium' | 'hard'): Zombie {
  const baseStats = {
    easy: { attack: 15, defense: 10, hp: 50 },
    medium: { attack: 25, defense: 15, hp: 80 },
    hard: { attack: 35, defense: 20, hp: 120 },
  }[difficulty]

  return {
    id: `zombie-${Date.now()}-${Math.random()}`,
    attack: baseStats.attack + Math.floor(Math.random() * 10),
    defense: baseStats.defense + Math.floor(Math.random() * 5),
    hp: baseStats.hp + Math.floor(Math.random() * 20),
    difficulty,
  }
}

