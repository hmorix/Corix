import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implement password reset email sending
      console.log("Reset password for:", email);
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-transcendent px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="serif-heading text-3xl mb-2">Reset Password</h1>
            <p className="sans-secondary text-muted-foreground">
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive password reset instructions"}
            </p>
          </div>

          {!isSubmitted ? (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send a password reset link to this email address
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="mb-8 flex justify-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
              </div>

              <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <p className="text-sm text-foreground">
                  We've sent a password reset link to <strong>{email}</strong>. Check your email
                  and follow the instructions to reset your password.
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center mb-6">
                Didn't receive the email? Check your spam folder or try again with a different
                email address.
              </p>

              <Button
                variant="outline"
                className="w-full border-2 border-border hover:bg-muted"
                onClick={() => {
                  setEmail("");
                  setIsSubmitted(false);
                }}
              >
                Try Another Email
              </Button>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="inline-flex items-center text-accent hover:underline font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </a>
          </div>
        </Card>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <div className="inline-block">
            <div className="w-1 h-16 bg-gradient-to-b from-accent to-transparent mx-auto mb-4"></div>
            <p className="text-xs text-muted-foreground tracking-widest">CORIX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
