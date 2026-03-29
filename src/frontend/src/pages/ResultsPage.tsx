import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  LogOut,
  Search,
  Sparkles,
  Tag,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetHistory,
  useSubmitFeedback,
} from "../hooks/useQueries";
import type { AnalysisResult as LocalResult } from "../utils/analyzer";

const CATEGORIES = [
  "Technology",
  "Business",
  "Health",
  "Education",
  "Finance",
  "Lifestyle",
  "Other",
];

function ConfidenceRing({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.setProperty("--target-offset", String(offset));
    }
  }, [offset]);

  const color =
    score >= 70
      ? "oklch(0.75 0.13 192)"
      : score >= 40
        ? "oklch(0.56 0.198 262)"
        : "oklch(0.577 0.245 27.325)";

  return (
    <div className="flex flex-col items-center">
      <svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        role="img"
        aria-label={`Confidence score: ${score}%`}
      >
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="oklch(0.95 0.01 240 / 0.1)"
          strokeWidth="8"
        />
        <circle
          ref={ringRef}
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 55 55)"
          className="progress-ring-animate"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text
          x="55"
          y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="oklch(0.95 0.018 240)"
          fontSize="18"
          fontWeight="bold"
        >
          {score}%
        </text>
      </svg>
      <span className="text-xs text-muted-foreground mt-1">
        Confidence Score
      </span>
    </div>
  );
}

