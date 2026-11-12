import { NextRequest } from "next/server";
import { proxyAccount } from "../../../../lib/server";
export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyAccount(request, "/" + (await context.params).path.join("/"));
}
export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyAccount(request, "/" + (await context.params).path.join("/"));
}
