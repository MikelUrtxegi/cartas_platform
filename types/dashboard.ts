// types/dashboard.ts
export type DashboardStats = {
  activeSessions: number;
  totalGroups: number;
  ratedCards: number;
};

export type DashboardSession = {
  id: string;
  name: string;
  status: "En curso" | "Borrador" | "Canvas" | "Cerrada";
  company: string;
  groups: number;
  tags: string[];
  progress: number; // 0-100
};

export type DashboardData = {
  stats: DashboardStats;
  sessions: DashboardSession[];
};