/**
 * lib/pdf-parser.ts
 * Server-side PDF text extraction using pdf-parse.
 * Used exclusively in API routes (Node.js runtime).
 */

import type { Buffer } from "buffer";

export interface PDFParseResult {
  text: string;
  pageCount: number;
  wordCount: number;
}

export async function extractTextFromBuffer(
  buffer: Buffer
): Promise<PDFParseResult> {
  // Dynamic import to avoid issues with Next.js module bundling
  // pdf-parse must run in Node.js runtime only
  const pdf = await import("pdf-parse");
  // Some versions/bundlers wrap the export in .default
  const pdfParse = typeof pdf === "function" ? pdf : pdf.default;

  if (typeof pdfParse !== "function") {
    console.error("[pdf-parser] pdfParse is not a function. Type:", typeof pdfParse);
    throw new Error("Internal PDF parser configuration error.");
  }

  let data;
  try {
    data = await pdfParse(buffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`PDF parsing failed: ${msg}`);
  }

  const text = (data.text ?? "").trim();
  const pageCount = data.numpages ?? 1;

  if (!text || text.length < 50) {
    throw new Error(
      "Could not extract readable text from this PDF. " +
        "Please ensure it is a text-based (not scanned) PDF."
    );
  }

  // Count words (split on whitespace runs)
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return { text, pageCount, wordCount };
}
