import { headers } from "next/headers";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { getOrCreateUser, isAdminUserId } from "@/lib/auth/user";
import { isDatabaseConfigured } from "@video-lib/database";
import { eq } from "drizzle-orm";
import { getDb, users } from "@video-lib/database";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return new Response("Database not configured", { status: 503 });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook secret not configured", { status: 503 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await request.text();
  const wh = new Webhook(secret);

  let event: WebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses[0]?.email_address ?? "";
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    await getOrCreateUser({ id, email, name });

    if (isAdminUserId(id)) {
      const db = getDb();
      await db
        .update(users)
        .set({ role: "admin", updatedAt: new Date() })
        .where(eq(users.id, id));
    }
  }

  if (event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses[0]?.email_address ?? "";
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;
    const db = getDb();

    await db
      .update(users)
      .set({
        email,
        name,
        role: isAdminUserId(id) ? "admin" : "user",
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  return new Response("OK", { status: 200 });
}
