import { OceanService } from "../services/ocean.service.js";
import { ProspeoService } from "../services/prospeo.service.js";
import { HunterService } from "../services/hunter.service.js";
import { BrevoService } from "../services/brevo.service.js";
import type { Contact, Lead } from "../types/contact.types.js";
import type { OutreachLead } from "../types/outreach.types.js";
import { logger, logSection } from "../utils/logger.js";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const ocean = new OceanService();
const prospeo = new ProspeoService();
const hunter = new HunterService();
const brevo = new BrevoService();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runOutreachPipeline(targetCompanyDomain: string): Promise<void> {
  logSection(`Outreach Pipeline Started for: ${targetCompanyDomain}`);

  try {
    const companies = await ocean.findLookalikeCompanies(targetCompanyDomain);
    const contacts: Contact[] = [];

    for (const company of companies) {
      try {
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
      // Redirect all emails to your personal inbox for testing
      outreachLeads.forEach((lead) => (lead.email = "76sonali40@gmail.com"));

      await brevo.preview(outreachLeads);

      const rl = readline.createInterface({ input, output });
      try {
        const answer = await rl.question(
          "\nDo you want to send the personalized outreach emails to these leads? (y/N): ",
        );
        if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
          logSection("Sending Emails via Brevo");
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
