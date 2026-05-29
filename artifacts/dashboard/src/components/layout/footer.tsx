import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-12 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CometPulse" className="h-6 w-6 grayscale opacity-70" />
            <span className="text-muted-foreground font-medium">CometPulse</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Support Server</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} CometPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
