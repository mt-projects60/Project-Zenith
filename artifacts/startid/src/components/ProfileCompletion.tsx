import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CompletionItem {
  label: string;
  done: boolean;
}

interface ProfileCompletionProps {
  items: CompletionItem[];
  profileUrl?: string;
  role?: "startup" | "investor" | "provider" | "community";
}

export function ProfileCompletion({ items, profileUrl, role = "startup" }: ProfileCompletionProps) {
  const [copied, setCopied] = useState(false);
  const done = items.filter(i => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  const incomplete = items.filter(i => !i.done);

  const handleCopy = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusColor =
    pct === 100 ? "text-emerald-700 bg-emerald-50" :
    pct >= 70  ? "text-amber-700 bg-amber-50" :
                 "text-red-600 bg-red-50";

  const barColor =
    pct === 100 ? "[&>[data-slot=indicator]]:bg-emerald-500" :
    pct >= 70   ? "[&>[data-slot=indicator]]:bg-amber-500" :
                  "[&>[data-slot=indicator]]:bg-red-400";

  return (
    <div className="bg-card border rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Profile Completion</p>
          <p className="text-3xl font-bold mt-0.5">{pct}%</p>
        </div>
        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", statusColor)}>
          {pct === 100 ? "Complete" : pct >= 70 ? "Almost done" : "Incomplete"}
        </span>
      </div>

      <Progress value={pct} className={cn("h-2", barColor)} />

      {/* Checklist */}
      {incomplete.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Still needed:</p>
          {incomplete.slice(0, 5).map(item => (
            <div key={item.label} className="flex items-center gap-2.5 text-sm">
              <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
          {incomplete.length > 5 && (
            <p className="text-xs text-muted-foreground pl-6">+{incomplete.length - 5} more sections</p>
          )}
        </div>
      )}

      {pct === 100 && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
          <CheckCircle className="w-4 h-4" />
          All sections complete — your profile is fully set up.
        </div>
      )}

      {/* Shareable URL */}
      {profileUrl && (
        <div className="pt-1 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">Your shareable profile link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground truncate">
              {profileUrl}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 p-2 rounded-lg border hover:bg-muted transition-colors"
              title="Copy link"
            >
              {copied
                ? <Check className="w-4 h-4 text-primary" />
                : <Copy className="w-4 h-4 text-muted-foreground" />
              }
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Share on LinkedIn, WhatsApp, or Slack — link previews show your name and bio automatically.
          </p>
        </div>
      )}
    </div>
  );
}
