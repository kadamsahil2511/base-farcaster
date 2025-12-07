import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/img`,
  button: {
    title: 'Launch Helix Hunter',
    action: {
      type: 'launch_frame',
      name: 'Helix Hunter',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/img`,
      splashBackgroundColor: '#020617',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Helix Hunter - Genome Battle Game',
    openGraph: {
      title: 'Helix Hunter',
      description: 'A retro pixel-art genome battle game on Farcaster',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}
