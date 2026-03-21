import Link from "next/link";
import { Zap } from "lucide-react";

const productLinks = [
  { href: "/", label: "Markets" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/infofi", label: "The Pulse" },
];

const ecosystemLinks = [
  { href: "https://nextjs.org", label: "Next.js" },
  { href: "https://react.dev", label: "React" }
];

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/20 bg-primary/10">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-base font-bold tracking-tight">Hyphe</span>
            </div>
            <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
              Prediction markets UI with fully mocked frontend data.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
              Product
            </h4>
            <ul className="space-y-2">
              {productLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
              Ecosystem
            </h4>
            <ul className="space-y-2">
              {ecosystemLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Built For */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
              Built For
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Frontend Prototype
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border/20 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Hyphe
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-yes/50" />
            <span className="text-xs text-muted-foreground">
              Mock data mode
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
