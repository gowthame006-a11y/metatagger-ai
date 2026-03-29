import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  FileText,
  Search,
  Sparkles,
  Tag,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid-pattern">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-extrabold text-foreground tracking-tight">
              MetaTagger <span className="text-primary">AI</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {["Features", "How It Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild data-ocid="nav.link">
              <Link to="/login">Log In</Link>
            </Button>
            <Button size="sm" asChild data-ocid="nav.primary_button">
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] rounded-full bg-accent/8 blur-[80px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/25 mb-6">
                  <Zap className="w-3 h-3" />
                  AI-Powered SEO Intelligence
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-display text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6"
              >
                Transform Your Content with{" "}
                <span className="gradient-text">AI-Powered SEO</span>{" "}
                Intelligence
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
              >
                Instantly generate SEO tags, extract top keywords, summarize
                content, and score confidence — all in seconds. No guesswork,
                just results.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => navigate({ to: "/signup" })}
                  className="gap-2"
                  data-ocid="hero.primary_button"
                >
                  Analyze Now <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-border hover:border-primary/50"
                  data-ocid="hero.secondary_button"
                >
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </motion.div>
              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-6 mt-8"
              >
                {["No credit card", "Free tier", "Instant results"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-accent" />
                      {item}
                    </div>
                  ),
                )}
              </motion.div>
            </motion.div>

            {/* Hero Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow glow-blue">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Analysis Complete
                      </div>
                      <div className="text-xs text-muted-foreground">
                        12 SEO tags generated
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full border border-accent/30">
                        87% confidence
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-secondary/60 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-2">
                        SEO Title Suggestion
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        Machine Learning: A Complete Guide to Modern AI
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Machine Learning",
                        "AI",
                        "Neural Networks",
                        "Deep Learning",
                        "Data Science",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full border border-primary/30 text-primary/80 bg-primary/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-secondary/60 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-foreground">
                          5
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Keywords
                        </div>
                      </div>
                      <div className="bg-secondary/60 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-foreground">
                          4 min
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Read time
                        </div>
                      </div>
                      <div className="bg-secondary/60 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-accent">
                          Tech
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Category
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-6 bg-card border border-accent/30 rounded-xl px-3 py-2 shadow-card"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <Target className="w-3 h-3 text-accent" />
                    <span className="text-foreground font-medium">
                      Top Keywords
                    </span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-4 -left-6 bg-card border border-primary/30 rounded-xl px-3 py-2 shadow-card"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <BarChart3 className="w-3 h-3 text-primary" />
                    <span className="text-foreground font-medium">
                      SEO Score: 87
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-10 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by content creators everywhere
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              "ContentPro",
              "BlogWave",
              "SEO Labs",
              "WriteAI",
              "MediaStack",
              "CreativeHub",
            ].map((brand) => (
              <span
                key={brand}
                className="text-sm font-semibold text-muted-foreground/50 tracking-wide uppercase"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to transform your raw content into fully
              optimized, SEO-ready metadata.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Paste Content",
                desc: "Copy and paste your blog post, article, or any text content into the dashboard editor.",
              },
              {
                step: "02",
                icon: Brain,
                title: "AI Analysis",
                desc: "Our AI engine analyzes your content for topics, keywords, categories, and SEO opportunities.",
              },
              {
                step: "03",
                icon: Target,
                title: "Get Results",
                desc: "Receive tags, keywords, summary, SEO title, read time, and a confidence score instantly.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-card border border-border rounded-2xl p-6 card-hover shadow-card"
              >
                <div className="text-5xl font-display font-extrabold text-primary/10 mb-4">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
                {i < 2 && (
                  <ChevronRight className="absolute top-1/2 -right-3 w-5 h-5 text-primary/30 hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 bg-card/20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Core Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to optimize your content for search engines,
              readers, and algorithms.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Tag,
                title: "SEO Tag Generation",
                desc: "Generates 8–15 relevant, keyword-rich tags tailored to your content's topic and category.",
              },
              {
                icon: Search,
                title: "Keyword Extraction",
                desc: "Identifies the top 5 high-frequency keywords that define your content's search intent.",
              },
              {
                icon: FileText,
                title: "Content Summary",
                desc: "Creates a concise 2–3 sentence summary capturing the core message of your article.",
              },
              {
                icon: BarChart3,
                title: "Confidence Scoring",
                desc: "Scores SEO optimization potential from 0–100% based on content depth and keyword density.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 card-hover shadow-card"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-foreground text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Powerful Dashboard
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A clean, intuitive workspace to analyze and manage all your
              content metadata in one place.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-primary/20 bg-card overflow-hidden shadow-glow"
          >
            <div className="bg-secondary/50 border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-muted-foreground">
                metatagger.ai/dashboard
              </span>
            </div>
            <div className="p-6 md:p-10">
              <div className="max-w-2xl mx-auto">
                <h3 className="font-display font-bold text-foreground text-xl mb-2">
                  Analyze Your Content
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Paste your blog post or article below to generate SEO metadata
                  instantly.
                </p>
                <div className="bg-secondary/40 border border-border rounded-xl p-4 h-32 mb-4 flex items-start">
                  <span className="text-sm text-muted-foreground/60 italic">
                    Paste your blog content here...
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    0 words · 0 characters
                  </span>
                  <Button size="sm" className="gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    Analyze Content
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 bg-card/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Start Optimizing Today
            </h2>
            <p className="text-muted-foreground mb-8">
              Free forever. No credit card required. Analyze unlimited content.
            </p>
            <Button
              size="lg"
              onClick={() => navigate({ to: "/signup" })}
              className="gap-2"
              data-ocid="cta.primary_button"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-display font-bold text-foreground">
                MetaTagger <span className="text-primary">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="footer.link"
              >
                Features
              </Link>
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="footer.link"
              >
                Dashboard
              </Link>
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="footer.link"
              >
                Login
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
