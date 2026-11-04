import { z } from "zod";

export const userContextSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  tenantId: z.string(),
  tenantName: z.string().optional(),
  accessGroup: z.string().optional().nullable(),
  permissions: z.record(z.string(), z.array(z.string())).default({}),
});

export type UserContextData = z.infer<typeof userContextSchema>;
