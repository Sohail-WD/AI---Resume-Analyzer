export type TargetRole = "Frontend Developer" | "Full Stack Developer" | "Backend Developer" | "AI/ML Intern";

export interface Skill {
  name: string;
  score: number;
  category: "Languages" | "Frameworks" | "Tools" | "Concepts";
}

export interface ProjectImpact {
  name: string;
  complexity: number;
  impact: number;
  relevance: number;
}

export interface Recommendation {
  id: string;
  type: "critical" | "warning" | "suggestion" | "praise";
  message: string;
  actionable: boolean;
}

export interface AnalysisResult {
  overallMatch: number;
  atsCompatibility: number;
  projectsAnalyzed: number;
  recommendationsCount: number;
  skills: Skill[];
  projects: ProjectImpact[];
  recommendations: Recommendation[];
  role: TargetRole;
}
