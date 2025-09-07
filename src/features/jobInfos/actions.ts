"use server";

import { jobInfoSchema } from "./schemas";
import { z } from "zod";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { insertJobInfo, updateJobInfo as updateJobInfoDb } from "./db";
import { redirect } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobInfoIdTag } from "./dbCache";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function createJobInfo(unsafeData: z.infer<typeof jobInfoSchema>) {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to create a job info",
    };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Invalid data",
    };
  }

  const jobInfo = await insertJobInfo({ ...data, userId });

  redirect(`/app/job-infos/${jobInfo.id}`);
}

export async function updateJobInfo(
  id: string,
  unsafeData: z.infer<typeof jobInfoSchema>
) {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to update a job info",
    };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Invalid data",
    };
  }

  const existingJobInfo = await getJobInfo(id, userId);

  if (existingJobInfo == null) {
    return {
      error: true,
      message: "You don't have permission to update this job info",
    };
  }
  const jobInfo = await updateJobInfoDb(id, data);

  redirect(`/app/job-infos/${jobInfo.id}`);
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
