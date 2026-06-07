import { z } from "zod";

export const OceanResponseSchema = z.object({
  total: z.number().optional(),
  creditsUsed: z.number().optional(),
  searchAfter: z.string().optional(),
  companies: z.array(
    z.object({
      relevance: z.enum(["A", "B", "C"]),
      company: z.object({
        domain: z.string(),
        name: z.string(),
        primaryCountry: z.string().optional(),
        companySize: z.string().optional(),
        description: z.string().optional(),
      }),
    }),
  ),
});

export type OceanResponse = z.infer<typeof OceanResponseSchema>;
