/**
 * services/analyzeService.ts
 * Updated to use the real AI analysis service (upload → analyze).
 * Kept backward-compatible with existing dashboard page usage.
 */

import { AnalysisInput, AnalysisResult } from "@/types";
import { runAIAnalysis } from "@/services/ai-analysis";

/**
 * Run a full AI-powered resume analysis.
 * Calls /api/analyze with resume text, optional GitHub username, and target role.
 */
export async function analyzeResume(input: AnalysisInput): Promise<AnalysisResult> {
  return runAIAnalysis(input);
}
