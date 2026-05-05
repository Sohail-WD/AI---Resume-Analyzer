/**
 * app/api/github/verify/route.ts
 * GET /api/github/verify?username=...
 * Quickly checks if a GitHub user exists.
 */

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.github.com";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`${BASE_URL}/users/${username}`, {
      headers,
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (res.status === 404) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    return NextResponse.json({ exists: true }, { status: 200 });
  } catch (err) {
    console.error("[github-verify] Error:", err);
    return NextResponse.json({ error: "Failed to verify GitHub user" }, { status: 500 });
  }
}
