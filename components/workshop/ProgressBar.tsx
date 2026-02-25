import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, max, className, showLabel = true, size = 'md' }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex-1 rounded-full bg-muted overflow-hidden",
        size === 'sm' ? 'h-1.5' : 'h-2'
      )}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground tabular-nums min-w-[3ch] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
}
