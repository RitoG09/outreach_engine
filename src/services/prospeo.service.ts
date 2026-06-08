import { prospeoClient } from "../clients/prospeo.client.js";
import { SearchPersonSchema } from "../schemas/prospeo.schema.js";
import { retry } from "../utils/retry.js";
import type { Contact } from "../types/contact.types.js";
import { logger } from "../utils/logger.js";
import axios from "axios";

export class ProspeoService {
  async findDecisionMakers(domain: string): Promise<Contact[]> {
    logger.info(`Fetching decision makers for ${domain} from Prospeo`);

    try {
      const res = await retry(async () => {
        return prospeoClient.post("/search-person", {
          page: 1,
          filters: {
            company: {
              websites: {
                include: [domain],
              },
            },
            person_seniority: {
              include: ["C-Suite", "Vice President"],
            },
          },
        });
      });

      const parsed = SearchPersonSchema.parse(res.data);

      const contacts: Contact[] = parsed.results
        .filter((item) => item.person.linkedin_url !== null)
        .map((item) => ({
          personId: item.person.person_id,
          firstName: item.person.first_name,
          lastName: item.person.last_name,
          fullName: item.person.full_name,
          title: item.person.current_job_title ?? "Decision Maker",
          linkedinUrl: item.person.linkedin_url!,
          companyName: item.company?.name ?? "Unknown",
          companyDomain: item.company?.domain ?? domain,
        }))
        .slice(0, 2);

      logger.log(
        "success",
        `Prospeo retrieved ${contacts.length} decision makers for ${domain}`,
      );

      return contacts;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Prospeo API request failed (status ${error.response?.status}): ${JSON.stringify(error.response?.data)}`,
        );
      } else {
        logger.error(`Error in ProspeoService: ${error}`);
      }
      throw error;
    }
  }
}
