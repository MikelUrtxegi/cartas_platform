import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/lib/mock-data";

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  draft: { label: 'Borrador', className: 'bg-muted text-muted-foreground' },
  active: { label: 'En curso', className: 'bg-primary/10 text-primary' },
  canvas: { label: 'Canvas', className: 'bg-warning/10 text-warning' },
  closed: { label: 'Cerrada', className: 'bg-muted text-muted-foreground line-through' },
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      config.className
    )}>
      {config.label}
    </span>
  );
}
