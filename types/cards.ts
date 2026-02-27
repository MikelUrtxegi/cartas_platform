export type CardItem = {
  id: number | string;
  title?: string;
  name?: string;
  description?: string | null;
};

export type CardsData = {
  cards: CardItem[];
};