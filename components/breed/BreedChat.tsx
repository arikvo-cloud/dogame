"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Bot, User, AlertCircle } from "lucide-react";
import type { Breed } from "@/lib/breeds/types";
import { TRAITS } from "@/lib/traits";
import { cn } from "@/lib/cn";

interface Props {
  breed: Breed;
}

interface Turn {
  question: string;
  answer?: string;
  error?: string;
  loading?: boolean;
}

const QA_ENDPOINT =
  process.env.NEXT_PUBLIC_QA_ENDPOINT ??
  "https://dogame-qa.arik-637.workers.dev/";

const SUGGESTIONS = [
  "האם הוא יסתדר עם תינוק בבית?",
  "כמה פעילות הוא צריך ביום?",
  "האם הוא מתאים לדירה?",
  "מה האתגרים הנפוצים באילוף?",
  "האם הוא מסתדר עם חתולים?",
];

function buildContext(breed: Breed): string {
  const traits = Object.entries(breed.traits)
    .map(([k, v]) => `${TRAITS[k as keyof typeof TRAITS].label}: ${v}/10`)
    .join(", ");
  return (
    `Size: ${breed.size} (${breed.weightKg[0]}-${breed.weightKg[1]} kg). ` +
    `Lifespan: ${breed.lifeExpectancy[0]}-${breed.lifeExpectancy[1]} years. ` +
    `Exercise needs: ${breed.exerciseMinPerDay} min/day. ` +
    (breed.hypoallergenic ? "Hypoallergenic. " : "") +
    `Traits: ${traits}. ` +
    `${breed.description}`
  );
}

export function BreedChat({ breed }: Props) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  async function ask(question: string) {
    const q = question.trim();
    if (!q) return;
    setShowSuggestions(false);
    const idx = turns.length;
    setTurns((prev) => [...prev, { question: q, loading: true }]);
    setInput("");
    try {
      const res = await fetch(QA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breedName: breed.name,
          breedNameEn: breed.nameEn,
          breedContext: buildContext(breed),
          question: q,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { answer: string };
      setTurns((prev) =>
        prev.map((t, i) =>
          i === idx ? { question: q, answer: data.answer } : t
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "שגיאה לא ידועה";
      setTurns((prev) =>
        prev.map((t, i) => (i === idx ? { question: q, error: message } : t))
      );
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <section className="rounded-[28px] border-[3px] border-accent-soft bg-accent-tint/40 p-6 md:p-8 shadow-[var(--shadow-clay-lg),var(--shadow-inner-clay)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] bg-accent text-white border-[3px] border-accent-deep shadow-[0_3px_0_var(--color-accent-deep)]">
          <Bot className="w-6 h-6" strokeWidth={2.5} aria-hidden />
        </div>
        <div>
          <h2 className="font-display font-black text-xl md:text-2xl text-ink leading-tight">
            שאל/י את היועץ
          </h2>
          <p className="text-xs text-ink-soft font-medium">
            עוזר חכם שעונה על שאלות ספציפיות על {breed.name}
          </p>
        </div>
        <span className="ms-auto inline-flex items-center gap-1 bg-accent text-white border-2 border-accent-deep px-2 py-0.5 rounded-full text-[10px] font-display font-extrabold">
          <Sparkles className="w-3 h-3" strokeWidth={3} />
          BETA
        </span>
      </div>

      {/* Suggested questions */}
      {showSuggestions && turns.length === 0 && (
        <div className="mb-4">
          <div className="text-xs font-display font-extrabold text-ink-soft uppercase tracking-wide mb-2">
            שאלות פופולריות
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="px-3 py-1.5 rounded-full bg-surface border-2 border-border-strong text-sm font-display font-bold text-ink hover:border-accent hover:bg-accent-tint transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-accent-tint"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation */}
      {turns.length > 0 && (
        <div className="space-y-3 mb-4">
          <AnimatePresence initial={false}>
            {turns.map((t, i) => (
              <div key={i} className="space-y-2">
                <ChatBubble role="user">{t.question}</ChatBubble>
                {t.loading && <LoadingBubble />}
                {t.answer && <ChatBubble role="bot">{t.answer}</ChatBubble>}
                {t.error && (
                  <div className="inline-flex items-start gap-2 rounded-[14px] bg-danger-tint border-2 border-danger/40 px-3.5 py-2 text-sm text-ink font-medium max-w-[85%]">
                    <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" strokeWidth={2.5} />
                    לא הצלחנו לקבל תשובה. נסה שוב בעוד רגע.
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Input */}
      <form onSubmit={onSubmit} className="flex items-center gap-2 mt-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`שאל שאלה על ${breed.name}…`}
          aria-label="שאל שאלה"
          maxLength={500}
          disabled={turns.at(-1)?.loading}
          className="flex-1 bg-surface border-[3px] border-border-strong rounded-[16px] px-4 py-2.5 font-display text-ink placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-accent-tint disabled:opacity-50 shadow-[var(--shadow-clay-sm)]"
        />
        <button
          type="submit"
          disabled={!input.trim() || turns.at(-1)?.loading}
          aria-label="שלח שאלה"
          className="inline-flex items-center justify-center w-11 h-11 rounded-[16px] bg-accent text-white border-[3px] border-accent-deep shadow-[0_3px_0_var(--color-accent-deep)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_var(--color-accent-deep)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
        >
          <Send className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </form>

      <p className="mt-3 text-[11px] text-ink-soft text-center font-medium">
        ⚠ התשובות נוצרות ע"י AI ועלולות להכיל אי-דיוקים. לעצה רפואית רצינית פנו לוטרינר.
      </p>
    </section>
  );
}

function ChatBubble({
  role,
  children,
}: {
  role: "user" | "bot";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex items-start gap-2", isUser ? "" : "flex-row-reverse")}
    >
      <div
        className={cn(
          "shrink-0 w-8 h-8 rounded-full inline-flex items-center justify-center border-2",
          isUser
            ? "bg-bg-soft text-ink border-border-strong"
            : "bg-accent text-white border-accent-deep"
        )}
        aria-hidden
      >
        {isUser ? (
          <User className="w-4 h-4" strokeWidth={2.5} />
        ) : (
          <Bot className="w-4 h-4" strokeWidth={2.5} />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-[16px] border-2 px-3.5 py-2.5 leading-relaxed",
          isUser
            ? "bg-surface border-border-strong text-ink"
            : "bg-accent text-white border-accent-deep shadow-[0_2px_0_var(--color-accent-deep)]"
        )}
      >
        <p className="text-sm font-medium whitespace-pre-wrap">{children}</p>
      </div>
    </motion.div>
  );
}

function LoadingBubble() {
  return (
    <div className="flex items-start gap-2 flex-row-reverse">
      <div className="shrink-0 w-8 h-8 rounded-full inline-flex items-center justify-center border-2 bg-accent text-white border-accent-deep">
        <Bot className="w-4 h-4" strokeWidth={2.5} aria-hidden />
      </div>
      <div className="inline-flex items-center gap-1.5 bg-accent border-2 border-accent-deep rounded-[16px] px-4 py-3 shadow-[0_2px_0_var(--color-accent-deep)]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-2 h-2 rounded-full bg-white"
            animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
