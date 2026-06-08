import { OceanService } from "./services/ocean.service.js";
import { ProspeoService } from "./services/prospeo.service.js";
import { HunterService } from "./services/hunter.service.js";
import type { Contact, Lead } from "./types/contact.types.js";
import { logger, logSection } from "./utils/logger.js";

const ocean = new OceanService();
const prospeo = new ProspeoService();
const hunter = new HunterService();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  logSection("Outreach Pipeline Started");

  try {
    const companies = await ocean.findLookalikeCompanies("stripe.com");
    const contacts: Contact[] = [];

    for (const company of companies) {
      try {
        const companyContacts = await prospeo.findDecisionMakers(company.domain);
        contacts.push(...companyContacts);
      } catch (err) {
        logger.error(`Skipping decision makers for ${company.domain} due to error`);
      }
      // 2-second delay between sequential Prospeo API calls to avoid rate limiting
      await delay(2000);
    }

    logSection("Enriching Contacts (LinkedIn to Email)");
    const leads: Lead[] = await hunter.enrichContacts(contacts);

    logSection("Pipeline Results");
    logger.log("success", `Retrieved ${leads.length} total leads with emails:`);
    console.log(JSON.stringify(leads, null, 2));

  } catch (err) {
    logger.error(`Pipeline run failed: ${err}`);
  }
}

main();
