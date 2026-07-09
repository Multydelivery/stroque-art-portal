import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestBusinessProfile, upsertTestBusinessProfile } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { businessProfileSchema } from "@/lib/validation";
import BusinessProfile from "@/models/BusinessProfile";

export async function GET() {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (isTestDataEnabled()) {
    return NextResponse.json({ profile: getTestBusinessProfile(user.id) });
  }

  await connectToDatabase();
  const profile = await BusinessProfile.findOne({ userId: user.id }).lean();
  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const parsed = businessProfileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (isTestDataEnabled()) {
    const profile = upsertTestBusinessProfile(user.id, parsed.data);
    return NextResponse.json({ profile });
  }

  await connectToDatabase();
  const profile = await BusinessProfile.findOneAndUpdate(
    { userId: user.id },
    { ...parsed.data, userId: user.id },
    { new: true, upsert: true }
  );

  return NextResponse.json({ profile });
}
