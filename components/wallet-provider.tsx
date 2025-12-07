"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { projectId, wagmiAdapter } from "@/config";

// Create a Query Client for React Query
const queryClient = new QueryClient();

// Check for required environment variable
if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Initialize Reown AppKit (browser wallet modal) - metadata URL will use actual page URL
if (typeof window !== "undefined") {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [base],
    defaultNetwork: base,
    metadata: {
      name: "Farcaster Wallet Example",
      description: "Wallet provider for Farcaster MiniApp",
      url: window.location.origin, // Use actual page URL to avoid mismatch warnings
      icons: [`${window.location.origin}/img`], // Use dark themed logo
    },
    features: {
      analytics: true, // optional
    },
  });
}

// Main Provider
export default function WalletProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  // Initialize Farcaster MiniApp + Wagmi from cookies (session persistence)
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies ?? undefined
  );

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
