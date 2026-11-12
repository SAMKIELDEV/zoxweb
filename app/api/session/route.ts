import type { NextRequest } from "next/server";
import { endSession } from "@/lib/server";

/**
 * Sign out. There is no sign-in here: that happens at accounts.samkiel.tech,
 * and SAMKIEL ID sets the session cookies itself (lib/session.ts).
 */
export const DELETE = (request: NextRequest) => endSession(request);
