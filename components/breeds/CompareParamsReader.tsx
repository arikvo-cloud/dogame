"use client";

import { useSearchParams } from "next/navigation";
import { CompareView } from "./CompareView";

/** Wraps CompareView with URL search params (split into client component
 *  so the parent can be a Server Component with metadata). */
export function CompareParamsReader() {
  const params = useSearchParams();
  const a = params.get("a") ?? undefined;
  const b = params.get("b") ?? undefined;
  return <CompareView initialA={a} initialB={b} />;
}
