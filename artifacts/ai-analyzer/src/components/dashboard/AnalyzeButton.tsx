import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export function AnalyzeButton({ onClick, isLoading, disabled }: AnalyzeButtonProps) {
  return (
    <div className="glow-border rounded-xl">
      <Button 
        size="lg" 
        onClick={onClick} 
        disabled={disabled || isLoading}
        className="w-full relative group bg-gradient-to-r from-primary via-accent to-primary animated-gradient-btn text-primary-foreground font-bold text-lg h-14 rounded-xl border-none"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Running Deep Analysis...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Analyze Profile
          </>
        )}
      </Button>
    </div>
  );
}
