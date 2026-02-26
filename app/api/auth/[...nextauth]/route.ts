import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

interface CorpAuthResponse {
  refresh: string;
  access: string;
  user?: {
    id?: number | string;
    email?: string;
    name?: string;
  };
}

/**
 * Extensión tipada del JWT interno
 */
interface ExtendedToken extends JWT {
  access?: string;
  refresh?: string;
  accessExpires?: number;
  error?: "RefreshAccessTokenError";
}

/**
 * Helpers
 */

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  return base;
}

function decodeJwtExpMs(accessToken: string): number | null {
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const parsed = JSON.parse(json) as { exp?: number };

    if (!parsed.exp) return null;

    return parsed.exp * 1000;
  } catch {
    return null;
  }
}

async function refreshAccessToken(
  token: ExtendedToken,
): Promise<ExtendedToken> {
  try {
    if (!token.refresh) {
      throw new Error("Missing refresh token");
    }

    const refreshUrl = `${getApiBaseUrl()}/api/auth/token/refresh/`;
    // ⚠️ Si tu endpoint es distinto, cámbialo aquí

    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refresh }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.access) {
      throw new Error("Refresh failed");
    }

    const newAccess: string = data.access;
    const newRefresh: string | undefined = data.refresh;

    const expMs = decodeJwtExpMs(newAccess);
    const accessExpires = expMs
      ? expMs - 30_000 // margen 30s
      : Date.now() + 5 * 60_000;

    return {
      ...token,
      access: newAccess,
      refresh: newRefresh ?? token.refresh,
      accessExpires,
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 * NextAuth config
 */

export const authOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(
          `${getApiBaseUrl()}/api/corp-auth/login/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        const data: CorpAuthResponse | null = await res
          .json()
          .catch(() => null);

        if (!res.ok || !data?.access || !data?.refresh) return null;

        return {
          id: data.user?.id?.toString() ?? credentials.email,
          email: data.user?.email ?? credentials.email,
          name: data.user?.name ?? "Admin",
          access: data.access,
          refresh: data.refresh,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const extendedToken = token as ExtendedToken;

      // Primer login
      if (user) {
        const access = (user as { access: string }).access;
        const refresh = (user as { refresh: string }).refresh;

        const expMs = decodeJwtExpMs(access);

        return {
          ...extendedToken,
          access,
          refresh,
          accessExpires: expMs ? expMs - 30_000 : Date.now() + 5 * 60_000,
          error: undefined,
        };
      }

      // Si no ha expirado
      if (
        extendedToken.access &&
        extendedToken.accessExpires &&
        Date.now() < extendedToken.accessExpires
      ) {
        return extendedToken;
      }

      // Si expiró → refresh
      return refreshAccessToken(extendedToken);
    },

    async session({ session, token }) {
      const extendedToken = token as ExtendedToken;

      return {
        ...session,
        access: extendedToken.access,
        refresh: extendedToken.refresh,
        error: extendedToken.error,
      };
    },
  },

  pages: { signIn: "/auth/login" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };