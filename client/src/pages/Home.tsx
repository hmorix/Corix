import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { startLogin } from "@/const";
import {
  Sparkles, Users, Camera, Zap, Search, Share2,
  ArrowRight, Star, ChevronRight, Loader2,
  User, Home as HomeIcon, PlusSquare, Bell,
} from "lucide-react";
import { useLocation } from "wouter";

const features = [
  {
    icon: Camera,
    title: "AI Photo Tools",
    desc: "Remove backgrounds, apply pose guides, and get professional templates instantly.",
    color: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Sparkles,
    title: "Beautiful Templates",
    desc: "Picsart-style templates designed for creators, developers, and professionals.",
    color: "from-pink-500/20 to-rose-500/10",
  },
  {
    icon: Users,
    title: "Get Discovered",
    desc: "Connect with companies, showcase your work, and build your professional network.",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Search,
    title: "Smart Search",
    desc: "Find creators and professionals by skills, category, and expertise.",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Share2,
    title: "Social Integration",
    desc: "Share your portfolio, connect with followers, and chat with opportunities.",
    color: "from-orange-500/20 to-amber-500/10",
  },
  {
    icon: Zap,
    title: "Hiring Showcase",
    desc: "Display your services, rates, and availability for companies looking to hire.",
    color: "from-violet-500/20 to-indigo-500/10",
  },
];

const stats = [
  { value: "50K+", label: "Creators" },
  { value: "12K+", label: "Companies" },
  { value: "98%", label: "Satisfaction" },
  { value: "4.9★", label: "Rating" },
];

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-transcendent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl float-animation flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  /* ── Unauthenticated Landing ─────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-transcendent relative overflow-hidden">

        {/* Background decorations */}
        <div className="pointer-events-none select-none" aria-hidden>
          <div className="glow-orb glow-orb-primary" style={{ top: "-120px", left: "-100px" }} />
          <div className="glow-orb glow-orb-secondary" style={{ bottom: "10%", right: "-80px" }} />
          <div className="absolute inset-0 dot-pattern opacity-40" />
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 nav-glass">
          <div className="container flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="brand-logo">Corix</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex font-medium"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <button
                className="btn-primary text-sm py-2 px-4 sm:px-5"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="container pt-16 pb-20 md:pt-24 md:pb-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="badge-accent mb-6 mx-auto w-fit">
              ✦ Portfolio Platform for Creators
            </div>

            <h1 className="serif-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.1]">
              Showcase Your{" "}
              <span className="text-gradient italic">Creative</span>
              {" "}Portfolio
            </h1>

            <p className="sans-secondary text-base sm:text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Create stunning digital portfolios with AI-powered photo tools. Connect
              with opportunities, get discovered by companies, and build your creative community.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <button
                className="btn-primary py-3.5 px-7 text-base"
                onClick={() => navigate("/signup")}
              >
                Start Creating Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                className="btn-ghost py-3.5 px-7 text-base"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold serif-heading text-gradient">{s.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="container pb-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="serif-heading text-2xl sm:text-3xl md:text-4xl mb-3">
              Everything You Need
            </h2>
            <p className="sans-secondary">Powerful tools built for modern creators</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card p-5 sm:p-6 group cursor-default">
                  <div className={`feature-icon mb-4 bg-gradient-to-br ${f.color}`}>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-base mb-2 group-hover:text-accent transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Social proof */}
        <section className="container pb-12 relative z-10">
          <div className="glass-card p-6 sm:p-10 text-center max-w-2xl mx-auto">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="serif-heading text-lg sm:text-xl italic mb-4 text-foreground/90">
              "Corix transformed how I present my work. Got hired within 2 weeks of creating my portfolio."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
                A
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Alex Chen</div>
                <div className="text-xs text-muted-foreground">UX Designer · Hired at Google</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 relative z-10 overflow-hidden">
          <div className="container text-center">
            <h2 className="serif-heading text-3xl sm:text-4xl md:text-5xl mb-5">
              Ready to <span className="text-gradient">Shine?</span>
            </h2>
            <p className="sans-secondary text-base sm:text-lg mb-8 max-w-lg mx-auto">
              Join 50,000+ creators building their digital portfolios on Corix.
            </p>
            <button
              className="btn-primary py-4 px-8 text-base"
              onClick={() => navigate("/signup")}
            >
              Create Your Portfolio Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 relative z-10">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="brand-logo text-base">Corix</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Corix. Crafted with care for creators.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  /* ── Authenticated Dashboard ─────────────────────── */
  return (
    <div className="min-h-screen gradient-transcendent relative overflow-hidden">

      <div className="pointer-events-none select-none" aria-hidden>
        <div className="glow-orb glow-orb-primary" style={{ top: "-80px", right: "-60px", opacity: 0.20 }} />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      {/* Top nav */}
      <nav className="sticky top-0 z-50 nav-glass">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="brand-logo">Corix</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-foreground">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard content */}
      <div className="container py-8 sm:py-12 relative z-10 pb-nav">
        {/* Welcome banner */}
        <div className="glass-card p-6 sm:p-8 mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 float-animation flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="serif-heading text-2xl sm:text-3xl mb-2">
            Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
          </h2>
          <p className="sans-secondary text-sm sm:text-base mb-6">
            Your creative journey continues here. Portfolio tools and social features are coming soon!
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <button
              className="btn-primary py-2.5 px-3 text-sm col-span-3 sm:col-span-1"
              onClick={() => navigate("/portfolio/create")}
            >
              <PlusSquare className="w-4 h-4" />
              Create Portfolio
            </button>
            <button
              className="btn-ghost py-2.5 px-3 text-sm"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button
              className="btn-ghost py-2.5 px-3 text-sm"
              onClick={() => navigate("/search")}
            >
              Explore
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Portfolios", value: "0", icon: "🖼️" },
            { label: "Profile Views", value: "0", icon: "👁️" },
            { label: "Connections", value: "0", icon: "🤝" },
            { label: "Opportunities", value: "0", icon: "⚡" },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold serif-heading text-gradient">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature preview cards */}
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Coming Soon
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: Camera, title: "AI Photo Studio", desc: "Remove backgrounds, pose guides & pro templates" },
            { icon: Users, title: "Creator Network", desc: "Connect with 50K+ creators worldwide" },
            { icon: Search, title: "Job Board", desc: "Get discovered by top companies" },
            { icon: Share2, title: "Stories", desc: "Share your process & behind-the-scenes" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-card p-4 flex items-center gap-4">
                <div className="feature-icon shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav md:hidden">
        {[
          { icon: HomeIcon, label: "Home", path: "/home", active: true },
          { icon: Search, label: "Search", path: "/search", active: false },
          { icon: PlusSquare, label: "Create", path: "/portfolio/create", active: false },
          { icon: Bell, label: "Activity", path: "/stories", active: false },
          { icon: User, label: "Profile", path: "/profile", active: false },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`mobile-nav-item ${item.active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
