import { NextResponse } from 'next/server'

const hostedManifestUrl =
  'https://api.farcaster.xyz/miniapps/hosted-manifest/019af893-b769-c17b-5896-d372883da1cd'

export async function GET() {
  return NextResponse.redirect(hostedManifestUrl, 307)
}

