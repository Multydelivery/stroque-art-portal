import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { findTestUserByEmail } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import { loginSchema } from "@/lib/validation";
import User from "@/models/User";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (isTestDataEnabled()) {
    const user = findTestUserByEmail(parsed.data.email);
    if (!user || user.password !== parsed.data.password) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
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
  const user = await User.findOne({ email: parsed.data.email });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const matches = await bcrypt.compare(parsed.data.password, user.password);
  if (!matches) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  });

  return NextResponse.json({ role: user.role });
}
