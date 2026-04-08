import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-24">
      <div className="container mx-auto px-4 py-14 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
              <span className="font-bold text-lg tracking-tight">Project Zenith</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The institutional platform for startup capital discovery. Replace your pitch deck with a structured profile.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Platform</p>
            <div className="space-y-2.5">
              {[
                ["Discover", "/discover"],
                ["For Startups", "/for-startups"],
                ["For Investors", "/for-investors"],
                ["For Providers", "/for-providers"],
              ].map(([l, h]) => (
                <Link key={l} href={h} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Community</p>
            <div className="space-y-2.5">
              {[
                ["Community", "/community"],
                ["Pitch Events", "/pitch-events"],
                ["Blog", "/blog"],
                ["Newsletter", "/newsletter"],
              ].map(([l, h]) => (
                <Link key={l} href={h} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Company</p>
            <div className="space-y-2.5">
              {[
                ["About", "/about"],
                ["Pricing", "/pricing"],
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
              ].map(([l, h]) => (
                <Link key={l} href={h} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Project Zenith Limited. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for founders, funded by traction.</p>
        </div>
      </div>
    </footer>
  );
}
