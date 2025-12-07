import { NextResponse } from "next/server";
import { APP_URL } from "@/lib/constants";

export async function GET() {
  const farcasterConfig = {
    // TODO: Add your own account association
    // accountAssociation: {
    //   header: "",
    //   payload: "",
    //   signature: ""
    // },
    frame: {
      version: "1",
      name: "Genome Hunters",
      iconUrl: `${APP_URL}/img`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      screenshotUrls: [],
      tags: ["games", "farcaster", "miniapp", "gnome", "hunters"],
      primaryCategory: "games",
      buttonTitle: "Launch Genome Hunters",
      splashImageUrl: `${APP_URL}/img`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${APP_URL}/api/webhook`,
      subtitle: "Hunt Demons",
      description: "Gnome Hunters is a fast, science-themed mini-game where you decode circular genome patterns, build powerful gene-infused heroes, and battle waves of mutated zombies. Select DNA segments, unlock badges, climb the leaderboard, and compete in single-player or asynchronous multiplayer modes—all inside a sleek Farcaster mini-app.",
    },
  };

  return NextResponse.json(farcasterConfig);
}

