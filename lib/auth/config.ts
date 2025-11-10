export const authConfig = {
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: true
      }
    }
  }
};
