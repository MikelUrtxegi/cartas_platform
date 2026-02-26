import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    access?: string;
    refresh?: string;
    error?: "RefreshAccessTokenError";
  }


  interface User {
    access: string;
    refresh: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access?: string;
    refresh?: string;
  }
}