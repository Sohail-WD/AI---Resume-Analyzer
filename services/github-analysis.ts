/**
 * services/github-analysis.ts
 * Client-side wrapper around the /api/github route.
 */

import { GitHubProfile } from "@/types";

/**
 * Fetch a real GitHub profile from our backend proxy.
 * The backend handles GitHub API auth, rate limiting, and error mapping.
 */
export async function fetchGitHubProfile(
  username: string
): Promise<GitHubProfile> {
  const res = await fetch(
    `/api/github?username=${encodeURIComponent(username.trim())}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: string }).error;
    if (res.status === 404) {
      throw new Error(msg ?? `GitHub user "${username}" not found`);
    }
    if (res.status === 429) {
      throw new Error(msg ?? "GitHub API rate limit exceeded. Try again later.");
    }
    throw new Error(msg ?? "Failed to fetch GitHub profile");
  }

  return res.json() as Promise<GitHubProfile>;
}
