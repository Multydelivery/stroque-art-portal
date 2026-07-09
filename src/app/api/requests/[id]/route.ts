import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { updateTestRequestStatus } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { requestStatusSchema } from "@/lib/validation";
import ArtistProfile from "@/models/ArtistProfile";
import ProjectRequest from "@/models/ProjectRequest";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("artist");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const parsed = requestStatusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  if (isTestDataEnabled()) {
    const updated = updateTestRequestStatus(user.id, id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    return NextResponse.json({ request: updated });
  }

  await connectToDatabase();
  const artist = await ArtistProfile.findOne({ userId: user.id });
  const existing = await ProjectRequest.findById(id);

  if (!artist || !existing || existing.artistId.toString() !== artist._id.toString()) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  existing.status = parsed.data.status;
  await existing.save();

  return NextResponse.json({ request: existing });
}
