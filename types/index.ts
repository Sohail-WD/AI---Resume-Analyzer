export type TargetRole =
  | "Frontend Engineer"
  | "Backend Engineer"
  | "Full Stack Engineer"
  | "Data Scientist"
  | "ML Engineer"
  | "DevOps Engineer"
  | "Product Manager"
  | "UI/UX Designer"
  | "Cloud Architect"
  | "Mobile Developer"
  | "Security Engineer"
  | "QA Engineer";

export interface SkillScore {
  skill: string;
  score: number;
  maxScore: number;
  category: "technical" | "soft" | "tools";
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  forks: number;
  updatedAt: string;
}

export interface GitHubProfile {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  repos: number;
  followers: number;
  following: number;
  stars: number;
  topLanguages: { language: string; percentage: number; color: string }[];
  contributionScore: number;
  recentRepos: GitHubRepo[];
  location?: string;
  blog?: string;
  company?: string;
  twitterUsername?: string;
  createdAt?: string;
}

export interface ResumeData {
  rawText: string;
  fileName: string;
  fileSize: number;
  wordCount?: number;
  pageCount?: number;
}

export interface AnalysisInput {
  resumeText: string;
  githubUsername: string;
  targetRole: TargetRole;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  targetRole: TargetRole;
  overallScore: number;
  resumeScore: number;
  atsScore: number;
  githubScore: number;
  matchScore: number;
  skillScores: SkillScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suggestions: string[];
  missingKeywords: string[];
  presentKeywords: string[];
  skillsToLearn: string[];
  internshipReadiness: string;
  githubFeedback: string;
  radarData: { subject: string; A: number; fullMark: number }[];
  github: GitHubProfile | null;
  sectionScores: {
    section: string;
    score: number;
    feedback: string;
  }[];
  isMock?: boolean;
}

export interface DashboardState {
  resumeData: ResumeData | null;
  githubUsername: string;
  targetRole: TargetRole | "";
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  error: string | null;
}
