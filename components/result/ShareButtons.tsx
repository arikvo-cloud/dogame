"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  buildShareText,
  buildShareUrl,
  copyToClipboard,
  whatsappLink,
} from "@/lib/share";
import { useQuizStore } from "@/store/useQuizStore";
import { useRouter } from "next/navigation";
import type { AnswerMap } from "@/lib/quiz/types";
import { useToast } from "@/components/ui/Toast";

interface Props {
  topBreedName: string;
  topScore: number;
  /** Answers to encode in the share URL (so recipients see the same results) */
  answers: AnswerMap;
}

export function ShareButtons({ topBreedName, topScore, answers }: Props) {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://dogame.pages.dev";
  // Shareable result URL with encoded answers
  const shareUrl = buildShareUrl(answers, origin);
  const text = `${buildShareText(topBreedName, topScore)} ${shareUrl}`;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
      <Button
        size="lg"
        variant="primary"
        onClick={() => {
          window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
        }}
      >
        <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
        שתף בוואטסאפ
      </Button>
      <Button
        size="lg"
        variant="soft"
        onClick={async () => {
          const ok = await copyToClipboard(text);
          if (ok) {
            setCopied(true);
            toast.show("הקישור הועתק ללוח 📋", "success");
            setTimeout(() => setCopied(false), 2000);
          } else {
            toast.show("לא הצלחנו להעתיק. נסה שוב.", "error");
          }
        }}
      >
        {copied ? (
          <Check className="w-5 h-5" strokeWidth={3} />
        ) : (
          <Copy className="w-5 h-5" strokeWidth={2.5} />
        )}
        {copied ? "הועתק!" : "העתק לינק"}
      </Button>
      <Button
        size="lg"
        variant="ghost"
        onClick={() => {
          reset();
          router.push("/quiz");
        }}
      >
        <RefreshCw className="w-5 h-5" strokeWidth={2.5} />
        התחל מחדש
      </Button>
    </div>
  );
}
