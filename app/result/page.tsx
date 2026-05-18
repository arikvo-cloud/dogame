import Link from "next/link";
import { Suspense } from "react";
import { ResultView } from "@/components/result/ResultView";
import { SiteNav } from "@/components/providers/SiteNav";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "התוצאות שלך · DoGame",
  description: "הגזעים שהכי מתאימים לסגנון החיים שלך.",
};

function ResultSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="text-center">
        <Skeleton className="h-7 w-44 mx-auto mb-4" rounded="rounded-full" />
        <Skeleton className="h-14 w-3/4 mx-auto mb-3" rounded="rounded-lg" />
        <Skeleton className="h-5 w-1/2 mx-auto" rounded="rounded-md" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-44 w-full" rounded="rounded-[32px]" />
          ))}
        </div>
        <Skeleton className="h-96 w-full lg:sticky lg:top-4" rounded="rounded-[32px]" />
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Suspense fallback={<ResultSkeleton />}>
          <ResultView />
        </Suspense>
      </div>
    </main>
  );
}
