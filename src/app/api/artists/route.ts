import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTestArtists } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const style = searchParams.get("style");
  const location = searchParams.get("location");
  const service = searchParams.get("service");
  const maxBudget = searchParams.get("maxBudget");

  if (isTestDataEnabled()) {
    const artists = getTestArtists({
      q: q ?? undefined,
      style: style ?? undefined,
      location: location ?? undefined,
      service: service ?? undefined,
      maxBudget: maxBudget ?? undefined
    });
    return NextResponse.json({ artists });
  }

  await connectToDatabase();
  const filters: Record<string, unknown> = {};
  if (q) filters.$text = { $search: q };
  if (style) filters.styles = style;
  if (location) filters.location = new RegExp(location, "i");
  if (service) filters.services = service;
  if (maxBudget) filters.startingPrice = { $lte: Number(maxBudget) };

  const artists = await ArtistProfile.find(filters).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ artists });
}
