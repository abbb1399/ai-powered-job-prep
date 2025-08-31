import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { getUserIdTag } from "../../../features/users/dbCache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, redirectToSignIn } = await auth();

  return {
    userId,
    redirectToSignIn,
    user: allData && userId != null ? await getUser(userId) : undefined,
  };
}

async function getUser(userId: string) {
  "use cache";
  cacheTag(getUserIdTag(userId));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });
}
