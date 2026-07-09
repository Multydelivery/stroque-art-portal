import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestBusinessRequests } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import BusinessProfile from "@/models/BusinessProfile";
import ProjectRequest from "@/models/ProjectRequest";

void ArtistProfile;

export async function GET() {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (isTestDataEnabled()) {
    return NextResponse.json({ requests: getTestBusinessRequests(user.id) });
  }

  await connectToDatabase();
  const business = await BusinessProfile.findOne({ userId: user.id });
  if (!business) return NextResponse.json({ requests: [] });

  const requests = await ProjectRequest.find({ businessId: business._id })
    .populate("artistId")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ requests });
}
