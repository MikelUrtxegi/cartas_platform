export type DeckCard = {
  id: number | string;
  title?: string;
  text?: string;
  description?: string;
};

export type Deck = {
  id: number | string;
  name?: string;
  title?: string;
  description?: string;

  // flags típicos
  is_default?: boolean;
  predefined?: boolean;

  // contadores / relación
  cards_count?: number;
  cards?: DeckCard[];
};

/**
 * Respuesta esperada para Mazos.
 * Si tu API devuelve un array directamente, luego lo ajustamos.
 */
export type DecksData = {
  decks: Deck[];
};