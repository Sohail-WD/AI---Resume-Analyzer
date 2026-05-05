/**
 * app/api/upload/route.ts
 * POST /api/upload
 * Accepts a multipart/form-data PDF file, extracts text server-side using pdf-parse.
 */

import { NextRequest, NextResponse } from "next/server";
import { extractTextFromBuffer } from "@/lib/pdf-parser";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const runtime = "nodejs"; // required for pdf-parse

export async function POST(req: NextRequest) {
  console.log("[upload] Received PDF upload request");

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid request — expected multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: "No file provided. Send a PDF as the 'file' field." },
      { status: 400 }
    );
  }

  // Validate file type
  const fileName = file instanceof File ? file.name : "upload.pdf";
  const mimeType = file.type;

  if (
    mimeType !== "application/pdf" &&
    !fileName.toLowerCase().endsWith(".pdf")
  ) {
    return NextResponse.json(
      { error: "Only PDF files are accepted." },
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum allowed size is 10 MB." },
      { status: 400 }
    );
  }

  console.log(`[upload] Processing: ${fileName} (${(file.size / 1024).toFixed(1)} KB)`);

  // Convert Blob to Buffer for pdf-parse
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const { text, pageCount, wordCount } = await extractTextFromBuffer(buffer);

    console.log(
      `[upload] Extracted ${wordCount} words across ${pageCount} pages from "${fileName}"`
    );

    return NextResponse.json({
      text,
      wordCount,
      pageCount,
      fileName,
      fileSize: file.size,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[upload] Extraction error:", msg);
    return NextResponse.json({ error: msg }, { status: 422 });
  }
}
