import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle, Mail, TrendingUp, Globe, Zap, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const benefits = [
  { icon: <TrendingUp className="w-4 h-4" />, title: "Deal flow digest", desc: "New startups actively fundraising across India, SEA, and globally — curated weekly." },
  { icon: <Globe className="w-4 h-4" />, title: "Market intelligence", desc: "Emerging market venture data, sector trends, and capital flow analysis." },
  { icon: <Zap className="w-4 h-4" />, title: "Founder spotlights", desc: "In-depth interviews with founders navigating their raises in real time." },
  { icon: <Users className="w-4 h-4" />, title: "Investor moves", desc: "New fund launches, LP closes, and investor mandates — before they're public." },
];

const testimonials = [
  { quote: "The Project Zenith newsletter is the only one I read every single week. The deal flow digest alone is worth the subscribe.", name: "Sarah Chen", role: "Partner, Sequoia Capital" },
  { quote: "I've discovered three investable startups directly from the newsletter. It's become part of my Monday morning routine.", name: "Priya Kapoor", role: "Principal, Tiger Global" },
  { quote: "More signal, less noise. That's all I ask for from any newsletter — and Project Zenith delivers.", name: "Fatima Hassan", role: "Investment Director, a16z" },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setSubmitted(true);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 max-w-4xl">

        <div className="pt-20 pb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted mb-6">
            <Mail className="w-3.5 h-3.5" /> 8,400+ readers · Every Wednesday
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-5">
            The capital intelligence newsletter for serious operators
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Weekly deal flow, market intelligence, and founder stories from the front lines of emerging market venture. Free. No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* Signup form */}
        <div className="max-w-md mx-auto mb-16">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                  required
                />
                <Button type="submit" size="lg" className="w-full rounded-xl">Subscribe free</Button>
                <p className="text-xs text-center text-muted-foreground">No spam. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.</p>
              </motion.form>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">You're subscribed!</p>
                  <p className="text-muted-foreground mt-1">Check your inbox for a confirmation email. First issue lands Wednesday.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* What's inside */}
        <div className="mb-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-center mb-10">What's in every issue</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map(b => (
              <div key={b.title} className="flex gap-4 bg-card border rounded-2xl p-6">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">{b.title}</p>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="mb-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-center mb-10">What readers say</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card border rounded-2xl p-6 space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
