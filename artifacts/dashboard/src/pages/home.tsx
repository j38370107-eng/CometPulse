import { useGetBotStats, useGetBotFeatures } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { formatUptime } from "@/lib/format";
import { Server, Users, Terminal, Activity, Zap, Shield, Gift, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetBotStats();
  const { data: features, isLoading: featuresLoading } = useGetBotFeatures();

  const iconMap: Record<string, any> = {
    'Leveling': Zap,
    'Welcoming': MessageSquare,
    'Giveaways': Gift,
    'Utility': Terminal,
    'Moderation': Shield,
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Hex Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTMwIDBMNjAgMTVMMzAgMzBMMCAxNXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMjQsNTgsMjM3LDAuMDUpIi8+PHBhdGggZD0iTTMwIDYwTDYwIDQ1TDMwIDMwTDAgNDV6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTI0LDU4LDIzNywwLjA1KSIvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <Navbar />

      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 text-center relative max-w-5xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative">
            <div className="inline-flex items-center justify-center p-2 mb-8 rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-8 duration-700">
              <img src="/logo.png" alt="CometPulse Logo" className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">CometPulse</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-700 delay-200">
              Advanced Discord Utility Bot. Mission control for your server. Powerful, intelligent, and designed for scale.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] border border-primary/50 transition-all">
                Add to Server
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border/50 bg-background/50 backdrop-blur-md hover:bg-card transition-all">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border/30 bg-card/30 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-x divide-border/30">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Server className="w-4 h-4" /> Servers
                </div>
                <div className="text-3xl font-bold font-mono">
                  {statsLoading ? "..." : (stats?.servers?.toLocaleString() ?? "0")}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" /> Users
                </div>
                <div className="text-3xl font-bold font-mono">
                  {statsLoading ? "..." : (stats?.users?.toLocaleString() ?? "0")}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Terminal className="w-4 h-4" /> Commands
                </div>
                <div className="text-3xl font-bold font-mono">
                  {statsLoading ? "..." : (stats?.commands?.toLocaleString() ?? "0")}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Activity className="w-4 h-4" /> Uptime
                </div>
                <div className="text-2xl font-bold font-mono">
                  {statsLoading ? "..." : formatUptime(stats?.uptimeSeconds || 0)}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center col-span-2 md:col-span-1">
                <div className="text-muted-foreground mb-2">Status</div>
                <div className="flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${stats?.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-yellow-500'}`} />
                  <span className="font-medium capitalize">{stats?.status || 'Online'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Equip your community with tools built for engagement, safety, and seamless operations.</p>
          </div>

          {featuresLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-48 rounded-xl bg-card/50 border border-border/30 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features?.map((feature) => {
                const Icon = iconMap[feature.title] || Zap;
                return (
                  <div key={feature.id} className="group relative p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-xs font-medium text-primary mb-2 tracking-wider uppercase">{feature.category}</div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        
        {/* Banner CTA */}
        <section className="py-20 px-4 container mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
            <div className="absolute inset-0">
              <img src="/banner.jpeg" alt="CometPulse Banner" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            <div className="relative z-10 py-20 px-6 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Ready for liftoff?</h2>
              <p className="text-xl text-muted-foreground mb-10">Join thousands of servers powered by CometPulse today.</p>
              <Link href="/servers" className="inline-flex items-center justify-center whitespace-nowrap text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] border border-primary/50">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
