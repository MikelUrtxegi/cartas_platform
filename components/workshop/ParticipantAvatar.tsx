import { cn } from "@/lib/utils";
import { OnlineIndicator } from "./OnlineIndicator";

interface ParticipantAvatarProps {
  name: string;
  online: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ParticipantAvatar({ name, online, size = 'md', className }: ParticipantAvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={cn("relative inline-flex", className)}>
      <div className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium",
        size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs'
      )}>
        {initials}
      </div>
      <OnlineIndicator
        online={online}
        className={cn(
          "absolute -bottom-0.5 -right-0.5 ring-2 ring-card",
          size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'
        )}
      />
    </div>
  );
}
