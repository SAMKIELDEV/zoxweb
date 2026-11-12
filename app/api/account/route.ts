import { NextRequest } from "next/server";
import { proxyAccount } from "../../../lib/server";
export const GET = (request: NextRequest) => proxyAccount(request);
