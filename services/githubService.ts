export async function fetchGitHubProfile(username: string) {
  const response = await fetch(`/api/github?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub profile");
  }

  return response.json();
}
