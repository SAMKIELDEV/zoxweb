import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentStatus } from "@/components/billing/PaymentStatus";
import { TRANSACTION_ID } from "@/lib/paths";

export const metadata: Metadata = { title: "Purchase" };

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * The page payment providers send people back to. The backend builds
 * this exact path into the return URL, so it must not move.
 */
export default async function PaymentStatusPage({ params, searchParams }: PageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!TRANSACTION_ID.test(id)) notFound();

  // Only "cancelled" is read, and only to soften the wording. Any other
  // parameter, such as a claimed status, is ignored.
  return <PaymentStatus id={id} cancelled={query.cancelled === "1"} />;
}
