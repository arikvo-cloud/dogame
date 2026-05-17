import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  Icon: LucideIcon;
  items: string[];
  variant?: "success" | "warning" | "primary" | "accent";
}

const variantStyles: Record<NonNullable<Props["variant"]>, string> = {
  success: "bg-success-tint border-success/40 text-success",
  warning: "bg-warning-tint border-warning/50 text-warning",
  primary: "bg-primary-tint border-primary-soft text-primary-deep",
  accent: "bg-accent-tint border-accent-soft text-accent-deep",
};

export function InfoList({ title, Icon, items, variant = "primary" }: Props) {
  return (
    <section
      className={cn(
        "rounded-[26px] border-[3px] p-5 md:p-6 shadow-[var(--shadow-clay)]",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" strokeWidth={2.5} />
        <h2 className="font-display font-black text-lg">{title}</h2>
      </div>
      <ul className="space-y-2.5 text-ink">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-2 inline-block w-2 h-2 rounded-full bg-current shrink-0" />
            <span className="text-base leading-relaxed font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
