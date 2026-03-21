'use client';

import { Globe, Shield, DollarSign, Code2 } from 'lucide-react';

const badges = [
  { label: 'Frontend Mock Mode', icon: Globe },
  { label: 'No Backend Required', icon: Shield },
  { label: 'USDC Backed', icon: DollarSign },
  { label: 'Open Source', icon: Code2 },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
      {badges.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="group flex items-center gap-2.5 text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium tracking-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}
