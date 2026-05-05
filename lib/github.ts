/**
 * lib/github.ts
 * GitHub REST API v3 client for fetching real profile + repository data.
 * Supports optional GITHUB_TOKEN env var for higher rate limits (5000 req/hr vs 60).
 */

import { GitHubProfile, GitHubRepo } from "@/types";
import { LANGUAGE_COLORS } from "@/utils/constants";

const BASE_URL = "https://api.github.com";

/** Build auth headers if a GitHub token is configured */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/** Raw GitHub user response shape (subset we care about) */
interface GHUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  company: string | null;
  twitter_username: string | null;
  created_at: string;
}

/** Raw GitHub repo response shape (subset) */
interface GHRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  fork: boolean;
  private: boolean;
}

/**
 * Fetch full GitHub profile including top repositories and language statistics.
 * Throws typed errors for 404 (not found) and 403 (rate limited).
 */
export async function fetchGitHubProfile(
  username: string
): Promise<GitHubProfile> {
  const headers = getHeaders();

  // ── 1. Fetch user profile ─────────────────────────────────────────────────
  const userRes = await fetch(`${BASE_URL}/users/${username}`, {
    headers,
    next: { revalidate: 0 }, // always fresh
  });

  if (userRes.status === 404) {
    throw new Error(`GitHub user "${username}" not found.`);
  }
  if (userRes.status === 403) {
    throw new Error(
      "GitHub API rate limit exceeded. Add a GITHUB_TOKEN to .env.local for higher limits."
    );
  }
  if (!userRes.ok) {
    throw new Error(
      `GitHub API error: ${userRes.status} ${userRes.statusText}`
    );
  }

  const user: GHUser = await userRes.json();

  // ── 2. Fetch repositories (up to 100, sorted by stars) ───────────────────
  const reposRes = await fetch(
    `${BASE_URL}/users/${username}/repos?per_page=100&sort=stars&direction=desc`,
    { headers, next: { revalidate: 0 } }
  );

  let repos: GHRepo[] = [];
  if (reposRes.ok) {
    repos = await reposRes.json();
    // Filter out forks and private repos
    repos = repos.filter((r) => !r.fork && !r.private);
  }

  // ── 3. Calculate total star count ────────────────────────────────────────
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  // ── 4. Build language distribution from repo language fields ─────────────
  const langCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] ?? 0) + 1;
    }
  }

  const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(langCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / Math.max(totalLangRepos, 1)) * 100),
      color: LANGUAGE_COLORS[language] ?? "#8B8B8B",
    }));

  // Ensure percentages sum to 100
  if (topLanguages.length > 0) {
    const sum = topLanguages.reduce((s, l) => s + l.percentage, 0);
    const diff = 100 - sum;
    topLanguages[topLanguages.length - 1].percentage += diff;
  }

  // ── 5. Compute a simple portfolio strength score (0–100) ─────────────────
  // Factors: repo count, total stars, language diversity, account age
  const repoCountScore = Math.min(repos.length * 2, 40); // max 40
  const starScore = Math.min(totalStars / 10, 30); // max 30
  const diversityScore = Math.min(Object.keys(langCounts).length * 3, 20); // max 20
  const ageScore = (() => {
    const created = new Date(user.created_at).getFullYear();
    const now = new Date().getFullYear();
    return Math.min((now - created) * 2, 10); // max 10
  })();
  const contributionScore = Math.round(
    repoCountScore + starScore + diversityScore + ageScore
  );

  // ── 6. Top repositories (up to 5) ────────────────────────────────────────
  const recentRepos: GitHubRepo[] = repos.slice(0, 5).map((r) => ({
    name: r.name,
    description: r.description ?? "",
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language ?? "Unknown",
    url: r.html_url,
    updatedAt: r.updated_at,
  }));

  return {
    username: user.login,
    name: user.name ?? user.login,
    avatar: user.avatar_url,
    bio: user.bio ?? "",
    repos: user.public_repos,
    followers: user.followers,
    following: user.following,
    stars: totalStars,
    topLanguages,
    contributionScore,
    recentRepos,
    location: user.location ?? undefined,
    blog: user.blog ?? undefined,
    company: user.company ?? undefined,
    twitterUsername: user.twitter_username ?? undefined,
    createdAt: user.created_at,
  };
}
