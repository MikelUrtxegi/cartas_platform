import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteCounterProps {
  likes: number;
  dislikes?: number;
  className?: string;
}

export function VoteCounter({ likes, dislikes, className }: VoteCounterProps) {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <span className="inline-flex items-center gap-1 text-success">
        <ThumbsUp className="h-3.5 w-3.5" />
        <span className="font-medium tabular-nums">{likes}</span>
      </span>
      {dislikes !== undefined && (
        <span className="inline-flex items-center gap-1 text-destructive">
          <ThumbsDown className="h-3.5 w-3.5" />
          <span className="font-medium tabular-nums">{dislikes}</span>
        </span>
      )}
    </div>
  );
}
