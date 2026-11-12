import { PageEnter } from "@/components/shell/PageEnter";

/** A template remounts on each navigation, so the enter motion plays per page. */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
