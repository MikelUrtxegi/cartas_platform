import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReviewCard {
  id: string;
  text: string;
  category?: string;
  editedText?: string;
  note?: string;
}

interface CardReviewScreenProps {
  likedCards: ReviewCard[];
  dislikedCards: ReviewCard[];
  onToggleCard: (cardId: string) => void;
  onConfirm: () => void;
}

export const CardReviewScreen = ({
  likedCards,
  dislikedCards,
  onToggleCard,
  onConfirm,
}: CardReviewScreenProps) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => onConfirm(), 600);
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 p-8 text-center"
      >
        <CheckCircle2 className="h-16 w-16 text-[hsl(var(--success))]" />
        <p className="text-2xl font-bold font-display">¡Confirmado!</p>
        <p className="text-sm text-muted-foreground">Tu selección ha sido enviada</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Question header */}
      <div className="text-center py-4 px-4 border-b bg-card/50">
        <p className="text-lg font-bold font-display">¿Estás seguro de tu selección?</p>
        <p className="text-xs text-muted-foreground mt-1">
          Puedes mover cartas entre columnas antes de confirmar
        </p>
      </div>

      {/* Two columns */}
      <div className="flex-1 grid grid-cols-2 gap-0 overflow-hidden">
        {/* Selected column */}
        <div className="flex flex-col border-r">
          <div className="sticky top-0 z-10 flex items-center justify-center gap-2 py-2.5 px-3 bg-[hsl(var(--success))]/10 border-b">
            <Check className="h-4 w-4 text-[hsl(var(--success))]" />
            <span className="text-xs font-semibold text-[hsl(var(--success))]">
              Seleccionadas ({likedCards.length})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {likedCards.map((card) => (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => onToggleCard(card.id)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 transition-colors",
                    "hover:bg-destructive/5 hover:border-destructive/30 group"
                  )}
                >
                  <p className="text-xs font-medium leading-snug">
                    {card.editedText || card.text}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground group-hover:text-destructive">
                    <ArrowRight className="h-3 w-3" />
                    <span>Mover a descartadas</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            {likedCards.length === 0 && (
              <p className="text-xs text-muted-foreground/50 text-center py-8 italic">
                Sin cartas seleccionadas
              </p>
            )}
          </div>
        </div>

        {/* Discarded column */}
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-center gap-2 py-2.5 px-3 bg-destructive/10 border-b">
            <X className="h-4 w-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive">
              Descartadas ({dislikedCards.length})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {dislikedCards.map((card) => (
                <motion.button
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => onToggleCard(card.id)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 transition-colors opacity-60",
                    "hover:opacity-100 hover:bg-[hsl(var(--success))]/5 hover:border-[hsl(var(--success))]/30 group"
                  )}
                >
                  <p className="text-xs font-medium leading-snug">
                    {card.editedText || card.text}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground group-hover:text-[hsl(var(--success))]">
                    <ArrowLeft className="h-3 w-3" />
                    <span>Mover a seleccionadas</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            {dislikedCards.length === 0 && (
              <p className="text-xs text-muted-foreground/50 text-center py-8 italic">
                Sin cartas descartadas
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <div className="border-t bg-card/80 backdrop-blur-sm p-4">
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleConfirm}
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          Confirmar selección ({likedCards.length} cartas)
        </Button>
      </div>
    </div>
  );
};
