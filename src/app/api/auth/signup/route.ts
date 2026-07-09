import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { createTestUser } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { signupSchema } from "@/lib/validation";
import BusinessProfile from "@/models/BusinessProfile";
import ArtistProfile from "@/models/ArtistProfile";
import User from "@/models/User";

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (isTestDataEnabled()) {
    const user = createTestUser(parsed.data);
    if (!user) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({ role: user.role });
  }

  await connectToDatabase();
  const existing = await User.findOne({ email: parsed.data.email });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const password = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({ ...parsed.data, password });

  // Create starter profiles so dashboards work immediately after signup.
  if (user.role === "artist") {
    await ArtistProfile.create({
      userId: user._id,
      displayName: user.name,
      bio: "Tell businesses what makes your art practice distinctive.",
      location: "Add your location",
      styles: ["Contemporary"],
      services: ["Custom artwork"],
      startingPrice: 500,
      portfolioImages: []
    });
  } else {
    await BusinessProfile.create({
      userId: user._id,
      businessName: user.name,
      industry: "Hospitality",
      location: "Add your location"
    });
  }

  await createSession({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  });

  return NextResponse.json({ role: user.role });
}
