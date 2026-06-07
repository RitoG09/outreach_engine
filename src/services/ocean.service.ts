import { oceanClient } from "../clients/ocean.client.js";
import { OceanResponseSchema } from "../schemas/ocean.schema.js";
import type { TargetCompany } from "../types/ocean.types.js";
import { logger } from "../utils/logger.js";
import { retry } from "../utils/retry.js";

export class OceanService {
  async findLookalikeCompanies(domain: string): Promise<TargetCompany[]> {
    logger.info(`Finding lookalikes for ${domain}`);

    const res = await retry(async () => {
      return oceanClient.post("/v3/search/companies", {
        size: 5,
        fields: ["domain", "name"],
        companiesFilters: {
          lookalikeDomains: [domain],
        },
      });
    });

    const parsed = OceanResponseSchema.parse(res.data);

    const companies = parsed.companies
      .filter((company) => company.relevance === "A")
      .map((company) => ({
        domain: company.company.domain,
        name: company.company.name,
        relevance: company.relevance,
      }));

    logger.log(
      "success",
      `Ocean discovered ${companies.length} high-quality companies`,
    );
    logger.info(`Credits used: ${parsed.creditsUsed ?? 0}`);

    return companies;
  }
}
