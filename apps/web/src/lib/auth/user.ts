import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  getDb,
  isDatabaseConfigured,
  users,
  type User,
  type UserPlan,
} from "@video-lib/database";
import { isClerkConfigured, isAuthEnabled } from "@/lib/auth/clerk-config";

const SIGNUP_CREDITS = 20;

export function getAdminUserIds(): string[] {
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function isAdminUserId(userId: string) {
  return getAdminUserIds().includes(userId);
}

export async function requireAuthUserId() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getCurrentDbUser(): Promise<User | null> {
  if (!isAuthEnabled() || !isDatabaseConfigured() || !isClerkConfigured()) {
    return null;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  return getOrCreateUser({
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
    name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
  });
}

export async function getOrCreateUser(input: {
  id: string;
  email: string;
  name?: string | null;
}): Promise<User> {
  const db = getDb();
  const existingRows = await db
    .select()
    .from(users)
    .where(eq(users.id, input.id))
    .limit(1);
  const existing = existingRows[0];

  if (existing) {
    return existing;
  }

  const role = isAdminUserId(input.id) ? "admin" : "user";

  const [created] = await db
    .insert(users)
    .values({
      id: input.id,
      email: input.email,
      name: input.name ?? null,
      credits: SIGNUP_CREDITS,
      plan: "free",
      role,
    })
    .returning();

  return created;
}

export async function requireDbUser() {
  const user = await getCurrentDbUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdminUser() {
  const user = await requireDbUser();
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}

export function hasProAccess(user: User) {
  return user.plan === "pro" || user.plan === "creator";
}

export function hasUnlimitedExports(user: User) {
  return user.plan === "pro";
}

export function canExportResolution(user: User, resolution: "720p" | "1080p") {
  if (resolution === "720p") return true;
  return hasProAccess(user);
}

export function canExportProTemplate(user: User, isProTemplate: boolean) {
  if (!isProTemplate) return true;
  return hasProAccess(user);
}

export async function updateUserPlan(
  userId: string,
  plan: UserPlan,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string | null
) {
  const db = getDb();
  await db
    .update(users)
    .set({
      plan,
      stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId ?? null,
      updatedAt: new Date(),
      ...(plan === "creator" ? { credits: 100 } : {}),
    })
    .where(eq(users.id, userId));
}
