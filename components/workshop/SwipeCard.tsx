import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CardItem } from "@/lib/mock-data";

const CARD_COLORS = ["bg-[hsl(var(--card-yellow))]", "bg-[hsl(var(--card-green))]", "bg-[hsl(var(--card-blue))]"];
const TEXT_COLORS = ["text-[hsl(222,47%,11%)]", "text-white", "text-white"];

const ICONS = [
  // Compass
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><circle cx="24" cy="24" r="18" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.2"/><path d="M24 14l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill="white"/></svg>,
  // Maze
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><circle cx="24" cy="24" r="18" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.2"/><rect x="16" y="16" width="16" height="16" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><path d="M20 16v8h8v-4h-4v-4" stroke="white" strokeWidth="1.5" fill="none"/></svg>,
  // Eye
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><circle cx="24" cy="24" r="18" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.2"/><ellipse cx="24" cy="24" rx="10" ry="6" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="24" cy="24" r="3" fill="white"/></svg>,
];

interface SwipeCardProps {
  card: CardItem;
  index: number;
  totalCards: number;
  onSwipe: (direction: "left" | "right") => void;
  onEdit: () => void;
  isTop: boolean;
  editedText?: string;
  note?: string;
}

export function SwipeCard({ card, index, totalCards, onSwipe, onEdit, isTop, editedText, note }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const colorIndex = index % CARD_COLORS.length;

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={cn(
            "w-[320px] h-[440px] rounded-3xl shadow-lg flex flex-col items-center justify-between p-8 opacity-60 scale-95",
            CARD_COLORS[colorIndex]
          )}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
    >
      {/* Like overlay */}
      <motion.div
        className="absolute top-8 left-8 z-20 border-4 border-[hsl(var(--success))] text-[hsl(var(--success))] rounded-xl px-4 py-2 text-2xl font-bold -rotate-12"
        style={{ opacity: likeOpacity }}
      >
        ✓ SÍ
      </motion.div>
      {/* Nope overlay */}
      <motion.div
        className="absolute top-8 right-8 z-20 border-4 border-[hsl(var(--destructive))] text-[hsl(var(--destructive))] rounded-xl px-4 py-2 text-2xl font-bold rotate-12"
        style={{ opacity: nopeOpacity }}
      >
        ✗ NO
      </motion.div>

      <div
        className={cn(
          "w-[320px] h-[440px] rounded-3xl shadow-2xl flex flex-col items-center justify-between overflow-hidden select-none",
          CARD_COLORS[colorIndex]
        )}
      >
        {/* Top section with icon */}
        <div className="flex flex-col items-center pt-10 pb-4 gap-3">
          {ICONS[colorIndex]}
        </div>

        {/* Card text */}
        <div className="flex-1 flex items-center px-8">
          <p className={cn("text-center text-lg font-semibold leading-relaxed", TEXT_COLORS[colorIndex])}>
            {editedText || card.text}
          </p>
        </div>

        {/* Category + number */}
        <div className="w-full px-6 pb-4">
          {card.category && (
            <p className={cn("text-center text-sm font-medium opacity-80 mb-3", TEXT_COLORS[colorIndex])}>
              {card.category}
            </p>
          )}
          {note && (
            <p className={cn("text-center text-xs opacity-70 italic mb-2", TEXT_COLORS[colorIndex])}>
              📝 {note}
            </p>
          )}
          {/* Bottom bar mimicking barcode area */}
          <div className="bg-white/90 rounded-xl px-4 py-2 flex items-center justify-between">
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-[2px] bg-foreground/70" style={{ height: `${8 + Math.random() * 10}px` }} />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground/80 tabular-nums">{index + 1}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
