import { useGetBotServers } from "@workspace/api-client-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Server, Users, Terminal, Plus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Servers() {
  const { data: servers, isLoading } = useGetBotServers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServers = servers?.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Select a Server</h1>
            <p className="text-muted-foreground">Manage CometPulse settings for your communities.</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search servers..." 
                className="pl-10 bg-card border-border/50 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0 border-primary/30 hover:bg-primary/10 text-primary transition-all">
              <Plus className="w-4 h-4 mr-2" /> Add Bot
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-card/50 border border-border/30 animate-pulse" />
            ))}
          </div>
        ) : filteredServers?.length === 0 ? (
          <div className="text-center py-24 bg-card/20 rounded-2xl border border-border/30">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Server className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No servers found</h3>
            <p className="text-muted-foreground mb-6">You don't have CometPulse in any servers matching "{searchQuery}"</p>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              Add to a new Server
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServers?.map((server) => (
              <Link key={server.id} href={`/dashboard/${server.id}`}>
                <div className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-primary/50 transition-colors">
                      {server.icon ? (
                        <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-muted-foreground">{server.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-foreground truncate">{server.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">ID: {server.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm relative z-10">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-primary/70" />
                      <span className="font-medium">{server.memberCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Terminal className="w-4 h-4 text-primary/70" />
                      <span className="font-medium">{server.commandsUsed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
