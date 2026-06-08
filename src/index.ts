import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { runOutreachPipeline } from "./pipeline/outreach.pipeline.js";
import { logger } from "./utils/logger.js";

async function main() {
  const rl = readline.createInterface({ input, output });
  try {
    const answer = await rl.question("Enter the target company domain (e.g. stripe.com): ");
    const company = answer.trim().toLowerCase();
    if (!company) {
      logger.error("Company domain cannot be empty.");
      return;
    }
    await runOutreachPipeline(company);
  } catch (err) {
    logger.error(`Error: ${err}`);
  } finally {
    rl.close();
  }
}

main();
