import { OceanService } from "../services/ocean.service.js";
import { ProspeoService } from "../services/prospeo.service.js";
import { HunterService } from "../services/hunter.service.js";
import { BrevoService } from "../services/brevo.service.js";
import type { Contact, Lead } from "../types/contact.types.js";
import type { OutreachLead } from "../types/outreach.types.js";
import { logger, logSection } from "../utils/logger.js";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { env } from "../config/env.js";

const ocean = new OceanService();
const prospeo = new ProspeoService();
const hunter = new HunterService();
const brevo = new BrevoService();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runOutreachPipeline(
  targetCompanyDomain: string,
): Promise<void> {
  logSection(`Outreach Pipeline Started for: ${targetCompanyDomain}`);

  try {
    // Service 1: OceanService - Find lookalike companies matching the target company domain
    const companies = await ocean.findLookalikeCompanies(targetCompanyDomain);
    const contacts: Contact[] = [];

    for (const company of companies) {
      try {
        // Service 2: ProspeoService - Find decision makers for each lookalike company
        const companyContacts = await prospeo.findDecisionMakers(
          company.domain,
        );
        contacts.push(...companyContacts);
      } catch (err) {
        logger.error(
          `Skipping decision makers for ${company.domain} due to error`,
        );
      }
      // 2-second delay between sequential Prospeo API calls to avoid rate limiting
      await delay(2000);
    }

    logSection("Enriching Contacts (LinkedIn to Email)");
    // Service 3: HunterService - Enrich found contacts with email addresses from LinkedIn URLs
    const leads: Lead[] = await hunter.enrichContacts(contacts);

    logSection("Pipeline Results");
    logger.log("success", `Retrieved ${leads.length} total leads with emails:`);
    console.log(JSON.stringify(leads, null, 2));

    const outreachLeads: OutreachLead[] = leads.map((lead) => ({
      fullName: lead.fullName,
      firstName: lead.firstName,
      title: lead.title,
      companyName: lead.companyName,
      companyDomain: lead.companyDomain,
      email: lead.email,
    }));

    if (outreachLeads.length > 0) {
      logSection("Outreach Email Previews");
      // Redirect all emails to the configured demo email for testing
      const targetTestEmail = env.demoEmail!;
      outreachLeads.forEach((lead) => (lead.email = targetTestEmail));

      // Service 4 (a): BrevoService - Preview the outreach email drafts
      await brevo.preview(outreachLeads);

      const rl = readline.createInterface({ input, output });
      try {
        const answer = await rl.question(
          "\nDo you want to send the personalized outreach emails to these leads? (y/N): ",
        );
        if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
          logSection("Sending Emails via Brevo");
          // Service 4 (b): BrevoService - Send the personalized outreach emails to the leads
          await brevo.sendBatch(outreachLeads);
        } else {
          logger.info("Outreach email dispatch cancelled by user.");
        }
      } finally {
        rl.close();
      }
    } else {
      logger.warn("No leads available for email outreach.");
    }
  } catch (err) {
    logger.error(`Pipeline run failed: ${err}`);
  }
}
