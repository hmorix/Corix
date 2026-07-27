import { Home, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center gradient-transcendent px-4 relative overflow-hidden">

      <div className="pointer-events-none" aria-hidden>
        <div className="glow-orb glow-orb-primary" style={{ top: "-100px", left: "-80px", opacity: 0.25 }} />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      <div className="glass-card p-10 sm:p-14 text-center max-w-md w-full relative z-10 page-enter">

        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-3xl"
          style={{ background: "linear-gradient(135deg, oklch(0.58 0.24 290 / 0.15), oklch(0.54 0.26 305 / 0.10))", border: "1px solid oklch(0.58 0.24 290 / 0.25)" }}>
          <span className="text-4xl font-bold serif-heading text-gradient">404</span>
        </div>

        <h1 className="serif-heading text-2xl sm:text-3xl mb-3">Page Not Found</h1>
        <p className="sans-secondary text-sm mb-8 max-w-xs mx-auto">
          Sorry, the page you're looking for doesn't exist. It may have been moved or deleted.
        </p>

        <div id="not-found-button-group" className="flex flex-col gap-3">
          <button
            className="btn-primary py-3 w-full"
            onClick={() => setLocation("/")}
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
