import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { createTestProjectRequest } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { projectRequestSchema } from "@/lib/validation";
import BusinessProfile from "@/models/BusinessProfile";
import ProjectRequest from "@/models/ProjectRequest";

export async function POST(request: Request) {
  const demoMode = isTestDataEnabled();
  const user = await requireUser("business");
  if (!user && !demoMode) return NextResponse.json({ error: "Only businesses can send requests." }, { status: 401 });

  const parsed = projectRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (demoMode) {
    const created = createTestProjectRequest(user?.id ?? "test-user-business", parsed.data);
    if (!created) {
      return NextResponse.json({ error: "Create your business profile first." }, { status: 400 });
    }

    return NextResponse.json({ request: created }, { status: 201 });
  }

  if (!user) return NextResponse.json({ error: "Only businesses can send requests." }, { status: 401 });

  await connectToDatabase();
  const business = await BusinessProfile.findOne({ userId: user.id });
  if (!business) {
    return NextResponse.json({ error: "Create your business profile first." }, { status: 400 });
  }

  const created = await ProjectRequest.create({
    ...parsed.data,
    businessId: business._id
  });

  return NextResponse.json({ request: created }, { status: 201 });
}
