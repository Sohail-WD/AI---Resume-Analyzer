/**
 * app/api/analyze/route.ts
 * POST /api/analyze
 * Orchestrates: GitHub profile fetch + Gemini AI analysis → AnalysisResult
 */

import { NextRequest, NextResponse } from "next/server";
import { AnalysisInput, AnalysisResult, SkillScore, GitHubProfile } from "@/types";
import { analyzeWithGemini, buildAnalysisPrompt } from "@/lib/gemini";
import { fetchGitHubProfile } from "@/lib/github";

export const runtime = "nodejs";

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Build a concise GitHub summary string to inject into the Gemini prompt.
 * Keeps token usage low while giving Gemini enough context.
 */
function buildGitHubSummary(profile: GitHubProfile): string {
  const langs = profile.topLanguages
    .map((l) => `${l.language} (${l.percentage}%)`)
    .join(", ");

  const repos = profile.recentRepos
    .map(
      (r) =>
        `  - ${r.name} [${r.language}] ★${r.stars}: ${r.description || "No description"}`
    )
    .join("\n");

  return [
    `Username: @${profile.username}`,
    `Name: ${profile.name}`,
    `Public repos: ${profile.repos}`,
    `Total stars: ${profile.stars}`,
    `Followers: ${profile.followers}`,
    `Top languages: ${langs}`,
    `Portfolio strength score: ${profile.contributionScore}/100`,
    `Top repositories:\n${repos}`,
  ].join("\n");
}

/**
 * Generate skill scores for the radar chart based on Gemini scores.
 * We derive per-skill breakdown from the AI analysis scores + role context.
 */
function generateSkillScores(
  geminiResumeScore: number,
  geminiAtsScore: number,
  targetRole: string
): SkillScore[] {
  const roleSkillMap: Record<string, string[]> = {
    "Frontend Engineer": ["React/Vue", "TypeScript", "CSS/Design", "Performance", "Testing"],
    "Backend Engineer": ["Node.js/Python", "Databases", "APIs/REST", "Docker/Cloud", "Security"],
    "Full Stack Engineer": ["Frontend", "Backend", "Databases", "DevOps", "Architecture"],
    "Data Scientist": ["Python/R", "ML/Deep Learning", "Statistics", "SQL/Data", "Visualization"],
    "ML Engineer": ["Python", "ML Frameworks", "MLOps", "Cloud/Infra", "Research"],
    "DevOps Engineer": ["CI/CD", "Docker/K8s", "Cloud", "IaC/Terraform", "Monitoring"],
    "Product Manager": ["Strategy", "Analytics", "Communication", "Roadmapping", "User Research"],
    "UI/UX Designer": ["Figma/Design", "User Research", "Prototyping", "Visual Design", "Accessibility"],
    "Cloud Architect": ["AWS/GCP/Azure", "Networking", "Security", "IaC", "Cost Optimization"],
    "Mobile Developer": ["React Native/Flutter", "iOS/Android", "APIs", "Performance", "Publishing"],
    "Security Engineer": ["Penetration Testing", "SIEM/SOC", "Cryptography", "Cloud Security", "Compliance"],
    "QA Engineer": ["Test Automation", "Manual Testing", "CI/CD", "Bug Tracking", "Performance Testing"],
  };

  const skills = roleSkillMap[targetRole] ?? [
    "Technical Skills", "Problem Solving", "Communication", "Collaboration", "Tools",
  ];

  const base = (geminiResumeScore + geminiAtsScore) / 2;

  return skills.map((skill, i) => {
    // Add slight variation per skill
    const variance = (((i * 7 + 3) % 20) - 10);
    const score = clamp(base + variance);
    const category: SkillScore["category"] =
      i < 3 ? "technical" : i === 3 ? "tools" : "soft";
    return { skill, score, maxScore: 100, category };
  });
}

/**
 * Generate section scores for the bar chart.
 * Derived from Gemini's resume/ATS scores with realistic per-section variation.
 */
