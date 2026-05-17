"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildShareText, copyToClipboard, whatsappLink } from "@/lib/share";
import { useQuizStore } from "@/store/useQuizStore";
import { useRouter } from "next/navigation";

interface Props {
  topBreedName: string;
  topScore: number;
}

export function ShareButtons({ topBreedName, topScore }: Props) {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);
  const [copied, setCopied] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz`
      : "https://dogame.app/quiz";
  const text = `${buildShareText(topBreedName, topScore)} ${siteUrl}`;

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
            setTimeout(() => setCopied(false), 2000);
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
