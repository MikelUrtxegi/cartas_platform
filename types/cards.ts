export type CardItem = {
  id: number | string;
  title: string;
  description?: string | null;
  category?: string | null;
  created_at?: string | null;
};

export type CardsListResponse = CardItem[];
export type CardsPaginatedResponse = { results: CardItem[] };
export type CardsDataResponse = { data: CardItem[] };
export type CardsNamedResponse = { cards: CardItem[] };

export type CardsData =
  | CardsListResponse
  | CardsPaginatedResponse
  | CardsDataResponse
  | CardsNamedResponse;

/** ---------- Type guards (sin any) ---------- */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCardId(value: unknown): value is number | string {
  return typeof value === "number" || typeof value === "string";
}

export function isCardItem(value: unknown): value is CardItem {
  if (!isObject(value)) return false;

  const id = value.id;
  const title = value.title;

  if (!isCardId(id)) return false;
  if (typeof title !== "string") return false;

  const description = value.description;
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  )
    return false;

  const category = value.category;
  if (category !== undefined && category !== null && typeof category !== "string")
    return false;

  const created_at = value.created_at;
  if (
    created_at !== undefined &&
    created_at !== null &&
    typeof created_at !== "string"
  )
    return false;

  return true;
}

export function isCardsListResponse(value: unknown): value is CardsListResponse {
  return Array.isArray(value) && value.every(isCardItem);
}

export function isCardsPaginatedResponse(
  value: unknown,
): value is CardsPaginatedResponse {
  if (!isObject(value)) return false;
  const results = value.results;
  return Array.isArray(results) && results.every(isCardItem);
}

export function isCardsDataResponse(value: unknown): value is CardsDataResponse {
  if (!isObject(value)) return false;
  const data = value.data;
  return Array.isArray(data) && data.every(isCardItem);
}

export function isCardsNamedResponse(value: unknown): value is CardsNamedResponse {
  if (!isObject(value)) return false;
  const cards = value.cards;
  return Array.isArray(cards) && cards.every(isCardItem);
}

export function isCardsData(value: unknown): value is CardsData {
  return (
    isCardsListResponse(value) ||
    isCardsPaginatedResponse(value) ||
    isCardsDataResponse(value) ||
    isCardsNamedResponse(value)
  );
}

export function extractCards(data: CardsData): CardItem[] {
  if (Array.isArray(data)) return data;
  if ("results" in data) return data.results;
  if ("data" in data) return data.data;
  return data.cards;
}