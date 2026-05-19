"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  MessageCircle,
  RefreshCw,
  FileDown,
  Share2,
  Mail,
} from "lucide-react";
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
import type { BreedMatch } from "@/lib/breeds/types";
import type { TraitVector } from "@/lib/traits";
import { useToast } from "@/components/ui/Toast";
import { track } from "@/lib/track";

interface Props {
  topBreedName: string;
  topScore: number;
  /** Answers to encode in the share URL (so recipients see the same results) */
  answers: AnswerMap;
  /** Top match — used for PDF generation */
  topMatch: BreedMatch;
  /** All matches — also included in PDF */
  allMatches: BreedMatch[];
  /** User trait vector — also included in PDF */
  userVector: TraitVector;
}

export function ShareButtons({
  topBreedName,
  topScore,
  answers,
  topMatch,
  allMatches,
  userVector,
}: Props) {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://dogame.pages.dev";
  // Shareable result URL with encoded answers
  const shareUrl = buildShareUrl(answers, origin);
  const shareText = buildShareText(topBreedName, topScore);
  const text = `${shareText} ${shareUrl}`;

  // Detect native share availability (mobile Safari/Android, some desktop browsers)
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      queueMicrotask(() => setCanNativeShare(true));
    }
  }, []);

  async function nativeShare() {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: `${topBreedName} · DoGame`,
        text: shareText,
        url: shareUrl,
      });
      track.share("native");
    } catch (err) {
      // AbortError when user cancels — ignore. Any other error: fallback to copy.
      if (err instanceof Error && err.name !== "AbortError") {
        const ok = await copyToClipboard(text);
        if (ok) toast.show("הקישור הועתק במקום", "info");
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
      {canNativeShare && (
        <Button size="lg" variant="primary" onClick={nativeShare}>
          <Share2 className="w-5 h-5" strokeWidth={2.5} />
          שתף
        </Button>
      )}
      <Button
        size="lg"
        variant={canNativeShare ? "soft" : "primary"}
        onClick={() => {
          window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
          track.share("whatsapp");
        }}
      >
        <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
        ווטסאפ
      </Button>
      <Button
        size="lg"
        variant="soft"
        onClick={() => {
          const subject = encodeURIComponent(`התאמת גזע כלב מ-DoGame: ${topBreedName}`);
          const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
          window.location.href = `mailto:?subject=${subject}&body=${body}`;
          track.share("native");
        }}
      >
        <Mail className="w-5 h-5" strokeWidth={2.5} />
        מייל
      </Button>
      <Button
        size="lg"
        variant="soft"
        onClick={async () => {
          const ok = await copyToClipboard(text);
          if (ok) {
            setCopied(true);
            track.share("copy");
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
        variant="soft"
        disabled={downloading}
        onClick={async () => {
          setDownloading(true);
          try {
            const { downloadResultPdf } = await import("@/lib/pdf");
            await downloadResultPdf(topMatch, allMatches, userVector);
            track.share("pdf");
            toast.show("ה-PDF הורד בהצלחה 📄", "success");
          } catch (err) {
            const msg = err instanceof Error ? err.message : "שגיאה";
            toast.show(`יצירת PDF נכשלה: ${msg}`, "error");
          } finally {
            setDownloading(false);
          }
        }}
      >
        <FileDown className="w-5 h-5" strokeWidth={2.5} />
        {downloading ? "מכין PDF…" : "הורד PDF"}
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
