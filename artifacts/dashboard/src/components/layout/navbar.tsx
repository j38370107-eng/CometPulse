import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src="/logo.png" alt="CometPulse" className="h-8 w-8 object-contain" />
          <span className="font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            CometPulse
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/servers" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Button variant="default" className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] border border-primary/50 transition-all rounded-full px-6">
            Add to Discord
          </Button>
        </div>
      </div>
    </nav>
  );
}
