import type { z } from "zod";
import type { projectDraftSchema } from "@/lib/validation";

export function projectDraftDetails(values: z.infer<typeof projectDraftSchema>) {
  return { ...values, budgetMin: values.budget, budgetMax: values.budget };
}
