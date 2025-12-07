'use client'

import { HomeScreen } from './HomeScreen'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'

// Development mode: allow game to run without Farcaster SDK for local testing
const DEV_MODE = process.env.NODE_ENV === 'development'

export default function Home() {
  const { context, isLoading, isSDKLoaded } = useFrame()

  if (isLoading && !DEV_MODE) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8 bg-black">
          <h1 className="text-3xl font-bold text-center text-white uppercase tracking-wider border-4 border-white bg-white text-black px-6 py-4 brutalism-shadow">
            Loading...
          </h1>
        </div>
      </SafeAreaContainer>
    )
  }

  // In development mode, show the game even without SDK
  // In production, require SDK (must be in Farcaster client)
  if (!isSDKLoaded && !DEV_MODE) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8 bg-black">
          <h1 className="text-3xl font-bold text-center text-white uppercase tracking-wider border-4 border-white bg-white text-black px-6 py-4 brutalism-shadow">
            No farcaster SDK found, please use this miniapp in the farcaster app
          </h1>
        </div>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <HomeScreen />
    </SafeAreaContainer>
  )
}
