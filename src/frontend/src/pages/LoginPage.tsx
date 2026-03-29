import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (identity) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen grid-pattern flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
        data-ocid="login.panel"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold text-foreground text-lg">
                MetaTagger <span className="text-primary">AI</span>
              </span>
            </Link>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
            Sign in to MetaTagger AI
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Use Internet Identity to securely access your account.
          </p>

          <Button
            className="w-full gap-2"
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign in with Internet Identity
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline"
              data-ocid="login.link"
            >
              Get started free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
