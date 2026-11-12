import { redirect } from "next/navigation";

/** The old URL for this page. Kept so existing links and bookmarks still land. */
export default function AccountRedirect() {
  redirect("/dashboard/settings");
}
