"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/layout/WalletButton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const links = [
  {
    href: "/",
    label: "Markets",
    match: (p: string) => p === "/" || p.startsWith("/markets"),
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    match: (p: string) => p === "/portfolio",
  },
  {
    href: "/infofi",
    label: "Activity",
    match: (p: string) => p === "/infofi",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 md:gap-8 md:px-6">
        {/* Left: Logo + Stellar + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="mr-1 rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-2 px-4 pt-6">
                {/* Mobile search */}
                <form
                  className="relative mb-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                      setMobileOpen(false);
                    }
                  }}
                >
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </form>
                {/* Mobile nav links */}
                <nav className="flex flex-col gap-1">
                  {links.map(({ href, label, match }) => {
                    const active = match(pathname);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                        )}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-start gap-1">
            <h1 className="text-2xl font-bold leading-none tracking-tight">Hyphe</h1>
            <span className="mt-[3px] text-xs font-bold uppercase leading-none tracking-[0.2em] text-primary">Markets</span>
          </Link>
          <div className="ml-4 hidden items-center gap-1 rounded border border-yes/20 bg-yes/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-yes sm:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-yes shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Testnet
          </div>
        </div>

        {/* Center: Nav links — desktop only */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(({ href, label, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-base font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + Wallet */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <form
            className="relative hidden max-w-md flex-1 md:block"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search markets, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
