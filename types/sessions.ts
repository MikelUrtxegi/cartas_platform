export type SessionItem = {
  id: number | string;

  // nombres típicos
  title?: string;
  name?: string;

  company?: string;
  status?: string; // "in_progress" | "closed" | etc
  phase?: string;  // "rating" | "canvas" | etc

  created_at?: string;
  updated_at?: string;
};

/**
 * Respuesta esperada para Sesiones.
 */
export type SessionsData = {
  sessions: SessionItem[];
};