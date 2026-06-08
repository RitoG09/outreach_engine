import { hunterClient } from "../clients/hunter.client.js";
import { HunterEmailFinderResponseSchema } from "../schemas/hunter.schema.js";
import { retry } from "../utils/retry.js";
import type { Contact, Lead } from "../types/contact.types.js";
import { logger } from "../utils/logger.js";
import axios from "axios";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function extractLinkedinHandle(url: string): string | null {
  try {
    const cleanUrl = url.trim().split("?")[0] ?? "";
    const match = cleanUrl.match(/\/in\/([^\/]+)/);
    return match && match[1] ? match[1] : null;
  } catch (e) {
    return null;
  }
}

export class HunterService {
  async enrichContacts(contacts: Contact[]): Promise<Lead[]> {
    if (contacts.length === 0) return [];

    logger.info(`Enriching ${contacts.length} contacts via sequential Hunter.io Email Finder API`);

    const leads: Lead[] = [];
    let index = 1;

    for (const contact of contacts) {
      logger.info(`Processing contact ${index}/${contacts.length}: ${contact.fullName}`);
      try {
        const handle = extractLinkedinHandle(contact.linkedinUrl);
        if (!handle) {
          logger.warn(`Skipping contact ${contact.fullName} because no valid LinkedIn handle could be extracted from: ${contact.linkedinUrl}`);
          index++;
          continue;
        }

        const res = await retry(async () => {
          return hunterClient.get("/email-finder", {
            params: {
              first_name: contact.firstName,
              last_name: contact.lastName,
              linkedin_handle: handle,
            },
          });
        });

        const parsed = HunterEmailFinderResponseSchema.parse(res.data);
        if (parsed.data && parsed.data.email) {
          leads.push({
            ...contact,
            email: parsed.data.email,
            emailStatus: parsed.data.verification?.status ?? "unknown",
          });
          logger.log("success", `Found email for ${contact.fullName}: ${parsed.data.email}`);
        } else {
          logger.warn(`No email found for ${contact.fullName}`);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          logger.error(
            `Hunter API request failed for ${contact.fullName} (status ${err.response?.status}): ${JSON.stringify(err.response?.data)}`
          );
        } else {
          logger.error(`Error enriching contact ${contact.fullName}: ${err}`);
        }
      }

      index++;
      // 1.5-second delay between queries to respect Hunter's rate limits
      await delay(1500);
    }

    logger.log(
      "success",
      `Successfully enriched and found emails for ${leads.length} out of ${contacts.length} contacts`
    );
    return leads;
  }
}
