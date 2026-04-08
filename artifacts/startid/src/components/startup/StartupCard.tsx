import { Link } from "wouter";
import { Startup } from "@/data/mock-startups";
import { Badge } from "@/components/ui/badge";
import { Triangle, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { useUpvoteStartup } from "@/hooks/use-startups";
import { cn } from "@/lib/utils";

export function StartupCard({ startup }: { startup: Startup }) {
  const [localUpvoted, setLocalUpvoted] = useState(false);
  const upvoteMutation = useUpvoteStartup();

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!localUpvoted) {
      setLocalUpvoted(true);
      upvoteMutation.mutate(startup.id);
    }
  };

  return (
    <Link href={`/startups/${startup.slug}`}>
      <div className="group flex flex-row items-center p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer w-full gap-4 sm:gap-6">
        
        {/* Upvote Column */}
        <button 
          onClick={handleUpvote}
          className={cn(
            "flex flex-col items-center justify-center p-2 min-w-[56px] rounded-lg border transition-colors shrink-0",
            localUpvoted 
              ? "bg-primary/5 border-primary text-primary" 
              : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Triangle className={cn("w-4 h-4 mb-1 fill-current", localUpvoted && "text-primary")} />
          <span className="font-semibold text-xs">
            {startup.upvotes + (localUpvoted ? 1 : 0)}
          </span>
        </button>

        {/* Logo */}
        <div className={cn("hidden sm:flex w-14 h-14 rounded-xl shrink-0 items-center justify-center text-white font-display font-bold text-xl shadow-inner", startup.color)}>
          {startup.initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
              {startup.name}
            </h3>
            {startup.verified && (
              <BadgeCheck className="w-4 h-4 shrink-0 text-blue-500" aria-label="Verified" />
            )}
            <span className="text-muted-foreground text-sm font-medium hidden sm:inline-block">·</span>
            <p className="text-muted-foreground text-sm truncate hidden sm:block">
              {startup.pitch}
            </p>
          </div>
          
          <p className="text-muted-foreground text-sm truncate sm:hidden mb-2">
            {startup.pitch}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="font-medium bg-secondary/50 hover:bg-secondary">
              {startup.industry}
            </Badge>
            <Badge variant="outline" className="font-medium border-border/60">
              {startup.stage}
            </Badge>
            <span className="text-xs font-semibold text-foreground bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
              {startup.targetRaise}
            </span>
          </div>
        </div>

        {/* Action arrow */}
        <div className="shrink-0 hidden md:flex text-muted-foreground group-hover:text-primary transition-colors pr-2">
          <div className="bg-background border shadow-sm rounded-full p-2 group-hover:translate-x-1 group-active:translate-x-0 transition-transform">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
