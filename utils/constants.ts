import { TargetRole } from "@/types";

export const TARGET_ROLES: TargetRole[] = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Cloud Architect",
  "Mobile Developer",
  "Security Engineer",
  "QA Engineer",
];

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Results", href: "/dashboard/results", icon: "BarChart3" },
  { label: "History", href: "/dashboard/history", icon: "Clock" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Rust: "#CE412B",
  Go: "#00ADD8",
  Java: "#ED8B00",
  "C++": "#00599C",
  C: "#555555",
  Ruby: "#CC342D",
  Swift: "#FA7343",
  Kotlin: "#7F52FF",
  Dart: "#0175C2",
  PHP: "#777BB4",
  "C#": "#239120",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Shell: "#89E051",
  Vue: "#4FC08D",
  Svelte: "#FF3E00",
};

export const MOCK_ANALYSIS_DELAY = 3000;

export const SCORE_LABELS = {
  0: "Poor",
  20: "Fair",
  40: "Below Average",
  60: "Average",
  70: "Good",
  80: "Very Good",
  90: "Excellent",
  100: "Perfect",
};

export const getScoreLabel = (score: number): string => {
  const thresholds = [90, 80, 70, 60, 40, 20, 0];
  for (const t of thresholds) {
    if (score >= t) return SCORE_LABELS[t as keyof typeof SCORE_LABELS];
  }
  return "Poor";
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#00D4FF";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
};
