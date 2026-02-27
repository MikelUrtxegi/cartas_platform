export type ResultCard = {
  id: number | string;
  title: string;

  // % o score
  score?: number;
};

export type Quadrant = {
  key: string;   // ej: "now_ready"
  title: string; // ej: "Ahora · Preparados"
  items: ResultCard[];
};

export type ResultsData = {
  total_sessions?: number;
  total_votes?: number;
  quadrants?: Quadrant[];
};