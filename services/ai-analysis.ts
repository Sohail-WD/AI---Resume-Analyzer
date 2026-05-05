/**
 * services/ai-analysis.ts
 * Client-side orchestration service for the two-step upload → analyze flow.
 */

import { AnalysisInput, AnalysisResult, ResumeData } from "@/types";
import { UploadResult } from "@/types/analysis";

/**
 * Upload a PDF file to /api/upload and return the extracted text + metadata.
 */
export async function uploadResumePDF(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    // Don't set Content-Type — browser sets it with the correct boundary
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? `Upload failed (${res.status})`
    );
  }

  return res.json() as Promise<UploadResult>;
}

/**
 * Convert an UploadResult to a ResumeData object (for dashboard state).
 */
export function uploadResultToResumeData(upload: UploadResult): ResumeData {
  return {
    rawText: upload.text,
    fileName: upload.fileName,
    fileSize: upload.fileSize,
    wordCount: upload.wordCount,
    pageCount: upload.pageCount,
  };
}

/**
 * Send resume text + GitHub username + target role to /api/analyze.
 * Returns the full AnalysisResult from Gemini AI.
 */
export async function runAIAnalysis(
  input: AnalysisInput
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? `Analysis failed (${res.status})`
    );
  }

  return res.json() as Promise<AnalysisResult>;
}
