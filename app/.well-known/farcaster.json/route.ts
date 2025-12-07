import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    // TODO: Add your own account association
    "frame": {
    "name": "Genome Hunters",
    "version": "1",
    "iconUrl": "https://base-farcaster-eta.vercel.app/img",
    "homeUrl": "https://base-farcaster-eta.vercel.app/",
    "subtitle": "Hunt Demons",
    "description": "Gnome Hunters is a fast, science-themed mini-game where you decode circular genome patterns, build powerful gene-infused heroes, and battle waves of mutated zombies. Select DNA segments, unlock badges, climb the leaderboard, and compete in single-player or asynchronous multiplayer modes—all inside a sleek Farcaster mini-app.",
    "primaryCategory": "games",
    "splashImageUrl": "https://base-farcaster-eta.vercel.app/img",
    "splashBackgroundColor": "#000000"
  },
  };

  return NextResponse.json(farcasterConfig);
}


// {
//   "frame": {
//     "name": "Genome Hunters",
//     "version": "1",
//     "iconUrl": "https://base-farcaster-eta.vercel.app/img",
//     "homeUrl": "https://base-farcaster-eta.vercel.app/",
//     "subtitle": "Hunt Demons",
//     "description": "Gnome Hunters is a fast, science-themed mini-game where you decode circular genome patterns, build powerful gene-infused heroes, and battle waves of mutated zombies. Select DNA segments, unlock badges, climb the leaderboard, and compete in single-player or asynchronous multiplayer modes—all inside a sleek Farcaster mini-app.",
//     "primaryCategory": "games",
//     "splashImageUrl": "https://base-farcaster-eta.vercel.app/img",
//     "splashBackgroundColor": "#000000"
//   }
// }