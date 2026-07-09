import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtistProfile, upsertTestArtistProfile } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { artistProfileSchema } from "@/lib/validation";
import ArtistProfile from "@/models/ArtistProfile";

export async function GET() {
  const user = await requireUser("artist");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (isTestDataEnabled()) {
    return NextResponse.json({ profile: getTestArtistProfile(user.id) });
  }

  await connectToDatabase();
  const profile = await ArtistProfile.findOne({ userId: user.id }).lean();
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  return upsertProfile(request);
}

export async function PUT(request: Request) {
  return upsertProfile(request);
}

async function upsertProfile(request: Request) {
  const user = await requireUser("artist");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const parsed = artistProfileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (isTestDataEnabled()) {
    const profile = upsertTestArtistProfile(user.id, parsed.data);
    return NextResponse.json({ profile });
  }

  await connectToDatabase();
  const profile = await ArtistProfile.findOneAndUpdate(
    { userId: user.id },
    { ...parsed.data, userId: user.id },
    { new: true, upsert: true }
  );

  return NextResponse.json({ profile });
}
