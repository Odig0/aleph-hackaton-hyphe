"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  tips?: string[];
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  tips,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center md:py-20">
      {/* Icon with glow background + float animation */}
      <div className="relative mb-6">
        <div className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5">
          <Icon className="h-7 w-7 text-primary/60" />
        </div>
        {/* Radial gradient behind icon */}
        <div
          className="glow-orb left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.17 275 / 0.1), transparent 70%)",
          }}
        />
      </div>

      <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-readable mb-6 max-w-sm text-base leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Tips section */}
      {tips && tips.length > 0 && (
        <div className="mb-8 w-full max-w-sm rounded-xl border border-border/30 bg-muted/20 p-4 text-left">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tips
          </p>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary/40" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {actionLabel &&
        (actionHref ? (
          <Button asChild className="btn-depth group">
            <Link href={actionHref}>
              {actionLabel}
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        ) : (
          <Button onClick={onAction} className="btn-depth">
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
