import { AnalysisResult, TargetRole } from "../types/analyzer";
import { mockAnalysisResult } from "../lib/mockData";

export const analyzeProfile = async (
  resumeFile: File | null,
  githubUrl: string,
  role: TargetRole
): Promise<AnalysisResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    ...mockAnalysisResult,
    role
  };
};
