import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { deleteTestProject, getTestBusinessProjectById, updateTestProject, updateTestProjectStatus } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { projectSchema } from "@/lib/validation";
import BusinessProfile from "@/models/BusinessProfile";
import Project from "@/models/Project";
import ProjectRequest from "@/models/ProjectRequest";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  if (isTestDataEnabled()) {
    const project = getTestBusinessProjectById(user.id, id);
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    return NextResponse.json({ project });
  }

  await connectToDatabase();
  const business = await BusinessProfile.findOne({ userId: user.id });
  const project = await Project.findOne({ _id: id, businessId: business?._id }).lean();
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const payload = await request.json();
  const statusCandidate = payload?.status;
  const isStatusOnlyUpdate = statusCandidate === "open" || statusCandidate === "closed";

  const { id } = await params;
  if (isStatusOnlyUpdate) {
    if (isTestDataEnabled()) {
      const updated = updateTestProjectStatus(user.id, id, statusCandidate);
      if (!updated) return NextResponse.json({ error: "Project not found." }, { status: 404 });
      return NextResponse.json({ project: updated });
    }

    await connectToDatabase();
    const business = await BusinessProfile.findOne({ userId: user.id });
    const existing = await Project.findOne({ _id: id, businessId: business?._id });
    if (!existing) return NextResponse.json({ error: "Project not found." }, { status: 404 });

    existing.status = statusCandidate;
    await existing.save();
    return NextResponse.json({ project: existing });
  }

  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (isTestDataEnabled()) {
    const updated = updateTestProject(user.id, id, parsed.data);
    if (!updated) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    return NextResponse.json({ project: updated });
  }

  await connectToDatabase();
  const business = await BusinessProfile.findOne({ userId: user.id });
  const existing = await Project.findOne({ _id: id, businessId: business?._id });
  if (!existing) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  Object.assign(existing, parsed.data);
  await existing.save();
  return NextResponse.json({ project: existing });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("business");
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  if (isTestDataEnabled()) {
    const removed = deleteTestProject(user.id, id);
    if (!removed) return NextResponse.json({ error: "Project not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  await connectToDatabase();
  const business = await BusinessProfile.findOne({ userId: user.id });
  const existing = await Project.findOne({ _id: id, businessId: business?._id });
  if (!existing) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  await ProjectRequest.deleteMany({ projectId: existing._id });
  await existing.deleteOne();
  return NextResponse.json({ ok: true });
}