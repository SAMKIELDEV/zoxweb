import { CONTACT_PHONE, DISPUTES_EMAIL, OPERATOR, REGISTERED_ADDRESS, SUPPORT_EMAIL, WHATSAPP_URL } from "@/lib/contact";

type Line = "support" | "disputes" | "phone" | "address" | "whatsapp";

/**
 * Whether any of `lines` has a configured value. Lets a page drop the
 * sentence that introduces the list when there would be nothing under it.
 */
export function hasContactLines(lines: readonly Line[]): boolean {
  const values: Record<Line, unknown> = {
    support: SUPPORT_EMAIL,
    disputes: DISPUTES_EMAIL,
    phone: CONTACT_PHONE,
    address: REGISTERED_ADDRESS,
    whatsapp: WHATSAPP_URL,
  };
  return lines.some((line) => values[line]);
}

/**
 * The ways to reach us, as a plain list for text pages (styled by Prose).
 * Each line comes from an environment value; an unset one is left out, and
 * with none set nothing renders at all.
 */
export function ContactLines({ lines }: { lines: readonly Line[] }) {
  if (!hasContactLines(lines)) return null;
  return (
    <ul>
      {lines.map((line) => {
        switch (line) {
          case "support":
            return SUPPORT_EMAIL ? (
              <li key={line}>
                Support: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              </li>
            ) : null;
          case "disputes":
            return DISPUTES_EMAIL ? (
              <li key={line}>
                Disputes: <a href={`mailto:${DISPUTES_EMAIL}`}>{DISPUTES_EMAIL}</a>
              </li>
            ) : null;
          case "phone":
            return CONTACT_PHONE ? (
              <li key={line}>
                Phone: <a href={CONTACT_PHONE.href}>{CONTACT_PHONE.display}</a>
              </li>
            ) : null;
          case "address":
            return REGISTERED_ADDRESS ? (
              <li key={line}>
                Post: {OPERATOR.name}, {REGISTERED_ADDRESS}
              </li>
            ) : null;
          case "whatsapp":
            return WHATSAPP_URL ? (
              <li key={line}>
                WhatsApp: <a href={WHATSAPP_URL}>message Zox</a>
              </li>
            ) : null;
        }
      })}
    </ul>
  );
}
