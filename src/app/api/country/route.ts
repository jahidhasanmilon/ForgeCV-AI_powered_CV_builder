import { NextRequest, NextResponse } from "next/server";
import { lookupCountry } from "@/lib/countryApi";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "code query param is required" }, { status: 400 });
  }
  const info = await lookupCountry(code);
  if (!info) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }
  return NextResponse.json(info);
}
