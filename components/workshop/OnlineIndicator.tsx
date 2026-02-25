import { cn } from "@/lib/utils";

export function OnlineIndicator({ online, className }: { online: boolean; className?: string }) {
  return (
    <span className={cn(
      "inline-block h-2 w-2 rounded-full",
      online ? "bg-success" : "bg-muted-foreground/30",
      className
    )} />
  );
}
