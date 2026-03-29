import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Brain,
  Loader2,
  LogOut,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetMyFeedback,
  useSaveCallerUserProfile,
  useSubmitAnalysis,
} from "../hooks/useQueries";
import { getModelAccuracy } from "../utils/trainableAnalyzer";
import { trainedAnalyzeContent } from "../utils/trainableAnalyzer";

export function DashboardPage() {
  const { clear } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const submitAnalysis = useSubmitAnalysis();
  const { data: myFeedback = [] } = useGetMyFeedback();

  const showProfileSetup = !profileLoading && isFetched && profile === null;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const accuracy = getModelAccuracy(myFeedback);
  const trainingSamples = myFeedback.length;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    try {
      setSavingName(true);
      await saveProfile.mutateAsync({
        name: displayName.trim(),
        createdAt: BigInt(Date.now()),
        email: "",
      });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save name.");
    } finally {
      setSavingName(false);
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast.error("Please paste some content first.");
      return;
    }
    if (content.trim().split(/\s+/).length < 10) {
      toast.error(
        "Content is too short. Please paste at least a few sentences.",
      );
      return;
    }
    try {
      setIsAnalyzing(true);
      const timestamp = BigInt(Date.now());
      const result = trainedAnalyzeContent(content, myFeedback);
      await submitAnalysis.mutateAsync({
        content,
        seoTags: result.seoTags,
        category: result.category,
        keywords: result.keywords,
        readTimeMinutes: result.readTimeMinutes,
        summary: result.summary,
        suggestedTitle: result.suggestedTitle,
        confidenceScore: result.confidenceScore,
        timestamp,
      });
      navigate({
        to: "/results",
        state: { result, content, timestamp: timestamp.toString() },
      } as never);
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen grid-pattern">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            data-ocid="dashboard.link"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground">
              MetaTagger <span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="hidden sm:block">{profile.name}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-ocid="dashboard.button"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {showProfileSetup && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-card border border-primary/30 rounded-2xl p-6 flex items-start gap-4"
            data-ocid="dashboard.panel"
          >
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Set up your profile
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter a display name to personalize your MetaTagger AI
                experience.
              </p>
              <div className="flex gap-3 max-w-sm">
                <div className="flex-1">
                  <Label htmlFor="profile-name" className="sr-only">
                    Display Name
                  </Label>
                  <Input
                    id="profile-name"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    className="bg-secondary/40 border-border"
                    data-ocid="dashboard.input"
                  />
                </div>
                <Button
                  onClick={handleSaveName}
                  disabled={savingName}
                  size="sm"
                  data-ocid="dashboard.save_button"
                >
                  {savingName ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Analyze Your Content
            </h1>
            <p className="text-muted-foreground">
              Paste your blog post or article below to generate SEO metadata
              instantly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                <Label
                  htmlFor="content"
                  className="text-sm font-medium text-foreground mb-3 block"
                >
                  Blog Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Paste your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[280px] bg-secondary/30 border-border resize-none text-sm leading-relaxed font-body"
                  data-ocid="dashboard.textarea"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    {wordCount} words · {charCount} characters
                  </span>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !content.trim()}
                    className="gap-2 px-6"
                    data-ocid="dashboard.submit_button"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Analyze Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Model Intelligence Panel */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-card h-full"
                data-ocid="dashboard.panel"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">
                      Model Intelligence
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Self-training status
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">
                        Training Samples
                      </span>
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {trainingSamples}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(trainingSamples * 5, 100)}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">
                        Model Accuracy
                      </span>
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {trainingSamples > 0 ? `${accuracy}%` : "—"}
                      </span>
                    </div>
                    <Progress
                      value={accuracy}
                      className="h-1.5"
                      data-ocid="dashboard.panel"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {trainingSamples === 0
                        ? "Submit feedback on your results to start training the model."
                        : "The more you correct the model, the smarter it gets."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { label: "Minimum length", value: "50+ words for best results" },
              { label: "Content types", value: "Blog posts, articles, essays" },
              { label: "Analysis time", value: "Instant — no waiting" },
            ].map((tip) => (
              <div
                key={tip.label}
                className="bg-card/50 border border-border rounded-xl p-4"
              >
                <div className="text-xs font-semibold text-primary mb-1">
                  {tip.label}
                </div>
                <div className="text-sm text-muted-foreground">{tip.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
