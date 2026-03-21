import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 },
      );
    }

    const lastRequest = rateLimitMap.get(address);
    if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MS) {
      const waitMin = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastRequest)) / 60_000);
      return NextResponse.json(
        { error: `Please wait ${waitMin} minute${waitMin > 1 ? "s" : ""} before requesting again` },
        { status: 429 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
    const hash = `mock-faucet-${Math.random().toString(16).slice(2, 14)}`;

    rateLimitMap.set(address, Date.now());
    return NextResponse.json({ success: true, hash });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Faucet request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
