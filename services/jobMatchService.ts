import { JobMatchResult } from "@/types";

export async function matchJobDescription(resumeText: string, jobDescription: string): Promise<JobMatchResult> {
  const response = await fetch("/api/job-match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeText, jobDescription }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to match job description");
  }

  return response.json();
}
