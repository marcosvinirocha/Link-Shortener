import { z } from "zod";

export const createLinkSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

export type CreateLinkDTO = z.infer<typeof createLinkSchema>;
