import { UploadCloud, FileType, X } from "lucide-react";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Button } from "@/components/ui/button";

export function ResumeUploadCard({ file, setFile }: { file: File | null; setFile: (f: File | null) => void }) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <SpotlightCard className="glass-card hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-semibold tracking-tight">Resume / CV</h3>
        <p className="text-sm text-muted-foreground mt-1">Upload your latest resume as PDF</p>
      </div>
      <div className="p-6 pt-4 flex-1 flex flex-col">
        <div 
          className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/50 hover:bg-white/[0.02] cursor-pointer group flex-1 min-h-[160px]"
          onClick={() => {
            if (!file) {
              setFile(new File([""], "alex_smith_resume_2025.pdf", { type: "application/pdf" }));
            }
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="w-full bg-white/5 rounded-lg p-4 flex items-center justify-between border border-white/10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileType className="h-5 w-5" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium text-white truncate max-w-[180px] sm:max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-white/5 text-muted-foreground flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-primary transition-all">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-white mb-1">Click or drag file to this area</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX up to 5MB</p>
            </>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
