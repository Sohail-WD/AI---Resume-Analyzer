/**
 * lib/gemini.ts
 * Google Gemini 1.5 Flash client with robust JSON extraction and fallback parsing.
 * Forces strict JSON-only responses from the model via system instructions.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiRawResponse } from "@/types/analysis";

// ── Initialise the SDK ────────────────────────────────────────────────────────
function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your .env.local file."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

// ── Default fallback values (prevent crashes if Gemini returns partial data) ──
const FALLBACK: GeminiRawResponse = {
  resumeScore: 50,
  atsScore: 50,
  missingKeywords: [],
  suggestions: ["Review your resume and ensure it is well-formatted."],
  skillsToLearn: [],
  internshipReadiness: "Moderate",
  githubFeedback: undefined,
};

/**
 * Clamp a value to [0, 100] and ensure it's a number.
 */
function clamp(val: unknown, fallback: number): number {
  const n = Number(val);
  if (isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Ensure a value is a non-empty string array.
 */
function toStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.filter((v) => typeof v === "string" && v.trim().length > 0);
}

/**
 * Extract JSON from a Gemini response string.
 * Handles:
 *   - Plain JSON: { ... }
 *   - Markdown-fenced: ```json\n{...}\n```
 *   - Extra text before/after the JSON block
 */
function extractJSON(raw: string): unknown {
  // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // fall through to next strategy
    }
  }

  // 2. Find first { ... } block in the raw string
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch {
      // fall through to fallback
    }
  }

  // 3. Try parsing the whole string as-is
  try {
    return JSON.parse(raw.trim());
  } catch {
    return null;
  }
}

/**
 * Validate and normalise a parsed Gemini response object.
 * Missing or malformed fields are replaced with safe defaults.
 */
function normalise(parsed: unknown): GeminiRawResponse {
  if (!parsed || typeof parsed !== "object") return { ...FALLBACK };

  const p = parsed as Record<string, unknown>;

  return {
    resumeScore: clamp(p.resumeScore, FALLBACK.resumeScore),
    atsScore: clamp(p.atsScore, FALLBACK.atsScore),
    missingKeywords: toStringArray(p.missingKeywords),
    suggestions: toStringArray(p.suggestions).length
      ? toStringArray(p.suggestions)
      : [...FALLBACK.suggestions],
    skillsToLearn: toStringArray(p.skillsToLearn),
    internshipReadiness:
      typeof p.internshipReadiness === "string" && p.internshipReadiness.trim()
        ? p.internshipReadiness.trim()
        : FALLBACK.internshipReadiness,
    githubFeedback:
      typeof p.githubFeedback === "string" ? p.githubFeedback.trim() : undefined,
  };
}

/**
 * Call Gemini 1.5 Flash and return a validated GeminiRawResponse.
 * Never throws due to JSON parse errors — returns safe fallback on failure.
 */
export async function analyzeWithGemini(
  prompt: string
): Promise<GeminiRawResponse> {
  const genAI = getClient();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are a professional resume and career analyst AI.
You MUST respond with ONLY valid JSON — no markdown, no explanations, no extra text.
The JSON must exactly match this schema:
{
  "resumeScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "missingKeywords": [<string>, ...],
  "suggestions": [<string>, ...],
  "skillsToLearn": [<string>, ...],
  "internshipReadiness": "<one of: High | Moderate | Low | Not Ready>",
  "githubFeedback": "<string or omit key>"
}
Do NOT include any text outside the JSON object.`,
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 2048,
    },
  });

  console.log("[gemini] Sending prompt to Gemini 1.5 Flash...");

  let rawText = "";
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
    console.log("[gemini] Raw response (first 500 chars):", rawText.slice(0, 500));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[gemini] API call failed:", msg);
    throw new Error(`Gemini API error: ${msg}`);
  }

  const parsed = extractJSON(rawText);
  if (!parsed) {
    console.error("[gemini] Failed to extract JSON from response:", rawText);
    console.warn("[gemini] Returning fallback analysis values");
    return { ...FALLBACK };
  }

  const result = normalise(parsed);
  console.log("[gemini] Validated response:", JSON.stringify(result, null, 2));
  return result;
}

/**
 * Build a structured analysis prompt for Gemini given resume text,
 * optional GitHub profile summary, and target role.
 */
export function buildAnalysisPrompt(params: {
  resumeText: string;
  targetRole: string;
  githubSummary?: string;
}): string {
  const { resumeText, targetRole, githubSummary } = params;

  // Truncate resume text to avoid exceeding token limits (~12k chars)
  const truncatedResume =
    resumeText.length > 12000
      ? resumeText.slice(0, 12000) + "\n\n[... resume truncated ...]"
      : resumeText;

  const githubSection = githubSummary
    ? `\n## GitHub Profile Summary\n${githubSummary}`
    : "\n## GitHub Profile\nNot provided.";

  return `## Task
Analyze the following resume and GitHub profile for a candidate applying for the role of "${targetRole}".
Return ONLY a JSON object matching the required schema. No other text.

## Target Role
${targetRole}
${githubSection}

## Resume Text
${truncatedResume}

## Required JSON Response
Evaluate and return:
- resumeScore (0-100): How strong is this resume overall for "${targetRole}"?
- atsScore (0-100): How well will this resume pass ATS systems for "${targetRole}"? (Check keyword density, formatting, structure)
- missingKeywords: List the top 5-10 keywords/skills missing for "${targetRole}" that should be added
- suggestions: Provide 4-6 specific, actionable suggestions to improve this resume for "${targetRole}"
- skillsToLearn: List 4-8 skills/technologies the candidate should learn to be more competitive for "${targetRole}"
- internshipReadiness: Rate readiness for internships — exactly one of: "High", "Moderate", "Low", "Not Ready"
- githubFeedback: ${githubSummary ? `Specific feedback on their GitHub portfolio for "${targetRole}" (2-3 sentences)` : "omit this key"}

Respond with ONLY the JSON object.`;
}
