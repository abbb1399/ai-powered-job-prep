import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { JobInfoTable } from "./jobInfo";
import { createdAt, id, updatedAt } from "@/drizzle/schemaHelpers";
import { relations } from "drizzle-orm";

export const InterviewTable = pgTable("interviews", {
  id,
  jobInfoId: uuid()
    .references(() => JobInfoTable.id, { onDelete: "cascade" })
    .notNull(),
  duration: varchar().notNull(),
  humeChatId: varchar(),
  feedback: varchar(),
  createdAt,
  updatedAt,
});

export const interviewRelations = relations(InterviewTable, ({ one }) => ({
  jobInfo: one(JobInfoTable, {
    fields: [InterviewTable.jobInfoId],
    references: [JobInfoTable.id],
  }),
}));
