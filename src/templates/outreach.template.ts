import type { OutreachLead } from "../types/outreach.types.js";

export function buildEmail(lead: OutreachLead) {
  return {
    subject: `Quick question about ${lead.companyName}`,
    html: `
      <html>
        <body>
          <p>Hi ${lead.firstName},</p>

          <p>
            I came across ${lead.companyName} while researching innovative fintech companies.
          </p>

          <p>
            Your work as ${lead.title} caught my attention.
          </p>

          <p>
            I'd love to briefly connect and learn more about the challenges your team is solving.
          </p>

          <p>
            Looking forward to hearing from you.
          </p>

          <p>
            Regards,<br/>
            Ritabrata Ghosh
          </p>
        </body>
      </html>
    `,
  };
}
