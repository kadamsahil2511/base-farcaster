import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/img`,
  button: {
    title: 'Launch Gnome Hunter',
    action: {
      type: 'launch_frame',
      name: 'Gnome Hunter',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/img`,
      splashBackgroundColor: '#020617',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Gnome Hunter - Genome Battle Game',
    openGraph: {
      title: 'Gnome Hunter',
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
