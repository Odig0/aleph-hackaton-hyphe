'use client';

import { cn } from '@/lib/utils';

interface PresetAmountsProps {
  amounts: number[];
  selected: number | null;
  onSelect: (amount: number) => void;
}

export function PresetAmounts({ amounts, selected, onSelect }: PresetAmountsProps) {
  return (
    <div className="flex gap-2">
      {amounts.map((amount) => (
        <button
          key={amount}
          type="button"
          onClick={() => onSelect(amount)}
          className={cn(
            'flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all duration-200',
            selected === amount
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-primary/5 text-muted-foreground hover:bg-primary/10 hover:text-foreground border border-primary/10',
          )}
        >
          ${amount}
        </button>
      ))}
    </div>
  );
}
