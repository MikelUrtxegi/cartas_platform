import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface CorpAuthResponse {
  refresh: string;
  access: string;
  user?: {
    id?: number | string;
    email?: string;
    name?: string;
  };
}
const handler = NextAuth({
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
    console.log("[AUTH] authorize credentials:", credentials);

    if (!credentials?.email || !credentials?.password) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/corp-auth/login/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }
    );

    // Intenta parsear respuesta
    const data = await res.json().catch(() => null);
    console.log("[AUTH] backend status:", res.status, "data:", data);

    if (!res.ok) return null;

    // DEVUELVE UN USER con id (obligatorio/recomendado)
    // Ajusta según lo que devuelva tu backend
    return {
      id: data?.user?.id?.toString?.() ?? credentials.email, // algo estable
      email: data?.user?.email ?? credentials.email,
      name: data?.user?.name ?? "Admin",
      access: data?.access ?? data?.token ?? null,
      refresh: data?.refresh ?? null,
    };
  },
}),
  ],

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.access = user.access;
      token.refresh = user.refresh;
    }
    return token;
  },
  async session({ session, token }) {
    session.access = token.access;
    session.refresh = token.refresh;
    return session;
  },
},
pages: { signIn: "/auth/login" },
});

export { handler as GET, handler as POST };