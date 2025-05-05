import { NextRequest, NextResponse } from "next/server";

const clientId = process.env.TWITCH_CLIENT_ID!;
const redirectUri = process.env.TWITCH_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=user:read:email`;
  return NextResponse.redirect(url);
}
