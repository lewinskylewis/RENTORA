import { useState } from "react";
import { Check, Heart, Send, Star } from "lucide-react";
import { BackButton, BackToDashboardButton, GlassCard, PageHeader } from "@/app/components";
import { useTheme } from "@/app/theme";
import type { NavState } from "@/app/types";

export function RateUs({ onNav }: { onNav: (nav: NavState) => void }) {
  const theme = useTheme();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const labels = ["Tap a star to rate", "Poor", "Fair", "Good", "Great", "Excellent"];
  const chips = ["Easy to use", "Fast payments", "Helpful AI", "Great support", "Beautiful design", "Reliable"];

  const toggleTag = (t: string) => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  if (submitted) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(250,204,21,0.3)]">
            <Heart className="w-10 h-10 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="absolute inset-0 bg-yellow-500/10 blur-[40px] rounded-full" />
        </div>
        <h2 className="text-3xl font-light tracking-tight mb-3">Thank You!</h2>
        <p className="text-white/50 mb-2">Your feedback means the world to us.</p>
        <p className="text-sm text-white/30 mb-8">We use every review to make Rentora better for tenants like you.</p>
        <div className="flex items-center justify-center gap-1 mb-10">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`w-6 h-6 ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
          ))}
        </div>
        <BackToDashboardButton onNav={onNav} />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <BackButton onBack={() => onNav({ page: "dashboard" })} />
      <PageHeader title="Rate Us" subtitle="Share your feedback" accent="purple" />

      {/* Star rating */}
      <GlassCard className="p-8 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-600/5" />
        <div className="relative z-10">
          <p className="text-sm text-white/60 mb-6">How would you rate your experience?</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-125 active:scale-95"
              >
                <Star className={`w-10 h-10 transition-colors ${s <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
              </button>
            ))}
          </div>
          <p className={`text-lg font-medium h-7 transition-colors ${rating || hover ? "text-yellow-400" : "text-white/30"}`}>
            {labels[hover || rating]}
          </p>
        </div>
      </GlassCard>

      {/* Tags */}
      <GlassCard className="p-6 mb-6">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">What did you love?</p>
        <div className="flex flex-wrap gap-3">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => toggleTag(c)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${tags.includes(c) ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "bg-white/[0.02] border-white/[0.05] text-white/60 hover:bg-white/[0.05]"}`}
            >
              {tags.includes(c) && <Check className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />}
              {c}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Comment */}
      <GlassCard className="p-6 mb-8">
        <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Additional Comments</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Tell us what you think or how we can improve..."
          className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_0_2px_rgba(168,85,247,0.1)] transition-all"
        />
      </GlassCard>

      <button
        onClick={() => setSubmitted(true)}
        disabled={!rating}
        className="w-full py-4 rounded-2xl text-white font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
        style={{ background: theme.ctaPurple, boxShadow: `0 0 30px ${theme.glow3}` }}
      >
        <Send className="w-5 h-5" /> Submit Feedback
      </button>
    </main>
  );
}
