// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  // Protect all dashboard routes
  // This will redirect unauthenticated users to the sign-in page
  matcher: ["/dashboard/:path*"],
};
