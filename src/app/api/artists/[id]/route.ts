import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getTestArtist } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (isTestDataEnabled()) {
    const artist = getTestArtist(id);
    if (!artist) {
      return NextResponse.json({ error: "Artist not found." }, { status: 404 });
    }

    return NextResponse.json({ artist });
  }

  await connectToDatabase();
  const artist = await ArtistProfile.findById(id).lean();
  if (!artist) {
    return NextResponse.json({ error: "Artist not found." }, { status: 404 });
  }

  return NextResponse.json({ artist });
}
