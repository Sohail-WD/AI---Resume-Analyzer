import { useState } from "react";
import { Github, CheckCircle2, AlertCircle } from "lucide-react";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function GithubInputCard({ url, setUrl }: { url: string; setUrl: (u: string) => void }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleValidate = () => {
    if (!url) {
      setIsValid(null);
      return;
    }
    const regex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/;
    setIsValid(regex.test(url));
  };

  return (
    <SpotlightCard className="glass-card hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Profile
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Connect your code portfolio</p>
      </div>
      <div className="p-6 pt-4 flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              type="url" 
              placeholder="https://github.com/username" 
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setIsValid(null);
              }}
              className="pl-9 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/30 h-10 rounded-lg"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="h-6 flex items-center">
              {isValid === true && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Validated
                </Badge>
              )}
              {isValid === false && (
                <div className="flex items-center gap-1.5 text-xs text-rose-500">
                  <AlertCircle className="h-3.5 w-3.5" /> Invalid GitHub URL
                </div>
              )}
            </div>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleValidate}
              className="bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent text-white border-none animated-gradient-btn"
              disabled={!url}
            >
              Validate
            </Button>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
