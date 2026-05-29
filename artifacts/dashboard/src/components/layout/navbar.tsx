import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <img src="/logo.png" alt="CometPulse" className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg text-foreground">CometPulse</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-card/50">
            Support
          </Link>
          <Link href="/servers">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-9 text-sm font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
