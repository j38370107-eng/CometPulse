import { useGetBotStats, useGetBotFeatures } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatUptime } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import {
  Server,
  Users,
  Terminal,
  Activity,
  Zap,
  Shield,
  Gift,
  MessageSquare,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

const featureTags = [
  { icon: Zap, label: "Leveling" },
  { icon: Gift, label: "Giveaways" },
  { icon: Terminal, label: "Utility" },
];

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetBotStats();
  const { data: features, isLoading: featuresLoading } = useGetBotFeatures();
  const { data: inviteData } = useQuery<{ url: string }>({
    queryKey: ["bot-invite"],
    queryFn: () => fetch("/api/bot/invite").then((r) => r.json()),
    staleTime: Infinity,
  });
  const inviteUrl = inviteData?.url ?? "#";

  const iconMap: Record<string, React.ElementType> = {
    Leveling: Zap,
    Welcoming: MessageSquare,
    Giveaways: Gift,
    Utility: Terminal,
    Moderation: Shield,
  };

  const statItems = [
    {
      icon: Server,
      value: statsLoading ? "..." : (stats?.servers?.toLocaleString() ?? "0"),
      label: "Servers",
    },
    {
      icon: Users,
      value: statsLoading ? "..." : (stats?.users?.toLocaleString() ?? "0"),
      label: "Users",
    },
    {
      icon: Terminal,
      value: statsLoading ? "..." : (stats?.commands?.toLocaleString() ?? "0"),
      label: "Commands",
    },
    {
      icon: Clock,
      value: statsLoading ? "..." : formatUptime(stats?.uptimeSeconds || 0),
      label: "Uptime",
    },
    {
      icon: Activity,
      value: stats?.status === "online" ? "Online" : "Online",
      label: "Status",
      isStatus: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Grid background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 flex flex-col">
          {/* ── Hero ── */}
          <section className="flex flex-col items-center text-center px-5 pt-16 pb-10 max-w-lg mx-auto w-full">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/40 bg-card/50 text-sm text-muted-foreground mb-8 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse" />
              <span>
                Bot online
                {!statsLoading && stats?.servers
                  ? ` · ${stats.servers} servers`
                  : ""}
              </span>
            </div>

            {/* Big title */}
            <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-4 leading-none text-foreground">
              CometPulse
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground mb-8">
              Advanced Discord Utility Bot
            </p>

            {/* Feature tag pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {featureTags.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white text-base font-semibold shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all border border-primary/50"
              >
                <Zap className="w-4 h-4" />
                Add to Server
                <ChevronRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-center w-full h-12 rounded-2xl border border-border/50 bg-card/40 hover:bg-card/70 text-foreground text-base font-medium transition-all backdrop-blur"
              >
                Learn More
              </button>
            </div>
          </section>

          {/* ── Stats ── */}
          <section className="py-10 px-5 max-w-lg mx-auto w-full">
            <div className="flex flex-col divide-y divide-border/30 rounded-2xl border border-border/30 bg-card/20 backdrop-blur overflow-hidden">
              {statItems.map(({ icon: Icon, value, label, isStatus }) => (
                <div
                  key={label}
                  className="flex flex-col items-center py-7 gap-2"
                >
                  <Icon
                    className={`w-6 h-6 ${isStatus ? "text-primary" : "text-primary"}`}
                  />
                  <div
                    className={`text-3xl font-bold font-mono ${isStatus ? "text-green-400" : "text-foreground"}`}
                  >
                    {value}
                  </div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Features ── */}
          <section id="features" className="py-10 px-5 max-w-lg mx-auto w-full pb-20">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold tracking-tight mb-3">
                Everything You Need
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Powerful tools for your community, configured through an easy
                dashboard
              </p>
            </div>

            {featuresLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded-2xl bg-card/50 border border-border/30 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {features?.slice(0, -2).map((feature) => {
                  const Icon = iconMap[feature.title] || Zap;
                  return (
                    <div
                      key={feature.id}
                      className="p-6 rounded-2xl bg-card/40 border border-border/40 hover:border-primary/40 transition-all"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
