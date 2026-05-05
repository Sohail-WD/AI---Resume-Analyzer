"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle, CheckCircle2, Server } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import NeonBadge from "@/components/common/NeonBadge";
import { formatFileSize } from "@/utils/formatters";
import { ResumeData } from "@/types";
import { uploadResumePDF, uploadResultToResumeData } from "@/services/ai-analysis";

interface ResumeUploadCardProps {
  onResumeLoaded: (data: ResumeData) => void;
  resumeData: ResumeData | null;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function ResumeUploadCard({
  onResumeLoaded,
  resumeData,
}: ResumeUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Client-side pre-validation
      if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
        setError("Please upload a PDF file only.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File must be smaller than 10 MB.");
        return;
      }

      setError(null);
      setUploadStatus("uploading");

      try {
        // Server-side PDF parsing via /api/upload
        const uploadResult = await uploadResumePDF(file);

        if (!uploadResult.text || uploadResult.wordCount < 20) {
          throw new Error(
            "Very little text was extracted. Please use a text-based (non-scanned) PDF."
          );
        }

        const resumeData = uploadResultToResumeData(uploadResult);
        onResumeLoaded(resumeData);
        setUploadStatus("success");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Upload failed. Please try again.";
        setError(msg);
        setUploadStatus("error");
      }
    },
    [onResumeLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input value so the same file can be re-uploaded
    e.target.value = "";
  };

  const handleClear = () => {
    onResumeLoaded({ rawText: "", fileName: "", fileSize: 0 });
    setUploadStatus("idle");
    setError(null);
  };

  const isProcessing = uploadStatus === "uploading";

  return (
    <GlassCard animate className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20">
            <FileText className="h-4 w-4 text-[#00D4FF]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">Resume Upload</h3>
            <p className="text-xs text-white/40">PDF format only · max 10 MB</p>
          </div>
        </div>
        {resumeData?.rawText && (
          <NeonBadge label="Loaded" variant="green" dot />
        )}
      </div>

      {/* Drop zone */}
      <motion.label
        htmlFor="resume-file-input"
        animate={{
          borderColor: isDragging
            ? "rgba(0, 212, 255, 0.6)"
            : resumeData?.rawText
            ? "rgba(16, 185, 129, 0.4)"
            : "rgba(255,255,255,0.08)",
          backgroundColor: isDragging
            ? "rgba(0, 212, 255, 0.06)"
            : "transparent",
        }}
        transition={{ duration: 0.2 }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="relative flex flex-col items-center justify-center gap-3 h-44 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-9 w-9 rounded-full border-2 border-[#00D4FF] border-t-transparent animate-spin" />
              <div className="flex items-center gap-1.5 text-sm text-[#00D4FF]">
                <Server className="h-3.5 w-3.5" />
                Parsing PDF on server…
              </div>
              <p className="text-xs text-white/30">Extracting text with AI-ready precision</p>
            </motion.div>
          ) : resumeData?.rawText ? (
            <motion.div
              key="loaded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 px-4 w-full"
            >
              <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
              <p className="text-sm font-medium text-white/80 text-center truncate max-w-full">
                {resumeData.fileName}
              </p>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>{formatFileSize(resumeData.fileSize)}</span>
                <span>·</span>
                <span>{resumeData.wordCount?.toLocaleString() ?? resumeData.rawText.split(" ").length.toLocaleString()} words</span>
                {resumeData.pageCount && (
                  <>
                    <span>·</span>
                    <span>{resumeData.pageCount} {resumeData.pageCount === 1 ? "page" : "pages"}</span>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <Upload
                className={`h-8 w-8 ${isDragging ? "text-[#00D4FF]" : "text-white/25"}`}
              />
              <div className="text-center">
                <p className="text-sm font-medium text-white/60">
                  Drop your resume here
                </p>
                <p className="text-xs text-white/30">or click to browse</p>
              </div>
              <NeonBadge label="Server-side parsing · PDF up to 10MB" variant="muted" />
            </motion.div>
          )}
        </AnimatePresence>

        <input
          id="resume-file-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleInputChange}
        />
      </motion.label>

      {/* Clear button */}
      {resumeData?.rawText && (
        <button
          id="resume-clear-btn"
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-white/35 hover:text-[#EF4444] transition-colors self-start"
        >
          <X className="h-3.5 w-3.5" /> Remove file
        </button>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
