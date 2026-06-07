import { z } from "zod";

export const SearchPersonSchema = z.object({
  error: z.boolean(),
  results: z.array(
    z.object({
      person: z.object({
        person_id: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        full_name: z.string(),
        linkedin_url: z.string().nullable(),
        current_job_title: z.string().nullable(),
      }),
      company: z
        .object({
          name: z.string(),
          domain: z.string(),
        })
        .nullable(),
    }),
  ),
});
