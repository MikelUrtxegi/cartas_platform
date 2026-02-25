// types/dashboard.ts
export type DashboardCompany = {
  id: number;
  sector: string | null;
  created_at: string | null; // ISO string
};

export type DashboardSession = {
  id: number;
  company: DashboardCompany;
  status: "draft" | "active" | "finished" | string;
  groups: number;
  votes: number;
};

export type DashboardStats = {
  activeSessions: number;
  totalGroups: number;
  ratedCards: number;
};

export type DashboardData = {
  stats: DashboardStats;
  sessions: DashboardSession[];
};