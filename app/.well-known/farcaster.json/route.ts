import { NextResponse } from "next/server";

export async function GET() {
  // Redirect to Farcaster hosted manifest
  const hostedManifestUrl = "https://api.farcaster.xyz/miniapps/hosted-manifest/019af893-b769-c17b-5896-d372883da1cd";
  
  return NextResponse.redirect(hostedManifestUrl, 307);
}

