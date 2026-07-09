import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtistRequests } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import BusinessProfile from "@/models/BusinessProfile";
import ProjectRequest from "@/models/ProjectRequest";

void BusinessProfile;

export async function GET() {
  const user = await requireUser("artist");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (isTestDataEnabled()) {
    return NextResponse.json({ requests: getTestArtistRequests(user.id) });
  }

  await connectToDatabase();
  const artist = await ArtistProfile.findOne({ userId: user.id });
  if (!artist) return NextResponse.json({ requests: [] });

  const requests = await ProjectRequest.find({ artistId: artist._id })
    .populate("businessId")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ requests });
}
