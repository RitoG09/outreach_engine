import { z } from "zod";

export const HunterEmailFinderResponseSchema = z.object({
  data: z.object({
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    score: z.number().nullable().optional(),
    domain: z.string().nullable().optional(),
    accept_all: z.boolean().nullable().optional(),
    position: z.string().nullable().optional(),
    twitter: z.string().nullable().optional(),
    linkedin_url: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    sources: z.array(
      z.object({
        domain: z.string().nullable().optional(),
        uri: z.string().nullable().optional(),
        extracted_on: z.string().nullable().optional(),
        last_seen_on: z.string().nullable().optional(),
        still_on_page: z.boolean().nullable().optional(),
      })
    ).optional(),
    verification: z.object({
      date: z.string().nullable().optional(),
      status: z.string().nullable().optional(),
    }).nullable().optional(),
  }).nullable().optional(),
  meta: z.object({
    params: z.object({
      first_name: z.string().nullable().optional(),
      last_name: z.string().nullable().optional(),
      full_name: z.string().nullable().optional(),
      domain: z.string().nullable().optional(),
      company: z.string().nullable().optional(),
      max_duration: z.number().nullable().optional(),
    }).optional(),
  }).optional(),
});

export type HunterEmailFinderResponse = z.infer<typeof HunterEmailFinderResponseSchema>;
