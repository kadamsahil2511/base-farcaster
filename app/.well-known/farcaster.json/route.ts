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
    "accountAssociation": {
    "header": "eyJmaWQiOjEzOTEzMjUsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgxMWY5M0VGZDRkODRFNTA2MGEzMWEyRDE3YmY0OTA4MjYxNDgzNGQ2In0",
    "payload": "eyJkb21haW4iOiJiYXNlLWZhcmNhc3Rlci1ldGEudmVyY2VsLmFwcCJ9",
    "signature": "802l7b6L2fv3+HWEbNJqqy/UX1x8cXsfbGqr9eEJmy8ekoDSRgmTa8ILMFWutrER8ckxJZ9vljKcPFkcsDeEdRw="
  },
  }

  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'cache-control': 'no-store',
    },
  })
}

