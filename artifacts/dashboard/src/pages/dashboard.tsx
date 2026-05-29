import { useParams, Link } from "wouter";
import { useGetBotServers, useGetBotStats } from "@workspace/api-client-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Zap, 
  MessageSquare, 
  Gift, 
  Terminal, 
  Shield, 
  FileText, 
  Settings, 
  Activity,
  ArrowLeft,
  Users
} from "lucide-react";
import { formatUptime } from "@/lib/format";

export default function Dashboard() {
  const params = useParams();
  const serverId = params.id;
  
  const { data: servers } = useGetBotServers();
  const { data: stats } = useGetBotStats();
  
  const server = servers?.find(s => s.id === serverId);

  const navItems = [
    { title: "Overview", icon: Home, isActive: true },
    { title: "Leveling", icon: Zap, isActive: false },
    { title: "Welcoming", icon: MessageSquare, isActive: false },
    { title: "Giveaways", icon: Gift, isActive: false },
    { title: "Utility", icon: Terminal, isActive: false },
    { title: "Moderation", icon: Shield, isActive: false },
    { title: "Logging", icon: FileText, isActive: false },
    { title: "Settings", icon: Settings, isActive: false },
  ];

  if (!server && servers) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Server not found</h1>
        <Link href="/servers">
          <Button variant="outline">Return to Servers</Button>
        </Link>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/40 bg-sidebar/50 backdrop-blur-xl">
        <SidebarHeader className="border-b border-border/40 p-4">
          <Link href="/servers" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Servers
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden flex-shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.15)]">
              {server?.icon ? (
                <img src={server.icon} alt={server?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-muted-foreground">{server?.name?.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-foreground truncate">{server?.name || "Loading..."}</h2>
              <div className="text-xs text-muted-foreground truncate">{server?.id}</div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={item.isActive}
                    className={`gap-3 ${item.isActive ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                  >
                    <item.icon className={`w-4 h-4 ${item.isActive ? 'text-primary' : ''}`} />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="h-16 border-b border-border/40 flex items-center px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <SidebarTrigger className="mr-4" />
          <h1 className="font-bold text-lg">Overview</h1>
        </header>

        <main className="p-6 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-primary group-hover:scale-110 transition-transform">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Members</h3>
              <div className="text-3xl font-bold font-mono text-foreground">{server?.memberCount.toLocaleString() || "0"}</div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-primary group-hover:scale-110 transition-transform">
                <Terminal className="w-12 h-12" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Commands Used</h3>
              <div className="text-3xl font-bold font-mono text-foreground">{server?.commandsUsed.toLocaleString() || "0"}</div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-primary group-hover:scale-110 transition-transform">
                <Activity className="w-12 h-12" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Bot Uptime</h3>
              <div className="text-2xl font-bold font-mono text-foreground mt-1">
                {stats ? formatUptime(stats.uptimeSeconds) : "..."}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Active Modules</h3>
                  <p className="text-sm text-muted-foreground">Manage core bot features</p>
                </div>
              </div>
              <div className="divide-y divide-border/30">
                {[
                  { name: "Leveling System", status: "Enabled", desc: "XP and role rewards", icon: Zap },
                  { name: "Welcome Messages", status: "Enabled", desc: "Join/leave announcements", icon: MessageSquare },
                  { name: "Auto-Moderation", status: "Disabled", desc: "Spam and link filtering", icon: Shield }
                ].map((mod) => (
                  <div key={mod.name} className="p-4 px-6 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.status === 'Enabled' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        <mod.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{mod.name}</div>
                        <div className="text-xs text-muted-foreground">{mod.desc}</div>
                      </div>
                    </div>
                    <Button variant={mod.status === 'Enabled' ? 'default' : 'outline'} size="sm" className={mod.status === 'Enabled' ? 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30' : ''}>
                      {mod.status === 'Enabled' ? 'Configure' : 'Enable'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden flex flex-col justify-center items-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Customize CometPulse</h3>
              <p className="text-muted-foreground max-w-sm mb-6">Select a module from the sidebar to configure settings for {server?.name}</p>
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                View Documentation
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
