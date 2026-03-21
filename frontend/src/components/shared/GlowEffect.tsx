import { cn } from "@/lib/utils";

interface GlowEffectProps {
  className?: string;
  children: React.ReactNode;
  /** Intensity: "subtle" for sections, "hero" for main hero */
  intensity?: "subtle" | "hero";
}

/**
 * Wraps content with dramatic multi-layer glow orbs.
 * Inspired by Linear.app's glow technique:
 * - Multiple offset orbs for depth
 * - Primary + cyan accent colors
 * - Animated pulse for life
 */
export function GlowEffect({
  className,
  children,
  intensity = "hero",
}: GlowEffectProps) {
  const isHero = intensity === "hero";

  return (
    <div className={cn("relative", className)}>
      {/* Primary violet glow — top center */}
      <div
        className={cn(
          "glow-orb animate-glow-pulse",
          isHero
            ? "left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2",
        )}
        style={{
          background: `radial-gradient(circle, oklch(0.541 0.232 275 / ${isHero ? 0.2 : 0.1}), transparent 70%)`,
        }}
      />

      {/* Cyan accent glow — offset right */}
      {isHero && (
        <div
          className="glow-orb animate-glow-pulse h-[400px] w-[400px]"
          style={{
            right: "10%",
            top: "20%",
            background: "radial-gradient(circle, oklch(0.72 0.15 195 / 0.12), transparent 70%)",
            animationDelay: "2s",
          }}
        />
      )}

      {/* Rose accent glow — offset left */}
      {isHero && (
        <div
          className="glow-orb animate-glow-pulse h-[350px] w-[350px]"
          style={{
            left: "5%",
            bottom: "10%",
            background: "radial-gradient(circle, oklch(0.72 0.20 340 / 0.08), transparent 70%)",
            animationDelay: "3s",
          }}
        />
      )}

      {/* Content sits above glow */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
