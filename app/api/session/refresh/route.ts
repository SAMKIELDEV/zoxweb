import type { NextRequest } from "next/server";
import { renewSession } from "@/lib/server";

/**
 * Renews the session when the 15-minute access token has run out. The
 * browser calls this after a 401 and then repeats what it was doing
 * (lib/api/client.ts).
 */
export const POST = (request: NextRequest) => renewSession(request);
