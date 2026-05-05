/**
 * app/api/github/route.ts
 * GET /api/github?username=<username>
 * Fetches a real GitHub profile using the GitHub REST API v3.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubProfile } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json(
      { error: "username query parameter is required" },
      { status: 400 }
    );
  }

  // Basic username format validation (GitHub allows alphanumeric + hyphens)
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
    return NextResponse.json(
      { error: "Invalid GitHub username format" },
      { status: 400 }
    );
  }

  console.log(`[github] Fetching profile for: ${username}`);

  try {
    const profile = await fetchGitHubProfile(username);
    console.log(
      `[github] Success — ${profile.repos} repos, ${profile.stars} stars, ${profile.topLanguages.length} languages`
    );
    return NextResponse.json(profile);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error(`[github] Error for "${username}":`, msg);

    // Distinguish between user-facing errors and internal errors
    if (msg.includes("not found")) {
      return NextResponse.json({ error: msg }, { status: 404 });
    }
    if (msg.includes("rate limit")) {
      return NextResponse.json({ error: msg }, { status: 429 });
    }
    return NextResponse.json(
      { error: "Failed to fetch GitHub profile. Please try again." },
      { status: 500 }
    );
  }
}
