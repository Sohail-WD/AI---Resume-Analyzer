import { AnalysisResult, Skill, ProjectImpact, Recommendation } from "../types/analyzer";

export const mockSkills: Skill[] = [
  { name: "React", score: 95, category: "Frameworks" },
  { name: "TypeScript", score: 90, category: "Languages" },
  { name: "Node.js", score: 85, category: "Frameworks" },
  { name: "GraphQL", score: 80, category: "Tools" },
  { name: "System Design", score: 75, category: "Concepts" },
  { name: "Docker", score: 60, category: "Tools" },
];

export const mockProjects: ProjectImpact[] = [
  { name: "E-commerce Platform", complexity: 85, impact: 90, relevance: 95 },
  { name: "Real-time Chat App", complexity: 75, impact: 80, relevance: 85 },
  { name: "Internal Dashboard", complexity: 60, impact: 70, relevance: 65 },
  { name: "Portfolio Site", complexity: 40, impact: 50, relevance: 55 },
];

export const mockRecommendations: Recommendation[] = [
  { id: "1", type: "critical", message: "Missing system design vocabulary for Senior roles. Add 'microservices' and 'scalability' contexts.", actionable: true },
  { id: "2", type: "suggestion", message: "Highlight performance metrics in 'E-commerce Platform' bullet points (e.g., 'Reduced load time by 40%').", actionable: true },
  { id: "3", type: "praise", message: "Strong modern frontend stack. React and TypeScript synergy is highly visible.", actionable: false },
  { id: "4", type: "warning", message: "ATS readability issue: Complex multi-column layout detected in resume PDF. Consider a single-column format.", actionable: true },
];

export const mockAnalysisResult: AnalysisResult = {
  overallMatch: 87,
  atsCompatibility: 72,
  projectsAnalyzed: 14,
  recommendationsCount: mockRecommendations.length,
  skills: mockSkills,
  projects: mockProjects,
  recommendations: mockRecommendations,
  role: "Full Stack Engineer"
};
