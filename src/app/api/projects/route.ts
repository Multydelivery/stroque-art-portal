import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { createTestProject, getTestBusinessProjects } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { projectSchema } from "@/lib/validation";
import BusinessProfile from "@/models/BusinessProfile";
import Project from "@/models/Project";

export async function GET() {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (isTestDataEnabled()) {
    return NextResponse.json({ projects: getTestBusinessProjects(user.id) });
  }

  await connectToDatabase();
  const business = await BusinessProfile.findOne({ userId: user.id });
  if (!business) return NextResponse.json({ projects: [] });

  const projects = await Project.find({ businessId: business._id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Only businesses can create projects." }, { status: 401 });

  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (isTestDataEnabled()) {
    const created = createTestProject(user.id, parsed.data);
    if (!created) {
      return NextResponse.json({ error: "Create your business profile first." }, { status: 400 });
    }

    return NextResponse.json({ project: created }, { status: 201 });
  }

  await connectToDatabase();
  const business = await BusinessProfile.findOne({ userId: user.id });
  if (!business) {
    return NextResponse.json({ error: "Create your business profile first." }, { status: 400 });
  }

  const created = await Project.create({
    ...parsed.data,
    businessId: business._id,
    status: "open"
  });

  return NextResponse.json({ project: created }, { status: 201 });
}