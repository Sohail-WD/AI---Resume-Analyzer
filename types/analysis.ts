/**
 * Strict shape that Gemini 1.5 Flash MUST return as JSON.
 * We force this via the system prompt and validate it on the backend.
 */
export interface GeminiRawResponse {
  resumeScore: number;
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  skillsToLearn: string[];
  internshipReadiness: string;
  githubFeedback?: string;
}

/**
 * Validated + normalised version after server-side processing.
 * All numbers are clamped 0-100, arrays are guaranteed non-null.
 */
export interface GeminiAnalysis {
  resumeScore: number;
  atsScore: number;
  missingKeywords: string[];
  suggestions: string[];
  skillsToLearn: string[];
  internshipReadiness: string;
  githubFeedback: string;
}

/** Result from the /api/upload route */
export interface UploadResult {
  text: string;
  wordCount: number;
  pageCount: number;
  fileName: string;
  fileSize: number;
}
