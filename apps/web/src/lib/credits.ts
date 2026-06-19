import { eq } from "drizzle-orm";
import {
  creditTransactions,
  getDb,
  users,
  type User,
} from "@video-lib/database";

export const CREDIT_COSTS = {
  "720p": 1,
  "1080p": 2,
} as const;

export type ExportResolution = keyof typeof CREDIT_COSTS;

export function getExportCreditCost(resolution: ExportResolution) {
  return CREDIT_COSTS[resolution];
}

export async function getUserCredits(userId: string) {
  const db = getDb();
  const rows = await db
    .select({ credits: users.credits, plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0]?.credits ?? 0;
}

export async function canAffordExport(user: User, resolution: ExportResolution) {
  if (user.plan === "pro") {
    return true;
  }
  const cost = getExportCreditCost(resolution);
  return user.credits >= cost;
}

export async function deductCredits(input: {
  userId: string;
  amount: number;
  reason: string;
  exportId?: string;
}) {
  const db = getDb();

  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, input.userId))
    .limit(1);
  const user = userRows[0];

  if (!user) {
    throw new Error("User not found");
  }

  if (user.plan === "pro") {
    await db.insert(creditTransactions).values({
      userId: input.userId,
      amount: 0,
      reason: `${input.reason} (pro unlimited)`,
      exportId: input.exportId,
    });
    return user.credits;
  }

  if (user.credits < input.amount) {
    throw new Error("Insufficient credits");
  }

  const nextCredits = user.credits - input.amount;

  await db
    .update(users)
    .set({ credits: nextCredits, updatedAt: new Date() })
    .where(eq(users.id, input.userId));

  await db.insert(creditTransactions).values({
    userId: input.userId,
    amount: -input.amount,
    reason: input.reason,
    exportId: input.exportId,
  });

  return nextCredits;
}

export async function addCredits(input: {
  userId: string;
  amount: number;
  reason: string;
}) {
  const db = getDb();
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, input.userId))
    .limit(1);
  const user = userRows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const nextCredits = user.credits + input.amount;

  await db
    .update(users)
    .set({ credits: nextCredits, updatedAt: new Date() })
    .where(eq(users.id, input.userId));

  await db.insert(creditTransactions).values({
    userId: input.userId,
    amount: input.amount,
    reason: input.reason,
  });

  return nextCredits;
}
