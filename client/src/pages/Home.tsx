import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { startLogin } from "@/const";
import { Loader2, Sparkles, Users, Camera, Zap, Search, Share2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-transcendent">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="serif-heading text-xl">Corix</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="serif-heading text-5xl md:text-6xl mb-6 leading-tight">
              Showcase Your Creative <span className="text-accent">Portfolio</span>
            </h1>
            <p className="sans-secondary text-xl text-muted-foreground mb-8 leading-relaxed">
              Create stunning digital portfolios with AI-powered photo tools. Connect with opportunities,
              get discovered by companies, and build your creative community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate("/signup")}
              >
                Start Creating
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border hover:bg-muted"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-accent" />
              </div>
              <h3 className="serif-heading text-lg mb-2">AI Photo Tools</h3>
              <p className="sans-secondary text-muted-foreground">
                Remove backgrounds, capture with pose guides, and apply professional templates instantly.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="serif-heading text-lg mb-2">Beautiful Templates</h3>
              <p className="sans-secondary text-muted-foreground">
                Choose from Picsart-style templates designed for creators, developers, and professionals.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="serif-heading text-lg mb-2">Get Discovered</h3>
              <p className="sans-secondary text-muted-foreground">
                Connect with companies, showcase your work, and build your professional network.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-accent" />
              </div>
              <h3 className="serif-heading text-lg mb-2">Smart Search</h3>
              <p className="sans-secondary text-muted-foreground">
                Find creators and professionals by skills, category, and expertise.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="serif-heading text-lg mb-2">Social Integration</h3>
              <p className="sans-secondary text-muted-foreground">
                Share your portfolio, connect with followers, and chat with opportunities.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="serif-heading text-lg mb-2">Hiring Showcase</h3>
              <p className="sans-secondary text-muted-foreground">
                Display your services, rates, and availability for companies looking to hire.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="gradient-lavender py-16 md:py-20">
          <div className="container text-center">
            <h2 className="serif-heading text-4xl md:text-5xl mb-6">
              Ready to Showcase Your Talent?
            </h2>
            <p className="sans-secondary text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators building their digital portfolios on Corix.
            </p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => navigate("/signup")}
            >
              Create Your Portfolio Now
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="container text-center">
            <p className="text-muted-foreground text-sm">
              © 2026 Corix. All rights reserved. | Crafted with care for creators.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated Home (Dashboard)
  return (
    <div className="min-h-screen gradient-transcendent">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="serif-heading text-xl">Corix</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="serif-heading text-3xl mb-4">Welcome to Your Dashboard</h2>
            <p className="sans-secondary text-muted-foreground mb-8">
              Your portfolio creation tools and social features are coming soon!
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="border-2 border-border">
                Create Portfolio
              </Button>
              <Button variant="outline" className="border-2 border-border">
                View Profile
              </Button>
              <Button variant="outline" className="border-2 border-border">
                Explore Community
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
