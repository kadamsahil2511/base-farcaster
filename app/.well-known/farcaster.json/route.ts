import { NextResponse } from 'next/server'

// Serve a static Farcaster miniapp manifest directly from the app.
// Update the fields below if you change your app domain or assets.
export const revalidate = 0

export async function GET() {
  const manifest = {
    miniapp: {
      version: '1',
      name: 'Genome Hunters',
      iconUrl: 'https://base-farcaster-eta.vercel.app/img',
      homeUrl: 'https://base-farcaster-eta.vercel.app/',
      subtitle: 'Hunt Demons',
      description:
        'Gnome Hunters is a fast, science-themed mini-game where you decode circular genome patterns, build powerful gene-infused heroes, and battle waves of mutated zombies.',
      primaryCategory: 'games',
      splashImageUrl: 'https://base-farcaster-eta.vercel.app/img',
      splashBackgroundColor: '#000000',
      canonicalDomain: 'base-farcaster-eta.vercel.app',
    },
  }

  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'cache-control': 'no-store',
    },
  })
}

