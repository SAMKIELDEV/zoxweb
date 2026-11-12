import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { hasSessionCookie } from "@/lib/session";

/**
 * Guard for every signed-in page. This only checks that SAMKIEL ID's
 * cookies are present, which keeps signed-out visitors from seeing the
 * shell. Whether the session is still good is decided by the API: a 401
 * there that cannot be renewed sends the browser to /login
 * (lib/api/client.ts).
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!hasSessionCookie(await cookies())) redirect("/login");

  return <AppShell>{children}</AppShell>;
}
