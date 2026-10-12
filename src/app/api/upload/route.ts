import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { maxProjectReferenceBytes, projectReferenceMimeTypes } from "@/lib/validation";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const formData = await request.formData();
  const projectReference = formData.get("purpose") === "project-reference";
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a valid image file." }, { status: 400 });
  }
  if (projectReference && (!projectReferenceMimeTypes.includes(file.type) || file.size === 0 || file.size > maxProjectReferenceBytes)) {
    return NextResponse.json({ error: "Use JPG, PNG, WebP, GIF, or PDF reference files up to 10 MB each. Empty files are not accepted." }, { status: 400 });
  }
  if (projectReference && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)) {
    return NextResponse.json({ error: "Reference uploads are unavailable until Cloudinary is configured." }, { status: 503 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Cloudinary accepts a base64 data URI, keeping this route server-only and credential-safe.
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "stroque-art-portal",
      resource_type: projectReference ? "auto" : "image"
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed.", error);
    return NextResponse.json({ error: "Could not upload the file. Please try again." }, { status: 502 });
  }
}
