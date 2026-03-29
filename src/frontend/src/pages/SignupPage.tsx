import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

export function SignupPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { data: profile, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (!identity || !isFetched) return;
    if (profile) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, isFetched, profile, navigate]);

  const handleSignup = async () => {
    if (!identity) {
      login();
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your display name");
      return;
    }
    try {
      setSaving(true);
      await saveProfile.mutateAsync({
        name: name.trim(),
        createdAt: BigInt(Date.now()),
        email: "",
      });
      toast.success("Welcome to MetaTagger AI!");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
        data-ocid="signup.panel"
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
            Get Started Free
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {identity
              ? "Almost there — tell us your name."
              : "Create your account with Internet Identity."}
          </p>

          {identity ? (
            <>
              <div className="mb-5">
                <Label
                  htmlFor="name"
                  className="text-sm text-muted-foreground mb-2 block"
                >
                  Display Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  className="bg-secondary/40 border-border"
                  data-ocid="signup.input"
                />
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleSignup}
                disabled={saving || !name.trim()}
                data-ocid="signup.primary_button"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Complete Setup <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="signup.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  Sign up with Internet Identity{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline"
              data-ocid="signup.link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