export function ResultsPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: history } = useGetHistory();
  const { data: profile } = useGetCallerUserProfile();
  const submitFeedback = useSubmitFeedback();

  const state = router.state.location.state as unknown as {
    result: LocalResult;
    content: string;
    timestamp?: string;
  } | null;
  const result = state?.result;
  const analysisTimestamp = state?.timestamp
    ? BigInt(state.timestamp)
    : BigInt(Date.now());

  // Feedback state
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [correctCategory, setCorrectCategory] = useState("");
  const [correctedKeywordsRaw, setCorrectedKeywordsRaw] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (!result) navigate({ to: "/dashboard" });
  }, [result, navigate]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const handleSubmitFeedback = async () => {
    if (helpful === null) {
      toast.error("Please indicate if this analysis was helpful.");
      return;
    }
    try {
      const correctedKeywords = correctedKeywordsRaw
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k.length > 0);

      await submitFeedback.mutateAsync({
        analysisTimestamp,
        isHelpful: helpful,
        correctCategory: correctCategory || (result?.category ?? ""),
        correctedKeywords,
      });
      setFeedbackSubmitted(true);
      toast.success("Thanks! Your feedback is training the model.");
    } catch {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  if (!result) return null;

  const categoryColors: Record<string, string> = {
    Technology: "text-primary bg-primary/15 border-primary/30",
    Business: "text-yellow-400 bg-yellow-400/15 border-yellow-400/30",
    Health: "text-green-400 bg-green-400/15 border-green-400/30",
    Education: "text-purple-400 bg-purple-400/15 border-purple-400/30",
    Finance: "text-orange-400 bg-orange-400/15 border-orange-400/30",
    Lifestyle: "text-pink-400 bg-pink-400/15 border-pink-400/30",
    Other: "text-muted-foreground bg-muted/20 border-border",
  };
  const catClass = categoryColors[result.category] || categoryColors.Other;

  return (
    <div className="min-h-screen grid-pattern">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            data-ocid="results.link"
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
              <span className="hidden sm:block text-sm text-muted-foreground">
                {profile.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-ocid="results.button"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/dashboard" })}
              className="gap-2"
              data-ocid="results.secondary_button"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Your Analysis Results
          </h1>
          <p className="text-muted-foreground mb-8">
            AI-powered SEO metadata generated from your content.
          </p>
        </motion.div>

        <div className="grid gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-card border border-primary/25 rounded-2xl p-6 shadow-card"
            data-ocid="results.card"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                SEO Title Suggestion
              </span>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              {result.suggestedTitle}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card flex flex-col items-center justify-center"
              data-ocid="results.card"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Category
              </span>
              <Badge
                className={`text-sm px-4 py-1.5 rounded-full border font-semibold ${catClass}`}
              >
                {result.category}
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card flex flex-col items-center justify-center"
              data-ocid="results.card"
            >
              <ConfidenceRing score={result.confidenceScore} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card flex flex-col items-center justify-center"
              data-ocid="results.card"
            >
              <Clock className="w-8 h-8 text-accent mb-2" />
              <div className="font-display text-3xl font-bold text-foreground">
                {result.readTimeMinutes} min
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Estimated Read Time
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-card"
            data-ocid="results.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Top 5 SEO Keywords
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {result.keywords.map((kw, i) => (
                <div
                  key={kw}
                  className="flex items-center gap-2 bg-secondary/60 border border-border rounded-xl px-4 py-2"
                >
                  <span className="text-xs font-bold text-primary">
                    #{i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground capitalize">
                    {kw}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-card"
            data-ocid="results.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Generated SEO Tags ({result.seoTags.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.seoTags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full border border-primary/30 text-primary/80 bg-primary/10 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-card"
            data-ocid="results.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Content Summary
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {result.summary ||
                "No summary could be generated. Please provide more content."}
            </p>
          </motion.div>

          {/* Feedback / Self-training section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-card border border-primary/20 rounded-2xl p-6 shadow-card"
            data-ocid="results.panel"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Help the model learn
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              Your corrections improve future analyses for your content.
            </p>

            {feedbackSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 py-4 text-sm text-foreground"
                data-ocid="results.success_state"
              >
                <div className="w-8 h-8 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold">
                    Feedback received — thank you!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    The model will apply your corrections on the next analysis.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-5">
                {/* Thumbs up / down */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-2.5 block">
                    Was this analysis helpful?
                  </Label>
                  <div className="flex gap-3">
                    <Button
                      variant={helpful === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => setHelpful(true)}
                      className="gap-2"
                      data-ocid="results.toggle"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yes
                    </Button>
                    <Button
                      variant={helpful === false ? "default" : "outline"}
                      size="sm"
                      onClick={() => setHelpful(false)}
                      className="gap-2"
                      data-ocid="results.toggle"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Needs improvement
                    </Button>
                  </div>
                </div>

                {/* Category correction */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground mb-2.5 block">
                    Correct category{" "}
                    <span className="text-muted-foreground/60">
                      (currently: {result.category})
                    </span>
                  </Label>
                  <Select
                    value={correctCategory || result.category}
                    onValueChange={setCorrectCategory}
                  >
                    <SelectTrigger
                      className="w-48 bg-secondary/40 border-border"
                      data-ocid="results.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Keyword corrections */}
                <div>
                  <Label
                    htmlFor="corrected-keywords"
                    className="text-xs font-medium text-muted-foreground mb-2.5 block"
                  >
                    Add corrected keywords{" "}
                    <span className="text-muted-foreground/60">
                      (comma-separated, optional)
                    </span>
                  </Label>
                  <Input
                    id="corrected-keywords"
                    placeholder="e.g. machine learning, neural network, deep learning"
                    value={correctedKeywordsRaw}
                    onChange={(e) => setCorrectedKeywordsRaw(e.target.value)}
                    className="bg-secondary/40 border-border max-w-md"
                    data-ocid="results.input"
                  />
                </div>

                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submitFeedback.isPending || helpful === null}
                  size="sm"
                  className="gap-2"
                  data-ocid="results.submit_button"
                >
                  {submitFeedback.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </div>
            )}
          </motion.div>

          {history && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card"
              data-ocid="results.table"
            >
              <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" />
                Previous Analyses
              </h3>
              <div className="space-y-3">
                {history.slice(0, 5).map((item, i) => (
                  <div
                    key={`${item.suggestedTitle}-${Number(item.timestamp)}`}
                    className="flex items-center justify-between bg-secondary/40 border border-border rounded-xl px-4 py-3"
                    data-ocid={`results.item.${i + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.suggestedTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.category} · {Number(item.readTimeMinutes)} min
                        read
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="ml-3 text-xs flex-shrink-0"
                    >
                      {Number(item.confidenceScore)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