function generateSectionScores(
  resumeScore: number,
  atsScore: number
): AnalysisResult["sectionScores"] {
  const avg = (resumeScore + atsScore) / 2;
  return [
    {
      section: "Contact Info",
      score: clamp(avg + 15),
      feedback: "Ensure email, LinkedIn, and GitHub are present",
    },
    {
      section: "Summary",
      score: clamp(resumeScore - 8),
      feedback: "Tailor your summary to the target role",
    },
    {
      section: "Experience",
      score: clamp(resumeScore + 3),
      feedback: "Quantify achievements with metrics and impact",
    },
    {
      section: "Education",
      score: clamp(avg + 10),
      feedback: "Include relevant coursework and academic projects",
    },
    {
      section: "Skills",
      score: clamp(atsScore),
      feedback: "Add role-specific keywords to improve ATS match",
    },
    {
      section: "Projects",
      score: clamp(resumeScore - 5),
      feedback: "Link to live demos or GitHub repositories",
    },
  ];
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log("[analyze] New analysis request received");

  let body: AnalysisInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { resumeText, githubUsername, targetRole } = body;

  if (!resumeText?.trim()) {
    return NextResponse.json(
      { error: "resumeText is required" },
      { status: 400 }
    );
  }
  if (!targetRole) {
    return NextResponse.json(
      { error: "targetRole is required" },
      { status: 400 }
    );
  }

  console.log(`[analyze] Target role: "${targetRole}"`);
  console.log(`[analyze] Resume text length: ${resumeText.length} chars`);
  console.log(`[analyze] GitHub username: ${githubUsername || "not provided"}`);

  // ── Step 1: Fetch GitHub profile (optional) ───────────────────────────────
  let githubProfile: GitHubProfile | null = null;
  let githubSummary: string | undefined;

  if (githubUsername?.trim()) {
    try {
      console.log(`[analyze] Fetching GitHub profile for @${githubUsername}`);
      githubProfile = await fetchGitHubProfile(githubUsername.trim());
      githubSummary = buildGitHubSummary(githubProfile);
      console.log("[analyze] GitHub profile fetched successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.warn(`[analyze] GitHub fetch failed (non-fatal): ${msg}`);
      // Non-fatal — proceed without GitHub data
    }
  }

  // ── Step 2: Build prompt and call Gemini ──────────────────────────────────
  const prompt = buildAnalysisPrompt({
    resumeText,
    targetRole,
    githubSummary,
  });

  console.log("[analyze] Calling Gemini 1.5 Flash...");

  let gemini;
  try {
    gemini = await analyzeWithGemini(prompt);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[analyze] Gemini error:", msg);

    // ── FALLBACK: If quota exceeded (429), use realistic mock data ──
    if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
      console.warn("[analyze] Quota exceeded. Using realistic mock fallback for demo purposes.");
      gemini = {
        isMock: true,
        resumeScore: 72 + Math.floor(Math.random() * 10),
        atsScore: 65 + Math.floor(Math.random() * 15),
        missingKeywords: ["CI/CD", "Docker", "System Design", "Unit Testing", "Kubernetes"],
        suggestions: [
          "Add more quantified achievements (e.g., 'reduced latency by 20%')",
          "Tailor your professional summary to highlight " + targetRole + " skills",
          "Ensure your contact information is clearly visible at the top",
          "Include a dedicated 'Skills' section with categorized technologies"
        ],
        skillsToLearn: ["Advanced TypeScript", "Cloud Infrastructure (AWS/GCP)", "Microservices Architecture"],
        internshipReadiness: "Moderate",
        githubFeedback: githubProfile 
          ? "Your GitHub shows good potential with " + githubProfile.repos + " repos. Focus on documenting your top projects better."
          : undefined
      };
    } else {
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  console.log(`[analyze] Gemini scores — Resume: ${gemini.resumeScore}, ATS: ${gemini.atsScore}`);

  // ── Step 3: Compute derived scores ───────────────────────────────────────
  const githubScore = githubProfile ? githubProfile.contributionScore : 0;
  const matchScore = clamp(
    (gemini.resumeScore * 0.5 + gemini.atsScore * 0.5 + (githubScore > 0 ? 5 : 0))
  );
  const overallScore = githubScore
    ? clamp(gemini.resumeScore * 0.4 + gemini.atsScore * 0.3 + githubScore * 0.3)
    : clamp(gemini.resumeScore * 0.55 + gemini.atsScore * 0.45);

  // ── Step 4: Generate supplementary data ──────────────────────────────────
  const skillScores = generateSkillScores(
    gemini.resumeScore,
    gemini.atsScore,
    targetRole
  );

  const radarData = [
    { subject: "Technical", A: clamp(gemini.resumeScore + 5), fullMark: 100 },
    { subject: "ATS Match", A: gemini.atsScore, fullMark: 100 },
    { subject: "Projects", A: clamp(githubScore || gemini.resumeScore - 10), fullMark: 100 },
    { subject: "Keywords", A: matchScore, fullMark: 100 },
    { subject: "Soft Skills", A: clamp(gemini.resumeScore - 10), fullMark: 100 },
    { subject: "Portfolio", A: clamp(githubScore || gemini.resumeScore - 15), fullMark: 100 },
  ];

  // Derive presentKeywords from top languages + common terms found in resume
  const presentKeywords: string[] = [];
  const COMMON_KEYWORDS = [
    "React", "TypeScript", "JavaScript", "Python", "Node.js", "SQL",
    "Git", "Docker", "AWS", "REST APIs", "GraphQL", "Next.js", "Vue",
    "Java", "Go", "Rust", "Kubernetes", "CI/CD", "Agile", "Scrum",
    "MongoDB", "PostgreSQL", "Redis", "Machine Learning", "TensorFlow",
    "PyTorch", "Figma", "Linux", "Bash", "HTML", "CSS", "Swift", "Kotlin",
  ];
  const resumeLower = resumeText.toLowerCase();
  for (const kw of COMMON_KEYWORDS) {
    if (resumeLower.includes(kw.toLowerCase())) {
      presentKeywords.push(kw);
    }
  }

  // ── Step 5: Assemble final result ─────────────────────────────────────────
  const result: AnalysisResult = {
    id: `analysis_${Date.now()}`,
    timestamp: new Date().toISOString(),
    targetRole,
    overallScore,
    resumeScore: gemini.resumeScore,
    atsScore: gemini.atsScore,
    githubScore,
    matchScore,
    skillScores,
    strengths: gemini.suggestions.slice(0, 2).map((s) => `✓ ${s}`).concat([
      "Resume demonstrates relevant technical experience",
      githubProfile ? `Active GitHub with ${githubProfile.repos} public repositories` : "Portfolio ready to build on",
    ]),
    weaknesses: gemini.missingKeywords.slice(0, 3).map((kw) => `Missing keyword: "${kw}"`),
    recommendations: gemini.suggestions,
    suggestions: gemini.suggestions,
    missingKeywords: gemini.missingKeywords,
    presentKeywords: presentKeywords.slice(0, 12),
    skillsToLearn: gemini.skillsToLearn,
    internshipReadiness: gemini.internshipReadiness,
    githubFeedback: gemini.githubFeedback ?? (githubProfile
      ? `Your GitHub portfolio shows activity with ${githubProfile.repos} repositories and ${githubProfile.stars} total stars. Consider pinning your best projects for maximum impact.`
      : ""),
    radarData,
    github: githubProfile,
    sectionScores: generateSectionScores(gemini.resumeScore, gemini.atsScore),
    isMock: !!gemini.isMock,
  };

  const elapsed = Date.now() - startTime;
  console.log(`[analyze] Complete in ${elapsed}ms — overall score: ${overallScore}`);

  return NextResponse.json(result);
}
