import { brevoClient } from "../clients/brevo.client.js";
import { buildEmail } from "../templates/outreach.template.js";
import type { OutreachLead } from "../types/outreach.types.js";
import { logger } from "../utils/logger.js";
import { retry } from "../utils/retry.js";
import axios from "axios";

export class BrevoService {
  async sendBatch(leads: OutreachLead[]) {
    if (leads.length === 0) {
      logger.warn("No leads to send outreach emails to.");
      return;
    }

    logger.info(`Preparing to send personalized transactional emails to ${leads.length} leads via Brevo`);

    const messageVersions = leads.map((lead) => {
      const email = buildEmail(lead);
      return {
        to: [
          {
            email: lead.email,
            name: lead.fullName,
          },
        ],
        subject: email.subject,
        htmlContent: email.html,
      };
    });

    try {
      const res = await retry(async () => {
        return brevoClient.post("/smtp/email", {
          sender: {
            email: "coder@ritog.dev",
            name: "Ritabrata Ghosh",
          },
          subject: "Outreach Email",
          htmlContent: "<html><body>Outreach Email</body></html>",
          messageVersions,
        });
      });

      logger.log("success", `Successfully sent batch of ${leads.length} outreach emails via Brevo.`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Brevo API request failed (status ${error.response?.status}): ${JSON.stringify(error.response?.data)}`
        );
      } else {
        logger.error(`Error sending emails via Brevo Service: ${error}`);
      }
      throw error;
    }
  }

  async preview(leads: OutreachLead[]) {
    const previews = leads.map((lead) => {
      const email = buildEmail(lead);

      return {
        to: lead.email,
        subject: email.subject,
        company: lead.companyName,
      };
    });

    console.table(previews);
    return previews;
  }
}
