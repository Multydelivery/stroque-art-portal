import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { connectToDatabase } from "@/lib/db";
import { findTestUserById } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import User from "@/models/User";

const cookieName = "stroque_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "artist" | "business";
};

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionUser;
  } catch {
    return null;
  }
}

export async function requireUser(role?: SessionUser["role"]) {
  const session = await getSessionUser();
  if (!session || (role && session.role !== role)) return null;

  if (isTestDataEnabled()) {
    return findTestUserById(session.id) ? session : null;
  }

  await connectToDatabase();
  const user = await User.findById(session.id).select("_id name email role").lean();
  if (!user) return null;

  return session;
}
