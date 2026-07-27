import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Mail, Lock, User, Loader2, Sparkles, ArrowLeft, Check } from "lucide-react";

const perks = [
  "AI-powered photo tools",
  "Professional portfolio templates",
  "Get discovered by companies",
  "Free forever plan available",
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/home");
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setIsLoading(true);
    try {
      console.log("Signup:", { name, email, password });
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-transcendent px-4 py-12 relative overflow-hidden">

      <div className="pointer-events-none" aria-hidden>
        <div className="glow-orb glow-orb-primary" style={{ top: "-120px", right: "-100px", opacity: 0.28 }} />
        <div className="glow-orb glow-orb-secondary" style={{ bottom: "-80px", left: "-80px" }} />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      <div className="w-full max-w-md relative z-10 page-enter">

        <button
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="glass-card p-7 sm:p-9">

          {/* Brand */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 float-animation"
              style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.54 0.26 305))" }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="serif-heading text-2xl sm:text-3xl mb-1.5">Join Corix</h1>
            <p className="sans-secondary text-sm text-center">
              Create your creative portfolio and get discovered
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-1.5 mb-6">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-border bg-card hover:border-accent/50 hover:bg-muted transition-all font-medium text-sm mb-5"
            onClick={() => startLogin()}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5 mb-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input id="name" type="text" placeholder="Jane Doe"
                  value={name} onChange={e => setName(e.target.value)} required
                  className="pl-10 h-11 rounded-xl border-border bg-input" disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input id="email" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  className="pl-10 h-11 rounded-xl border-border bg-input" disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input id="password" type="password" placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  className="pl-10 h-11 rounded-xl border-border bg-input" disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input id="confirm-password" type="password" placeholder="••••••••"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                  className="pl-10 h-11 rounded-xl border-border bg-input" disabled={isLoading} />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-1" disabled={isLoading}>
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                : "Create Free Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mb-4">
            By signing up, you agree to our{" "}
            <a href="#" className="text-accent hover:opacity-80">Terms</a>{" "}
            and{" "}
            <a href="#" className="text-accent hover:opacity-80">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-accent font-semibold hover:opacity-80 transition-opacity">
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="section-divider mx-auto mb-3" />
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">Corix</p>
        </div>
      </div>
    </div>
  );
}
